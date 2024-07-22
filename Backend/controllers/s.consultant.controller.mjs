import db from "../config/db.config.mjs";
import transporter from "../config/email.config.mjs";
import path from "path";

export const getCompaniesWithTicketCounts = (req, res) => {
  const { emp_id } = req.params;

  const query = `
      SELECT 
        company_name, 
        COUNT(ticket_id) AS ticket_count 
      FROM 
        ticket_raising 
      WHERE 
        consultant_emp_id = ? 
      GROUP BY 
        company_name
    `;

  db.query(query, [emp_id], (err, results) => {
    if (err) {
      console.error("Error fetching companies with ticket counts:", err);
      return res.status(500).json({ message: "Server error." });
    }

    res.status(200).json(results);
  });
};

export const getTicketsForCompanyAndConsultant = (req, res) => {
  const { emp_id, company_name } = req.params;

  const query = `
        SELECT 
          tr.ticket_id, 
          tr.client_id, 
          tr.subject, 
          tr.ticket_body, 
          tr.ticket_status_id, 
          ts.status_name,
          tr.timestamp,
          tr.am_id,
          CONCAT('http://localhost:5002', tr.screenshot) AS screenshot
        FROM 
          ticket_raising tr
        JOIN 
          ticket_status ts ON tr.ticket_status_id = ts.ticket_status_id
        WHERE 
          tr.consultant_emp_id = ?
          AND tr.company_name = ?
        ORDER BY 
          tr.timestamp DESC
      `;

  db.query(query, [emp_id, company_name], (err, results) => {
    if (err) {
      console.error("Error fetching tickets for company and consultant:", err);
      return res.status(500).json({ message: "Server error." });
    }

    res.status(200).json(results);
  });
};

export const submitTicketCorrection = (req, res) => {
  const { ticket_id, subject, ticket_body, screenshot, am_id, emp_id } =
    req.body;
  let corrected_file = req.file ? req.file.path : null;

  // Validate the corrected file is a PDF
  if (corrected_file && !corrected_file.toLowerCase().endsWith(".pdf")) {
    // Remove the non-PDF file from the server
    fs.unlinkSync(corrected_file);
    return res.status(400).json({ error: "The corrected file must be a PDF." });
  }

  // Prefix the file names with the uploads folder
  const screenshotFileName = screenshot
    ? path.join("uploads", path.basename(screenshot))
    : null;

  if (corrected_file) {
    const correctedFileName = path.basename(corrected_file);
    corrected_file = path.join("uploads", correctedFileName);
  }

  console.log(
    "Corrected File:",
    corrected_file,
    "Corrected File Name:",
    path.basename(corrected_file)
  );
  console.log(
    ticket_id,
    subject,
    ticket_body,
    screenshotFileName,
    am_id,
    emp_id,
    path.basename(corrected_file)
  );

  const query = `
    INSERT INTO ticket_submission (ticket_id, subject, ticket_body, screenshot, corrected_file, am_id, emp_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      ticket_id,
      subject,
      ticket_body,
      screenshotFileName,
      corrected_file,
      am_id,
      emp_id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting ticket correction:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Fetch account manager email
      const amQuery = `SELECT email FROM internal WHERE am_id = ?`;
      db.query(amQuery, [am_id], (amErr, amResults) => {
        if (amErr) {
          console.error("Error fetching account manager email:", amErr);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (amResults.length > 0) {
          const accountManagerEmail = amResults[0].email;

          // Send email to account manager
          const mailOptions = {
            from: "sivaranji5670@gmail.com",
            to: accountManagerEmail,
            subject: "Ticket Correction Submitted",
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
              <h2 style="color: #333;">Ticket Correction Submitted</h2>
              <p>A correction has been submitted for the following ticket:</p>
              <ul style="list-style-type: none; padding: 0;">
                <li><strong>Ticket ID:</strong> ${ticket_id}</li>
                <li><strong>Subject:</strong> ${subject}</li>
                <li><strong>Submitted At:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
          `,
            attachments: corrected_file
              ? [
                  {
                    filename: path.basename(corrected_file),
                    path: corrected_file,
                  },
                ]
              : [],
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email to account manager:", error);
            } else {
              console.log(
                `Correction email sent to account manager for ticket ${ticket_id}`
              );
            }
          });
        }

        res.status(200).json({ message: "Correction submitted successfully" });
      });
    }
  );
};

export const getSubmitTicketChanges = (req, res) => {
  const { ticket_id, am_id } = req.params;

  const query = `
    SELECT 
      tsc.*, 
      i.name AS am_name, 
      i.email as ac_email
    FROM 
      ticket_submission_changes tsc
    JOIN 
      internal i ON tsc.am_id = i.am_id
    WHERE 
      tsc.ticket_id = ? 
      AND tsc.am_id = ? 
    ORDER BY 
      tsc.created_at DESC
  `;

  db.query(query, [ticket_id, am_id], (error, changes) => {
    if (error) {
      console.error("Error fetching ticket submission changes:", error);
      return res.status(500).send("Server Error");
    }

    res.json(changes);
  });
};


export const getSubmitTicketChangesCount = async (req, res) => {
  const { ticket_id } = req.params;

  try {
    db.query(
      "SELECT COUNT(*) as count FROM ticket_submission_changes WHERE ticket_id = ?",
      [ticket_id],
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          const count = result[0].count;
          res.json({ count });
        }
      }
    );
  } catch (error) {
    console.error("Error fetching ticket submission count:", error);
    res.status(500).send("Server Error");
  }
};
