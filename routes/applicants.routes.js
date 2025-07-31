const express = require("express");
const Applicant = require("../models/applicant.model");
const router = express.Router();

// create an applicant
router.post("/", async (req, res) => {
  let {
    phone,
    email,
    name,
    gender,
    dob,
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
    expertise,
  } = req.body;

  try {
    // Normalize district input
    if (Array.isArray(district)) {
      district = district[0]; // Take first element if array
    }
    if (!district || district.trim() === "") {
      district = "online";
    } else {
      district = district.trim();
    }

    const militaryDetails = { rank, service, trade };
    const address = {
      village,
      ucNumber,
      houseNumber,
      district,
      street,
      colony,
      tehsil,
    };

    // Find existing registrations for this user
    const existingApplicants = await Applicant.find({ phone, email });

    // Determine job type for current registration
    const isOnlineJob = district === "online";

    // Check registration limits
    if (existingApplicants.length >= 2) {
      return res
        .status(400)
        .send("Maximum of two registrations allowed (one online, one onsite)");
    }

    // Check if user already has this job type registered
    const hasExistingJobType = existingApplicants.some((applicant) =>
      isOnlineJob
        ? applicant.address.district === "online"
        : applicant.address.district !== "online"
    );

    if (hasExistingJobType) {
      const jobType = isOnlineJob ? "online" : "onsite";
      return res
        .status(400)
        .send(`You already have a ${jobType} job registration`);
    }

    // Create new applicant
    const applicant = new Applicant({
      name,
      phone,
      email,
      dob,
      gender,
      education,
      category,
      militaryDetails,
      domicile,
      address,
      availability,
      expertise,
    });

    await applicant.save();
    res.status(201).send(applicant);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).send(error.message || "Registration failed");
  }
});
// get all applicants
router.get("/", async (req, res) => {
  try {
    const applicants = await Applicant.find();
    res.send(applicants);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
