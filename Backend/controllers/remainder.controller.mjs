import db from "../config/db.config.mjs";
import transporter from "../config/email.config.mjs";
import cron from "node-cron";
import moment from "moment";

// Function to send reminder email to account manager
const sendReminderEmail = (ticket) => {
  const { ticket_id, subject, timestamp, account_manager_email } = ticket;

  const mailOptions = {
    from: 'sivaranji5670@gmail.com',
    to: account_manager_email,
    subject: 'Reminder: Unassigned Ticket',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #333;">Reminder: Unassigned Ticket</h2>
        <p>A ticket has been raised and remains unassigned for more than 30 minutes. Please assign it as soon as possible:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Ticket ID:</strong> ${ticket_id}</li>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Created At:</strong> ${moment(timestamp).format('DD-MM-YYYY HH:mm:ss')}</li>
        </ul>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reminder email to account manager:', error);
    } else {
      console.log(`Reminder email sent to account manager for ticket ${ticket_id}`);
      // Mark the reminder email as sent
      db.query(
        "UPDATE ticket_raising SET reminder_email_sent = 1 WHERE ticket_id = ?",
        [ticket_id],
        (updateErr) => {
          if (updateErr) {
            console.error('Error updating reminder email status:', updateErr);
          }
        }
      );
    }
  });
};

// Function to send email to admin
const sendAdminEmail = (ticket) => {
  const { ticket_id, subject, timestamp } = ticket;

  const mailOptions = {
    from: 'sivaranji5670@gmail.com',
    to: 'siva.v@kggeniuslabs.com',
    subject: 'Unassigned Ticket Alert',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #333;">Unassigned Ticket Alert</h2>
        <p>The following ticket has not been assigned to a consultant for over an hour:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Ticket ID:</strong> ${ticket_id}</li>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Created At:</strong> ${moment(timestamp).format('DD-MM-YYYY HH:mm:ss')}</li>
        </ul>
        <p>Please follow up with the account manager.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to admin:', error);
    } else {
      console.log(`Admin email sent for ticket ${ticket_id}`);
      // Mark the admin email as sent
      db.query(
        "UPDATE ticket_raising SET admin_email_sent = 1 WHERE ticket_id = ?",
        [ticket_id],
        (updateErr) => {
          if (updateErr) {
            console.error('Error updating admin email status:', updateErr);
          }
        }
      );
    }
  });
};

// Function to check for unassigned tickets and send appropriate emails
const checkForUnassignedTickets = () => {
  const query = `
    SELECT
      t.ticket_id,
      t.subject,
      t.timestamp,
      t.am_id,
      i.email AS account_manager_email,
      t.reminder_email_sent,
      t.admin_email_sent
    FROM
      ticket_raising t
    JOIN
      internal i ON t.am_id = i.am_id
    WHERE
      t.consultant_emp_id IS NULL
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching unassigned tickets:', err);
      return;
    }

    const now = moment();

    results.forEach(ticket => {
      const ticketTimestamp = moment(ticket.timestamp);
      const diffInMinutes = now.diff(ticketTimestamp, 'minutes');

      if (diffInMinutes >= 30 && ticket.reminder_email_sent === 0) {
        sendReminderEmail(ticket);
      } else if (diffInMinutes >= 60 && ticket.admin_email_sent === 0) {
        sendAdminEmail(ticket);
      }
    });
  });
};

// Schedule the job to run every 10 minutes
cron.schedule('*/10 * * * *', checkForUnassignedTickets);
