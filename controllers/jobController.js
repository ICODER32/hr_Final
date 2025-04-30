// controllers/jobController.js
const Job = require("../models/Jobs");
const asyncHandler = require("express-async-handler");

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = asyncHandler(async (req, res) => {
  const { title, description, requirements, salary, timing, expiryDate } =
    req.body;

  const job = await Job.create({
    title,
    description,
    requirements: {
      education: requirements.education,
      age: {
        min: requirements.age.min,
        max: requirements.age.max,
      },
      experience: requirements.experience,
      location: requirements.location,
    },
    salary: {
      min: salary.min,
      max: salary.max,
      currency: salary.currency || "USD",
    },
    timing,
    expiryDate,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const { active } = req.query;
  const filter = {};

  if (active === "true") {
    filter.isActive = true;
    filter.expiryDate = { $gt: new Date() };
  }

  const jobs = await Job.find(filter).sort("-postedAt");
  res.json(jobs);
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );

  res.json(updatedJob);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  res.json({ message: "Job removed" });
});

// get jobs with applicants

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
