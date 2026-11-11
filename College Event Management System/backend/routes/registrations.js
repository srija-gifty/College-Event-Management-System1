const express = require("express");
const Registration = require("../models/Registration");
const adminOnly = require("../middleware/auth");

const router = express.Router();

// Student: register for an event
router.post("/", async (req, res) => {
  const { event, name, rollNo, email } = req.body;

  const already = await Registration.findOne({ event, rollNo });
  if (already) {
    return res.status(400).json({ message: "This roll number is already registered" });
  }

  try {
    const reg = await Registration.create({ event, name, rollNo, email });
    res.status(201).json(reg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: see participants of one event
router.get("/event/:eventId", adminOnly, async (req, res) => {
  const regs = await Registration.find({ event: req.params.eventId });
  res.json(regs);
});

// Admin: mark attended / not attended
router.put("/:id/attendance", adminOnly, async (req, res) => {
  const reg = await Registration.findByIdAndUpdate(
    req.params.id,
    { attended: req.body.attended },
    { new: true }
  );
  res.json(reg);
});

module.exports = router;
