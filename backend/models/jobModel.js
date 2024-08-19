const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  companyName: { type: String, required: true },
  postedAt: { type: Date },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Onsite", "Remote", "Hybrid"],
    default: "Onsite",
  },
  experienceYears: { type: "String", default: "0-1 years" },
  applicantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Job", jobSchema);
