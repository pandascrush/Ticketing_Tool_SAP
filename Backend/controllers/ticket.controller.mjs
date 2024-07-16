// controllers/ticket.controller.mjs
import db from "../config/db.config.mjs";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../config/email.config.mjs"; // Import the email transporter

// Get __dirname equivalent for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTicket = (req, res) => {
  const { company_name, company_short_name } = req.params;
  const { subject, ticket_body, client_id, priority_id, subdivision_id } = req.body;
  const screenshot = req.file;

  // Validate the client_id exists in the client table
  const checkClientQuery = "SELECT * FROM client WHERE client_id = ?";
  db.query(checkClientQuery, [client_id], (err, clientResults) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (clientResults.length === 0) {
      return res.status(400).json({ message: "Invalid client_id. The client does not exist." });
    }

    // Validate the priority_id exists in the priority_levels table
    const checkPriorityQuery = "SELECT * FROM priority_levels WHERE priority_id = ?";
    db.query(checkPriorityQuery, [priority_id], (err, priorityResults) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (priorityResults.length === 0) {
        return res.status(400).json({ message: "Invalid priority_id. The priority level does not exist." });
      }

      // Fetch the service_id using the subdivision_id
      const subdivisionQuery = "SELECT service_id, am_id FROM subdivisions WHERE subdivision_id = ?";
      db.query(subdivisionQuery, [subdivision_id], (err, subdivisionResults) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (subdivisionResults.length === 0) {
          return res.status(400).json({ message: "Invalid subdivision_id. The subdivision does not exist." });
        }

        const service_id = subdivisionResults[0].service_id;
        const am_id = subdivisionResults[0].am_id;

        // Store the path to the uploaded file
        const screenshotPath = screenshot ? path.join("/uploads", screenshot.filename) : null;

        // Generate a unique ticket identifier based on company short name
        const countQuery = "SELECT COUNT(*) AS count FROM ticket_raising WHERE company_name = ?";
        db.query(countQuery, [company_short_name], (err, countResults) => {
          if (err) {
            return res.status(500).json(err);
          }

          let ticketCount = countResults[0].count + 1;
          let uniqueTicketId = `${company_short_name}${ticketCount}`;

          // Function to check if the generated ticket_id already exists
          const generateUniqueTicketId = (callback) => {
            const checkTicketIdQuery = "SELECT ticket_id FROM ticket_raising WHERE ticket_id = ?";
            db.query(checkTicketIdQuery, [uniqueTicketId], (err, ticketIdResults) => {
              if (err) {
                return res.status(500).json(err);
              }

              if (ticketIdResults.length > 0) {
                ticketCount++;
                uniqueTicketId = `${company_short_name}${ticketCount}`;
                generateUniqueTicketId(callback); // Recursively check until a unique ticket_id is found
              } else {
                callback();
              }
            });
          };

          // Call the function to generate a unique ticket_id
          generateUniqueTicketId(() => {
            // Insert the ticket into the ticket table
            const insertTicketQuery = `
              INSERT INTO ticket_raising (
                ticket_id, subject, ticket_body, screenshot, client_id, priority_id, company_name, service_id, am_id, ticket_status_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            `;
            db.query(insertTicketQuery, [
              uniqueTicketId, subject, ticket_body, screenshotPath, client_id, priority_id, company_name, service_id, am_id, subdivision_id
            ], (err, results) => {
              if (err) {
                return res.status(500).json(err);
              }

              // Query to get the account manager's email and service head email
              const emailQuery = `
                SELECT
                  s.service_name,
                  sd.subdivision_name,
                  i.email AS account_manager_email,
                  c.email AS client_email
                FROM
                  client_services cs
                JOIN
                  services s ON cs.service_id = s.service_id
                JOIN
                  subdivisions sd ON cs.subdivision_id = sd.subdivision_id
                JOIN
                  internal i ON cs.am_id = i.am_id
                JOIN
                  client c ON cs.client_id = c.client_id
                WHERE
                  cs.client_id = ? AND cs.service_id = ?
              `;

              db.query(emailQuery, [client_id, service_id], (err, emailResults) => {
                if (err) {
                  return res.status(500).json(err);
                }

                if (emailResults.length === 0) {
                  return res.status(400).json({ message: "No email information found." });
                }

                const { service_name, subdivision_name, account_manager_email, client_email } = emailResults[0];

                // Send email to account manager
                const amMailOptions = {
                  from: "sivaranji5670@gmail.com",
                  to: account_manager_email,
                  subject: "New Ticket Raised",
                  html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="color: #333;">New Ticket Raised</h2>
                    <p style="font-size: 16px;">A new ticket has been raised for your service:</p>
                    <ul style="list-style-type: none; padding: 0;">
                      <li><strong>Service:</strong> ${service_name}</li>
                      <li><strong>Subdivision:</strong> ${subdivision_name}</li>
                      <li><strong>Subject:</strong> ${subject}</li>
                    </ul>
                    <p style="font-size: 16px;">Please check the details and address the issue as soon as possible.</p>
                  </div>
                `,
                };

                transporter.sendMail(amMailOptions, (error, info) => {
                  if (error) {
                    console.error("Error sending email to account manager:", error);
                    return res.status(500).json({ message: "Ticket created, but failed to send email to account manager." });
                  }

                  // Send email to client
                  const clientMailOptions = {
                    from: "sivaranji5670@gmail.com",
                    to: client_email,
                    subject: "Ticket Raised Confirmation",
                    html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                      <h2 style="color: #333;">Ticket Raised Confirmation</h2>
                      <p style="font-size: 16px;">You have raised a ticket for the service:</p>
                      <ul style="list-style-type: none; padding: 0;">
                        <li><strong>Service:</strong> ${service_name}</li>
                        <li><strong>Subdivision:</strong> ${subdivision_name}</li>
                        <li><strong>Subject:</strong> ${subject}</li>
                      </ul>
                      <p style="font-size: 16px;">We will address your issue as soon as possible. Thank you for your patience.</p>
                    </div>
                  `,
                  };

                  transporter.sendMail(clientMailOptions, (error, info) => {
                    if (error) {
                      console.error("Error sending email to client:", error);
                      return res.status(500).json({ message: "Ticket created, but failed to send email to client." });
                    }

                    res.status(201).json({
                      message: "Ticket created successfully and emails sent.",
                      ticket_id: uniqueTicketId,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

export const getCompanyTicketCounts = (req, res) => {
  const { am_id } = req.params;

  const query = `
        SELECT 
            tr.company_name,
            COUNT(tr.ticket_id) AS ticket_count
        FROM
            ticket_raising tr
        WHERE
            tr.am_id = ?
        GROUP BY
            tr.company_name
        ORDER BY
            MAX(tr.timestamp) DESC;
    `;

  db.query(query, [am_id], (err, results) => {
    if (err) {
      console.error("Error fetching ticket counts:", err);
      return res.status(500).send("Failed to fetch ticket counts.");
    }

    res.status(200).json(results);
  });
};

export const getAccountManagerTicketDetails = (req, res) => {
  const { am_id, company_name } = req.params;

  const query = `
        SELECT 
    tr.ticket_id,
    tr.subject,
    tr.ticket_body,
    tr.screenshot,
    tr.client_id,
    tr.priority_id,
    tr.company_name,
    tr.service_id,
    s.service_name,
    c.company AS client_company_name,
    c.email
FROM
    ticket_raising tr
JOIN
    services s ON tr.service_id = s.service_id
JOIN
    client c ON tr.client_id = c.client_id
WHERE
    tr.am_id = ? AND tr.company_name = ?
ORDER BY
    tr.timestamp DESC;
    `;

  db.query(query, [am_id, company_name], (err, results) => {
    if (err) {
      console.error("Error fetching ticket details:", err);
      return res.status(500).send("Failed to fetch ticket details.");
    }

    res.status(200).json(results);
  });
};

// Assigning ticket to the consultant
export const assignTicket = (req, res) => {
  const { clientMail, consultantMail, ticketId } = req.body;

  // Send email to the client
  const clientMailOptions = {
    from: 'sivaranji5670@gmail.com',
    to: clientMail,
    subject: 'Your Ticket Has Been Transferred',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #333;">Ticket Transferred</h2>
        <p>Your ticket has been transferred to a new consultant. Please find the details below:</p>
        <p><strong>New Consultant Email:</strong> ${consultantMail}</p>
        <p>Thank you for your patience.</p>
      </div>
    `
  };

  transporter.sendMail(clientMailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email to client:', err);
      return res.status(500).json({ message: 'Error sending email to client.' });
    }

    // Send email to the consultant
    const consultantMailOptions = {
      from: 'sivaranji5670@gmail.com',
      to: consultantMail,
      subject: 'New Task Assigned',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">New Task Assigned</h2>
          <p>You have been assigned a new task. Please find the details below:</p>
          <p><strong>Client Email:</strong> ${clientMail}</p>
          <p>Please complete the task within the specified duration.</p>
        </div>
      `
    };

    transporter.sendMail(consultantMailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email to consultant:', err);
        return res.status(500).json({ message: 'Error sending email to consultant.' });
      }

      // Update ticket status in the database
      const updateTicketQuery = 'UPDATE ticket_raising SET ticket_status_id = 2 WHERE ticket_id = ?';
      db.query(updateTicketQuery, [ticketId], (err, results) => {
        if (err) {
          console.error('Error updating ticket status:', err);
          return res.status(500).json({ message: 'Error updating ticket status.' });
        }

        res.status(200).json({ message: 'Ticket assigned, emails sent, and status updated successfully.' });
      });
    });
  });
};

