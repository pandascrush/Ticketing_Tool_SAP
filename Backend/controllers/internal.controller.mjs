// controllers/internal.controller.mjs
import db from "../config/db.config.mjs";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import transporter from "../config/email.config.mjs";

// Function to generate a random password
const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const getAllInternals = (req, res) => {
  const query = `
        SELECT i.emp_id, i.int_id, i.name, i.email, i.mobile, d.designation_name, i.timestamp
        FROM internal i
        JOIN designation d ON i.designation_id = d.designation_id
    `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

export const createInternal = (req, res) => {
  const { name, email, mobile, designation_id, emp_id, am_id, head_id } =
    req.body;

  // Validate the email format
  const emailRegex = /^[\w-\.]+@kggeniuslabs\.com$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .send("Please enter a valid email address ending with @kggeniuslabs.com");
  }

  // Check for duplicate email in the internal table
  const checkEmailQuery = "SELECT * FROM internal WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, existingUser) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).send("Failed to check email.");
    }

    if (existingUser.length > 0) {
      return res
        .status(400)
        .send("Email already exists. Please use a different email address.");
    }

    // Generate a random password for the user
    const password = generatePassword();

    // Hash the password with bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Failed to hash password.");
      }

      // Insert the new internal user into the database
      const insertQuery = `
        INSERT INTO internal (int_id, name, email, mobile, designation_id, password, emp_id, am_id, head_id)
        VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [
          name,
          email,
          mobile,
          designation_id,
          hashedPassword,
          emp_id,
          am_id || null,
          head_id || null,
        ],
        (err, insertResult) => {
          if (err) {
            console.error("Error inserting internal user:", err);
            return res.status(500).send("Failed to create internal user.");
          }

          const empId = insertResult.insertId;

          // Insert into the auth table (assuming this is necessary for authentication)
          const authInsertQuery = `
          INSERT INTO auth (email, password, designation_id, emp_id)
          VALUES (?, ?, ?, ?)
        `;
          db.query(
            authInsertQuery,
            [email, hashedPassword, designation_id, emp_id],
            (err) => {
              if (err) {
                console.error("Error inserting into auth table:", err);
                return res.status(500).send("Failed to create internal user.");
              }

              // Send the password via email
              const mailOptions = {
                from: "sivaranji5670@gmail.com", // Replace with your email
                to: email,
                subject: "Your Account Password",
                text: `Hello ${name},\n\nYour account has been created successfully. Your password is: ${password}\n\nPlease change your password after logging in for the first time.\n\nBest regards,\nYour Team`,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email:", error);
                  return res
                    .status(500)
                    .send("User created, but failed to send email.");
                }
                res.status(201).json({
                  message:
                    "Internal user created successfully and password sent via email.",
                  empId,
                });
              });
            }
          );
        }
      );
    });
  });
};


export const getInternalByHeadId = async (req, res) => {
  const {id} = req.params; 
  console.log(id);
  
  try {
    const sql = `
      SELECT *
      FROM internal
      WHERE head_id = ?
    `;
    db.query(sql, [id], (error, results) => {
      if (error) {
        console.error("Error fetching internal records:", error);
        res.status(500).send("Error fetching internal records");
      } else {
        console.log("Filtered Internal Records:", results);
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching internal records");
  }
};