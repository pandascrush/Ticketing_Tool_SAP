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
