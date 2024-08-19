//validation package
const validator = require("validator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  university: {
    type: String,
    default: "",
  },
  major: {
    type: String,
    default: "",
  },
  skills: { type: [String], default: [] },
  experience: { type: "String", default: "0-1 years" },
  applicationIds: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

//static signup method
userSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password,
  university,
  major,
  skills,
  experience
) {
  const options = [
    "0-1 years",
    "1-2 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !university ||
    !major ||
    !Array.isArray(skills) ||
    skills.length === 0 ||
    !experience ||
    typeof experience !== "string" ||
    !options.includes(experience)
  ) {
    throw Error("Invalid data");
  }

  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid Email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password should at least be 8 characters with a number, a special character, an uppercase and a lowercase character"
    );
  } else {
    const exists = await this.findOne({ email });

    if (exists) {
      throw Error("Email already in use.");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hash,
      university,
      major,
      experience,
      skills,
    });

    if (!user) {
      throw Error("Registration failed.");
    }
    const { password: removePass, ...userData } = user.toObject();
    return userData;
  }
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  const { password: removePass, ...userData } = user.toObject();
  return userData;
};

module.exports = mongoose.model("User", userSchema);
