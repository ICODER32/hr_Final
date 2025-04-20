// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// Public routes
router.route("/").get(getJobs);
router.route("/:id").get(getJobById);

// Admin routes
router.route("/").post(createJob);
router.route("/:id").put(updateJob).delete(deleteJob);

module.exports = router;
