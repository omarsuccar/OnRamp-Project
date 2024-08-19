const Job = require("../models/jobModel");
const User = require("../models/userModel");

// jwt package
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    //create token
    const token = createToken(user._id);
    const { _id, applicationIds, ...userData } = user;
    res.status(200).json({ data: userData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    university,
    major,
    skills,
    experience,
  } = req.body;
  try {
    const user = await User.signup(
      firstName,
      lastName,
      email,
      password,
      university,
      major,
      skills,
      experience
    );
    //create token
    const token = createToken(user._id);
    const { _id, applicationIds, ...userData } = user;
    res.status(200).json({ data: userData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//Get user data
const getUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById({ _id: userId });

    const { _id, password, applicationIds, ...userData } = user.toObject();
    res.status(200).json({ data: userData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Apply for a job
const applyForJob = async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.userId;
  try {
    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ error: "Job not found" });
    }
    //Check if the user has applied before
    const hasApllied = jobData.applicantIds.includes(userId);
    if (hasApllied) {
      return res.status(400).json({ error: "Already applied" });
    }
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $push: { applicantIds: userId } },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(400).json({ error: "Application failed" });
    }
    const updatedUserData = await User.findByIdAndUpdate(
      userId,
      { $push: { applicationIds: jobId } },
      { new: true }
    );
    if (!updatedUserData) {
      return res.status(400).json({ error: "Application failed" });
    }

    const { companyId, applicantIds, ...filteredJobData } =
      updatedJob.toObject();

    res.status(200).json({ data: filteredJobData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// view applications
const getApplications = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { applicationIds } = user;

    // Use Promise.all to handle multiple asynchronous operations
    const applications = await Promise.all(
      applicationIds.map(async (applicationId) => {
        const applicationData = await Job.findById(applicationId);
        if (!applicationData) {
          return null; // Handle cases where the job might not be found
        }

        const { companyId, applicantIds, ...applicantFilteredData } =
          applicationData.toObject();
        return applicantFilteredData;
      })
    );

    // Filter out any null results in case a job was not found
    const filteredApplications = applications.filter(
      (application) => application !== null
    );

    res.status(200).json({ data: filteredApplications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//search Jobs
const searchJobs = async (req, res) => {
  try {
    const keywords = req.params.keywords;
    const keywordArray = keywords.split("&").map((keyword) => keyword.trim());

    const queryArray = keywordArray.map((keyword) => ({
      title: { $regex: keyword, $options: "i" },
    }));

    const jobsData = await Job.find(
      { $or: queryArray },
      { companyId: 0, applicantIds: 0 }
    );

    // If jobData is empty
    if (jobsData.length === 0) {
      return res
        .status(404)
        .json({ data: "No jobs found matching the keywords." });
    }
    res.status(200).json({ data: jobsData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFeed = async (req, res) => {
  const userId = req.userId.toString();
  try {
    // Fetch user data to get experience
    const userData = await User.findById(userId);
    const { experience } = userData;

    // Fetch available jobs based on the user's experience, including applicantIds
    const availableJobs = await Job.find({
      experienceYears: experience,
    }).select("+applicantIds");

    // Map over jobs to add hasApplied attribute and remove applicantIds
    const availableJobsData = availableJobs.map((job) => {
      const jobData = job.toObject(); // Convert Mongoose document to plain object


      // Check if applicantIds exists and is an array before using includes
      const hasApplied =
        Array.isArray(jobData.applicantIds) &&
        jobData.applicantIds.some((id) => id.toString() === userId);

      

      // Return a new object excluding `applicantIds` and including `hasApplied`
      const { applicantIds, ...jobWithoutApplicantIds } = jobData;
      return { ...jobWithoutApplicantIds, hasApplied };
    });

    // Send the response with the modified job data
    res.status(200).json({ data: availableJobsData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getJob = async (req, res) => {
  const userId = req.userId;
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    const hasApplied = job.applicantIds.includes(userId);

    const { applicantIds, companyId, ...jobData } = job.toObject();
    res.status(200).json({ data: { hasApplied, ...jobData } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  searchJobs,
  applyForJob,
  getUser,
  getApplications,
  getFeed,
  getJob,
};
