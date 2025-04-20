// routes/applicantRoutes.js
const express = require("express");
const router = express.Router();
const Applicant = require("../models/Job_applicants");

// Create new applicant with job applications
router.post("/", async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    await applicant.save();
    res.status(201).json(applicant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all applicants with filters
router.get("/", async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const filter = {};

    if (jobId) filter["appliedJobs.job"] = jobId;
    if (status) filter["appliedJobs.status"] = status;

    const applicants = await Applicant.find(filter).populate("appliedJobs.job");
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single applicant
router.get("/:id", async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate(
      "appliedJobs.job"
    );
    if (!applicant)
      return res.status(404).json({ message: "Applicant not found" });
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update applicant
router.put("/:id", async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(applicant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete applicant
router.delete("/:id", async (req, res) => {
  try {
    await Applicant.findByIdAndDelete(req.params.id);
    res.json({ message: "Applicant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status for a specific job
router.patch("/:applicantId/applications/:jobId", async (req, res) => {
  try {
    const applicant = await Applicant.findOneAndUpdate(
      {
        _id: req.params.applicantId,
        "appliedJobs.job": req.params.jobId,
      },
      {
        $set: { "appliedJobs.$.status": req.body.status },
      },
      { new: true }
    );

    res.json(applicant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
