const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const adminOnly = require("../middleware/auth");

const router = express.Router();

// Anyone: list all events (soonest first)
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
});

// Admin: create event
router.post("/", adminOnly, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: update event
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: delete event (and its registrations)
router.delete("/:id", adminOnly, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  await Registration.deleteMany({ event: req.params.id });
  res.json({ message: "Event deleted" });
});

module.exports = router;
