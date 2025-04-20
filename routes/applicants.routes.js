const express = require("express");
const Applicant = require("../models/applicant.model");
const router = express.Router();

// create an applicant
router.post("/", async (req, res) => {
  const {
    phone,
    email,
    name,
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
