// controllers/designation.controller.mjs
import db from "../config/db.config.mjs";

export const getAllDesignations = (req, res) => {
  const query = "SELECT * FROM designation";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};


