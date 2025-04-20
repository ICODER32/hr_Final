const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    requirements: {
      education: {
        type: [String],
        required: [true, "Education requirements are required"],
        enum: [
          "Matric",
          "FSc (Pre-Engineering)",
          "FSc (Pre-Medical)",
          "FA",
          "BA",
          "BS",
          "BCom",
          "MA",
          "MS",
          "PhD",
          "others",
        ],
      },
      age: {
        min: {
          type: Number,
          min: 18,
        },
        max: {
          type: Number,
          max: 65,
        },
      },
      experience: {
        type: String,
        required: [true, "Experience requirement is required"],
      },
      location: {
        city: {
          type: String,
          required: [true, "City is required"],
          trim: true,
        },

        country: {
          type: String,
          required: [true, "Country is required"],
          trim: true,
        },
      },
    },
    salary: {
      min: {
        type: Number,
        required: [true, "Minimum salary is required"],
      },
      max: {
        type: Number,
        required: [true, "Maximum salary is required"],
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    timing: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
      default: "Full-time",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: [true, "Job expiry date is required"],
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequently searched fields
jobSchema.index({
  title: "text",
  description: "text",
  "requirements.location": "text",
});

module.exports = mongoose.model("Job", jobSchema);
