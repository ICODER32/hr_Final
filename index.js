const express = require("express");
const connectDb = require("./config/db");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/applicants", require("./routes/applicants.routes"));
app.use("/api/jobs", require("./routes/jobs.routes"));
app.use("/api/jobApplicants", require("./routes/jobapplicants.routes"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectDb();
});
