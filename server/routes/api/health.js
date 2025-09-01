// server/routes/api/health.js
const express = require("express");
const os = require("os");
const mongoose = require("mongoose");

const router = express.Router();

// GET /<apiURL>/health
router.get("/", async (_req, res) => {
  let mongo = "unknown";
  try {
    const s = mongoose?.connection?.readyState; // 0,1,2,3
    if (typeof s === "number") {
      mongo = s === 1 ? "ok" : `state_${s}`;
      if (s === 1 && mongoose.connection.db?.admin) {
        await mongoose.connection.db.admin().ping();
      }
    }
  } catch {
    mongo = "down";
  }

  res.status(200).json({
    status: mongo === "ok" ? "ok" : "degraded",
    mongo,
    uptimeSec: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    node: process.version,
    host: os.hostname(),
    commit: process.env.COMMIT || "dev",
    env: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
