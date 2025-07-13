const express = require("express");
const Applicant = require("../models/applicant.model");
const router = express.Router();

// create an applicant
router.post("/", async (req, res) => {
  const {
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
    // if phone or email already exists, return error
    const existingApplicant = await Applicant.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingApplicant) {
      console.log(existingApplicant);
      return res.status(400).send("Phone or email already exists");
    }
    await applicant.save();
    res.status(201).send(applicant);
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(400).send(error);
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
