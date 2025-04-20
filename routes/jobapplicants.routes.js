// routes/applicantRoutes.js
const express = require("express");
const router = express.Router();
const Applicant = require("../models/Job_applicants");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter for PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Initialize Multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Modified POST route with file upload
router.post("/:jobId", upload.single("resume"), async (req, res) => {
  const { jobId } = req.params;
  const {
    name,
    dob,
    phone,
    email,
    education,
    category,
    rank,
    service,
    trade,
    domicile,
    village,
    ucNumber,
    houseNumber,
    district,
    street,
    colony,
    tehsil,
    availability,
  } = req.body;

  try {
    // Create new applicant with resume path
    const applicant = new Applicant({
      name,
      dob,
      phone,
      email,
      education,
      category,
      militaryDetails: { rank, service, trade },
      domicile,
      address: {
        village,
        ucNumber,
        houseNumber,
        district,
        street,
        colony,
        tehsil,
      },
      availability,
      resume: req.file ? req.file.path : null,
    });

    applicant.appliedJobs.push({
      job: jobId,
      status: "Applied",
      applicationDate: Date.now(),
    });

    await applicant.save();
    res.status(201).json(applicant);
  } catch (error) {
    console.error(error);
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
