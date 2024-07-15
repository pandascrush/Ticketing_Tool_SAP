// controllers/user.controller.mjs
import db from "../config/db.config.mjs";

export const getAllUserTypes = (req, res) => {
  const query = "SELECT * FROM user_type";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};
