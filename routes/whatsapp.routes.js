// routes/whatsapp.routes.js
const express = require("express");
const router = express.Router();
const { getQRCode, sendMessage, logout } = require("../services/whatsapp");

router.get("/qr", (req, res) => {
  const qr = getQRCode();
  res.json(qr);
});

router.post("/send", async (req, res) => {
  const { numbers, message } = req.body;
  try {
    await sendMessage(numbers, message);
    res.json({ success: true, message: "Messages sent successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/logout", async (req, res) => {
  try {
    await logout();
    res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
