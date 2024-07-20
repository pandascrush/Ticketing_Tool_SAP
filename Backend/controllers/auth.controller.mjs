import bcrypt from "bcrypt";
import db from "../config/db.config.mjs";
import jwt from "jsonwebtoken";

// Helper functions to fetch additional user data
const getClientData = (email) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT client_id, company, email, company_short_name FROM client WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const getInternalData = (identifier) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT int_id, emp_id, name, email, mobile, am_id, designation_id FROM internal WHERE email = ? OR emp_id = ?";
    db.query(query, [identifier, identifier], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const loginUser = (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be email or emp_id for internal users

  console.log("Login attempt with identifier:", identifier);

  // Query to find the user in the auth table by email or emp_id
  const query = "SELECT * FROM auth WHERE email = ? OR emp_id = ?";
  db.query(query, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Server error.");
    }

    if (results.length === 0) {
      console.log("No user found with the provided identifier.");
      return res.status(401).send("Invalid identifier or password.");
    }

    const user = results[0];
    console.log("User found:", user);

    try {
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).send("Invalid identifier or password.");
      }

      // Determine the user type based on designation_id
      let userType, userData;

      if (user.designation_id === 6) {
        // Client
        console.log(user.designation_id);
        userType = "Client";
        userData = await getClientData(user.email); // Fetch additional client data
      } else {
        // Internal user
        userType = "Internal";
        userData = await getInternalData(identifier); // Fetch additional internal user data
      }

      console.log("User data:", userData);

      // Generate JWT token
      const tokenPayload = { designation_id: user.designation_id };
      const token = jwt.sign(tokenPayload, process.env.secretKey, {
        expiresIn: "1h",
      });

      // Set token as an HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure flag in production
        sameSite: "strict",
      });

      res.status(200).json({
        userType,
        ...userData,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Server error.");
    }
  });
};

export const Verify = async (req, res) => {
  res.json({ status: true, msg: "authorized" });
};

export const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send("Logged out successfully");
};
