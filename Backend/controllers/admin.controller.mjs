import db from "../config/db.config.mjs";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import transporter from "../config/email.config.mjs";

export const getClientServices = (req, res) => {
  const query = `
   SELECT 
        c.client_id,
        c.company,
        c.email,
        GROUP_CONCAT(s.service_name) AS services,
        GROUP_CONCAT(sd.subdivision_name) AS subdivisions
    FROM
        client c
    LEFT JOIN
        client_services cs ON c.client_id = cs.client_id
    LEFT JOIN
        services s ON cs.service_id = s.service_id
    LEFT JOIN
        subdivisions sd ON cs.subdivision_id = sd.subdivision_id
    GROUP BY
        c.client_id, c.company, c.email;
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching client services:", err);
      return res.status(500).send("Server error. Failed to fetch data.");
    }

    res.json(results);
  });
};

export const getAvailableServices = (req, res) => {
  const clientId = req.params.clientId;

  const query = `
      SELECT 
        s.service_id,
        s.service_name,
        sub.subdivision_id,
        sub.subdivision_name,
        sub.am_id
      FROM services s
      JOIN subdivisions sub ON s.service_id = sub.service_id
      WHERE sub.subdivision_id NOT IN (
        SELECT subdivision_id 
        FROM client_services 
        WHERE client_id = ?
      )
    `;

  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching available services:", err);
      return res.status(500).send("Server error. Failed to fetch data.");
    }

    res.json(results);
  });
};

export const getTicketsCountAndStatus = (req, res) => {
  const sql = `SELECT ticket_status_id, COUNT(*) AS ticket_count
FROM ticket_raising
GROUP BY ticket_status_id;
`;

  db.query(sql, (err, result) => {
    if (err) {
      res.json({ message: err });
    } else {
      res.json(result);
    }
  });
};

export const getAllTickets = (req, res) => {
  const query = `
SELECT 
    tr.ticket_id,
    tr.ticket_body,
    tr.subject,
    tr.company_name,
    COALESCE(consultant.email, 'N/A') AS consultant_mail,
    COALESCE(account_manager.email, 'N/A') AS account_manager_mail,
    COALESCE(ts.status_name, 'Unknown') AS status_name
FROM 
    ticket_raising tr
LEFT JOIN 
    internal consultant ON tr.consultant_emp_id = consultant.emp_id
LEFT JOIN 
    internal account_manager ON tr.am_id = account_manager.am_id
LEFT JOIN 
    ticket_status ts ON tr.ticket_status_id = ts.ticket_status_id;

  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching tickets:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
};

export const getClientCompanyCount = (req, res) => {
  const query = "SELECT COUNT(DISTINCT company) AS company_count FROM client";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching company count:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const companyCount = results[0].company_count;
    res.json({ companyCount });
  });
};

export const getClientDetails = (req, res) => {
  const query = `
    SELECT 
      client_id,
      company,
      email,
      address,
      gst_no,
      company_short_name,
      phone,
      timestamp
    FROM 
      client;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching client details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
};

export const getAllInternalCount = async (req, res) => {
  try {
    // Define the query to count the users in the internal table
    const query = "SELECT COUNT(*) AS user_count FROM internal";

    // Execute the query
    db.query(query, (err, result) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getInternalDetails = (req, res) => {
  const query = `
 SELECT 
    i.name AS Employee_name,
    i.email,
    i.mobile,
    i.emp_id,
    i.am_id,
    i.head_id,
    COUNT(tr_consultant.ticket_id) AS consultant_ticket_count,
    COUNT(tr_account_manager.ticket_id) AS account_manager_ticket_count
FROM 
    internal i
LEFT JOIN 
    ticket_raising tr_consultant ON i.emp_id = tr_consultant.consultant_emp_id
LEFT JOIN 
    ticket_raising tr_account_manager ON i.am_id = tr_account_manager.am_id
GROUP BY 
    i.emp_id, i.name, i.email, i.mobile, i.am_id, i.head_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching internal details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(results);
  });
};

export const getDomainFilteredTickets = (req, res) => {
  const query = `
   SELECT 
  am_id,
  COUNT(*) AS ticket_count,
  (SELECT COUNT(*) FROM ticket_raising) AS total_no_tickets
FROM 
  ticket_raising
GROUP BY 
  am_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Error executing query");
      return;
    }
    res.json(results);
  });
};

export const getAmIdBasedTicketFetch = (req, res) => {
  const { am_id } = req.params;

  // Base URL for accessing screenshots
  const baseUrl = "http://localhost:5002";

  const query = `
    SELECT 
        tr.ticket_id,
        tr.ticket_body,
        tr.company_name,
        e1.email AS consultant_email,
        e2.email AS account_manager_email,
        ts.status_name,
        CONCAT('${baseUrl}', tr.screenshot) AS attachment
    FROM
        ticket_raising tr
    LEFT JOIN
        internal e1 ON tr.consultant_emp_id = e1.emp_id
    JOIN
        internal e2 ON tr.am_id = e2.am_id
    JOIN
        ticket_status ts ON tr.ticket_status_id = ts.ticket_status_id
    WHERE
        tr.am_id = ?;
  `;

  db.query(query, [am_id], (error, results) => {
    if (error) {
      console.error("Error fetching ticket details:", error);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res
        .status(404)
        .json({ message: "No ticket details found for the given AM ID." });
    }
  });
};
