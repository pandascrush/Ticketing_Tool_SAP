// controllers/client.controller.mjs
import db from "../config/db.config.mjs";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import transporter from "../config/email.config.mjs";

export const getAllClients = (req, res) => {
  const query = "SELECT * FROM client";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

// Function to generate a random password (You can customize this function)
const generatePassword = () => {
  return Math.random().toString(36).slice(-8); // Generate an 8-character random password
};

export const createClient = (req, res) => {
  console.log("data starteds");
  const {
    company,
    address,
    VAT_number,
    city,
    phone,
    state,
    website,
    zip_code,
    groups,
    country,
    currency,
    gst_no,
    street,
    email,
    company_short_name,
    emp_id, // Added emp_id for client
  } = req.body;

  console.log(req.body);

  // Check for duplicate email in the client table
  const checkEmailQuery = "SELECT * FROM client WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, clientResults) => {
    if (err) {
      console.error("Error checking email in client table:", err);
      return res
        .status(500)
        .json({ message: "Server error. Failed to check email." });
    }
    if (clientResults.length > 0) {
      return res.status(400).json({
        message:
          "Email already exists in the client table. Please use a different email address.",
      });
    }

    // Check for duplicate email in the auth table
    const checkAuthEmailQuery = "SELECT * FROM auth WHERE email = ?";
    db.query(checkAuthEmailQuery, [email], (err, authResults) => {
      if (err) {
        console.error("Error checking email in auth table:", err);
        return res
          .status(500)
          .json({ message: "Server error. Failed to check email." });
      }
      if (authResults.length > 0) {
        return res.status(400).json({
          message:
            "Email already exists in the auth table. Please use a different email address.",
        });
      }

      // Generate a password
      const password = generatePassword();

      // Hash the password with bcrypt
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password." });
        }

        // Insert into the client table
        const insertClientQuery = `INSERT INTO client (
                    company, address, VAT_number, city, phone, state, website, zip_code, group_name, country, 
                    currency, gst_no, street, email, company_short_name, password
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          insertClientQuery,
          [
            company,
            address,
            VAT_number,
            city,
            phone,
            state,
            website,
            zip_code,
            groups,
            country,
            currency,
            gst_no,
            street,
            email,
            company_short_name,
            hashedPassword,
          ],
          (err, clientInsertResult) => {
            if (err) {
              console.error("Error inserting into client table:", err);
              return res
                .status(500)
                .json({ message: "Server error. Failed to create client." });
            }

            const clientId = clientInsertResult.insertId; // Get the inserted client_id

            // Insert into the auth table
            const authInsertQuery =
              "INSERT INTO auth (email, password, designation_id, client_id, emp_id) VALUES (?, ?, ?, ?, ?)";
            db.query(
              authInsertQuery,
              [email, hashedPassword, 6, clientId, emp_id],
              (err) => {
                if (err) {
                  console.error("Error inserting into auth table:", err);
                  return res.status(500).json({
                    message:
                      "Client created, but failed to store credentials in auth table.",
                  });
                }

                // Send the password via email
                const mailOptions = {
                  from: "sivaranji5670@gmail.com", // Replace with your email
                  to: email,
                  subject: "Your Account Password",
                  text: `Hello,\n\nYour account has been created successfully. Your password is: ${password}\n\nPlease change your password after logging in for the first time.\n\nBest regards,\nYour Team`,
                };

                console.log(mailOptions);

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).json({
                      message: "Client created, but failed to send email.",
                    });
                  }

                  // Respond with client ID and success message
                  res.status(201).json({
                    clientId: clientId,
                    message:
                      "Client created successfully and password sent via email.",
                  });
                });
              }
            );
          }
        );
      });
    });
  });
};

export const getClientById = (req, res) => {
  const { client_id } = req.params;
  const query = "SELECT * FROM client WHERE client_id = ?";
  db.query(query, [client_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Client not found");
    }
    res.status(200).json(results[0]);
  });
};

export const updateClient = (req, res) => {
  const { client_id } = req.params;
  const {
    company,
    address,
    VAT_number,
    city,
    phone,
    state,
    website,
    zip_code,
    groups,
    country,
    currency,
    gst_no,
    street,
  } = req.body;
  const query =
    "UPDATE client SET company = ?, address = ?, VAT_number = ?, city = ?, phone = ?, state = ?, website = ?, zip_code = ?, groups = ?, country = ?, currency = ?, gst_no = ?, street = ? WHERE client_id = ?";
  db.query(
    query,
    [
      company,
      address,
      VAT_number,
      city,
      phone,
      state,
      website,
      zip_code,
      groups,
      country,
      currency,
      gst_no,
      street,
      client_id,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Client not found");
      }
      res.status(200).send("Client updated successfully");
    }
  );
};

export const deleteClient = (req, res) => {
  const { client_id } = req.params;
  const query = "DELETE FROM client WHERE client_id = ?";
  db.query(query, [client_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Client not found");
    }
    res.status(200).send("Client deleted successfully");
  });
};

export const getClientCompanyDetail = async (req, res) => {
  const { id } = req.params;

  const sql = `select company,company_short_name from client where client_id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
};
