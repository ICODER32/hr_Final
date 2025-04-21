const Query = require("../models/query.model");
const express = require("express");

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newQuery = new Query({
      name,
      email,
      subject,
      message,
    });

    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single query by ID
router.get("/:id", async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
