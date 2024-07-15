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

// Configure nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "sivaranji5670@gmail.com", // Replace with your email
//     pass: "jlja febg xbfg bhyi", // Replace with your email password
//   },
// });

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
  const { name, email, mobile, designation_id, emp_id } = req.body;

  // Validate the email to end with @kggeniuslabs.com
  const emailRegex = /^[\w-\.]+@kggeniuslabs\.com$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .send("Please enter a valid email address ending with @kggeniuslabs.com");
  }

  // Check for duplicate email in the internal table
  const checkEmailQuery = "SELECT * FROM internal WHERE email = ?";
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      return res
        .status(400)
        .send("Email already exists. Please use a different email address.");
    }

    try {
      // Generate a random password for the user
      const password = generatePassword();

      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // If email is unique, proceed to insert the new internal user
      const insertQuery =
        "INSERT INTO internal (int_id,name, email, mobile, designation_id, password, emp_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        insertQuery,
        [null, name, email, mobile, designation_id, hashedPassword, emp_id],
        (err, results) => {
          if (err) {
            return res.status(500).send(err);
          }

          // Retrieve the inserted employee's emp_id
          const empId = results.insertId;

          // Insert into the auth table
          const authInsertQuery =
            "INSERT INTO auth (email, password, designation_id, emp_id) VALUES (?, ?, ?, ?)";
          db.query(
            authInsertQuery,
            [email, hashedPassword, designation_id, emp_id],
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .send(
                    "Internal user created, but failed to store credentials in auth table."
                  );
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
                res
                  .status(201)
                  .json({
                    message:
                      "Internal user created successfully and password sent via email.",
                    empId,
                  });
              });
            }
          );
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).send("Failed to hash password.");
    }
  });
};
