// services/whatsapp.js
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const puppeteer = require("puppeteer");

let clientReady = false;
let qrCodeImage = "";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: puppeteer.executablePath(), // this is key!
  },
});

client.on("qr", async (qr) => {
  qrCodeImage = await qrcode.toDataURL(qr);
  clientReady = false;
});

client.on("ready", () => {
  console.log("✅ WhatsApp client is ready!");
  clientReady = true;
});

client.on("auth_failure", () => {
  console.log("❌ Auth failure");
  clientReady = false;
});

client.initialize();

module.exports = {
  getQRCode: () => ({ qr: qrCodeImage, ready: clientReady }),
  sendMessage: async (numbers, message) => {
    if (!clientReady) throw new Error("WhatsApp client not ready");
    for (const number of numbers) {
      const formatted = number.includes("@c.us") ? number : `${number}@c.us`;
      await client.sendMessage(formatted, message);
    }
  },
  logout: async () => {
    if (clientReady) {
      await client.logout();
      clientReady = false;
      qrCodeImage = "";
    } else {
      throw new Error("Client not initialized or already logged out");
    }
  },
};
