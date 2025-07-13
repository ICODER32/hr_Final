const mongoose = require("mongoose");

const militaryDetailsSchema = new mongoose.Schema({
  rank: String,
  service: String,
  trade: String,
});

// Add job application sub-schema
const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Applied", "Under Review", "Shortlisted", "Rejected"],
    default: "Applied",
  },
});

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "",
  },
  militaryDetails: militaryDetailsSchema,
  domicile: {
    type: String,
    required: true,
  },
  address: {
    village: String,
    ucNumber: String,
    houseNumber: String,
    street: String,
    colony: String,
    tehsil: String,
    district: {
      type: String,
      required: true,
    },
  },
  availability: {
    type: String,
    enum: ["Immediately", "After 1 Month", "More than 1 Month"],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },

  appliedJobs: [jobApplicationSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resume: {
    type: String,
    required: true,
  },
});

const Applicant = mongoose.model("JobApplicant", applicantSchema);

module.exports = Applicant;
