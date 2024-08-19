const express = require("express");
const {
  loginCompany,
  signupCompany,
  getCompany,
  postJob,
  getPostedJobs,
  getJob,
} = require("../controllers/companyController");

const companyAuth = require("../middleware/companyAuth");
const router = express.Router();

router.post("/login", loginCompany);
router.post("/signup", signupCompany);

//Auth Middleware
router.use("/info", companyAuth);
router.use("/post/job", companyAuth);
router.use("/jobs", companyAuth);
router.use("/job/:jobId", companyAuth);

//defining routes
router.get("/info", getCompany);
router.post("/post/job", postJob);
router.get("/jobs", getPostedJobs);
router.get("/job/:jobId", getJob);

module.exports = router;
