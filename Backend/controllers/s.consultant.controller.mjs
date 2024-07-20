import db from "../config/db.config.mjs";

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
