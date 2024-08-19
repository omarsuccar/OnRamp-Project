const express = require("express");
const {
  signupUser,
  loginUser,
  applyForJob,
  searchJobs,
  getUser,
  getApplications,
  getFeed,
  getJob,
} = require("../controllers/userController");

const router = express.Router();
const userAuth = require("../middleware/userAuth");

//open routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

//Auth Middleware
router.use("/info", userAuth);
router.use("/jobs/feed", userAuth);
router.use("/jobs/search/:keywords", userAuth);
router.use("/jobs/:jobId/apply", userAuth);
router.use("/jobs", userAuth);
router.use("/job/:jobId", userAuth);

router.get("/info", getUser);
router.get("/jobs/feed", getFeed);
router.get("/jobs/search/:keywords", searchJobs);
router.post("/jobs/:jobId/apply", applyForJob);
router.get("/jobs", getApplications);
router.get("/job/:jobId", getJob);

module.exports = router;
