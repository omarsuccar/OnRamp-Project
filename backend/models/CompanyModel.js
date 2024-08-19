const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  foundedAt: { type: Date },
  industry: {
    type: String,
    default: "",
  },
  employeeIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  employeeNum: { type: Number, default: 0 },
  jobsPosted: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

//static signup method
companySchema.statics.signup = async function (
  name,
  email,
  password,
  foundedAt,
  industry,
  description
) {
  if (foundedAt) {
    foundedAt = new Date(foundedAt);
  }
  if (
    !email ||
    !password ||
    !name ||
    !foundedAt ||
    !industry ||
    !description ||
    !(foundedAt instanceof Date)
  ) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password should at least be 8 characters with a number, a special character, an uppercase and a lowercase character"
    );
  } else {
    const emailExists = await this.findOne({ email });

    if (emailExists) {
      throw Error("Email already in use.");
    }
    const nameExists = await this.findOne({ name });
    if (nameExists) {
      throw Error("Name already in use.");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    description = description.slice(0, 500); // limit of 500 words
    const company = await this.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      foundedAt,
      description,
      industry,
    });

    if (!company) {
      throw Error("Registration failed.");
    }
    const { password: removePass, ...companyData } = company.toObject();
    return companyData;
  }
};

companySchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const company = await this.findOne({ email: email.toLowerCase() });
  if (!company) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, company.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  const { password: removePass, ...companyData } = company.toObject();
  return companyData;
};

module.exports = mongoose.model("Company", companySchema);
