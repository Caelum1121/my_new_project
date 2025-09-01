// server/routes/index.js
const router = require("express").Router();
const apiRoutes = require("./api"); // folder or file is fine
const health = require("./api/health");

const keys = require("../config/keys");
const { apiURL } = keys.app; // e.g. "api"
const api = `/${apiURL}`;

// Health under /<apiURL>/health (e.g. /api/health)
router.use(`${api}/health`, health);

// Simple liveness: /<apiURL>/ping (e.g. /api/ping)
router.get(`${api}/ping`, (_req, res) =>
  res.status(200).json({ status: "ok", message: "pong" })
);

// Other API routes under /<apiURL>
router.use(api, apiRoutes);

// API-scoped 404 (keep last)
router.use(api, (_req, res) => res.status(404).json("No API route found"));

module.exports = router;
