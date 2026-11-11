const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: { type: String, required: true },
  attended: { type: Boolean, default: false },
});

module.exports = mongoose.model("Registration", registrationSchema);
