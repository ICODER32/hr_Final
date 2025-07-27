const e = require("express");
const express = require("express");
const mongoose = require("mongoose");

const militaryDetailsSchema = new mongoose.Schema({
  rank: String,
  service: String,
  trade: String,
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
  education: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["civilian", "retired"],
    required: true,
  },
  militaryDetails: militaryDetailsSchema,
  domicile: {
    type: String,
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
      default: "online",
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
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expertise: {
    type: String,
  },
});

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;
