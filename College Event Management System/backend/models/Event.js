const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["Technical", "Cultural", "Workshop", "Seminar", "Sports"],
    default: "Technical",
  },
  description: String,
  date: { type: Date, required: true },
  venue: { type: String, required: true },
});

module.exports = mongoose.model("Event", eventSchema);
