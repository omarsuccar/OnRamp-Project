const Company = require("../models/CompanyModel");

// jwt package
const jwt = require("jsonwebtoken");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET2, {
    expiresIn: "1d",
  });
};

//login company
const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.login(email, password);
    //create token
    const token = createToken(company._id);
    const { _id, employeeIds, ...companyData } = company;
    res.status(200).json({ data: companyData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupCompany = async (req, res) => {
  const { name, email, password, foundedAt, industry, description } = req.body;
  try {
    const company = await Company.signup(
      name,
      email,
      password,
      foundedAt,
      industry,
      description
    );
    //create token
    const token = createToken(company._id);
    const { _id, employeeIds, ...companyData } = company;
    res.status(200).json({ data: companyData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCompany = async (req, res) => {
  const companyId = req.companyId;
  try {
    const user = await Company.findById({ _id: companyId });

    const { _id, password, employeeIds, ...companyData } = user.toObject();
    res.status(200).json({ data: companyData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Post a Job
const postJob = async (req, res) => {
  let { title, description, postedAt, status, experienceYears } = req.body;
  const companyId = req.companyId;

  try {
    // Convert postedAt to a Date object and validate it
    postedAt = new Date(postedAt);
    if (isNaN(postedAt.getTime())) {
      return res.status(400).json({ error: "Invalid postedAt date" });
    }

    // Define valid experienceYears options
    const options = [
      "0-1 years",
      "1-2 years",
      "3-5 years",
      "5-10 years",
      "10+ years",
    ];

    // Validate request data
    if (
      !title ||
      typeof title !== "string" ||
      !description ||
      typeof description !== "string" ||
      !status ||
      typeof status !== "string" ||
      !["Onsite", "Remote", "Hybrid"].includes(status) ||
      !experienceYears ||
      typeof experienceYears !== "string" ||
      !options.includes(experienceYears)
    ) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Create a new job
    const job = await Job.create({
      title,
      description,
      postedAt,
      status,
      experienceYears,
      companyId,
      companyName: company.name,
    });

    if (!job) {
      throw new Error("Failed to add a job.");
    }

    // Update the company's jobsPosted
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        $push: {
          jobsPosted: job._id,
        },
      },
      { new: true }
    );

    if (!updatedCompany) {
      throw new Error("Failed to update the company with the new job.");
    }

    // Exclude companyId and applicantIds from the job response
    const { companyId: _, applicantIds, ...jobData } = job.toObject();
    res.status(201).json({ data: jobData });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
};

// View posted jobs
const getPostedJobs = async (req, res) => {
  const companyId = req.companyId;

  try {
    // Fetch company data
    const companyData = await Company.findById(companyId);
    if (!companyData) {
      return res.status(400).json({ error: "Failed to fetch jobs" });
    }

    // Extract the posted job IDs
    const postedJobIds = companyData.jobsPosted;

    // Fetch each job and filter out the companyId field
    const postedJobs = await Promise.all(
      postedJobIds.map(async (jobId) => {
        const jobData = await Job.findById(jobId);
        if (!jobData) {
          return null; // Handle cases where the job might not be found
        }

        // Convert job data to an object and filter out the companyId
        const {
          companyId: _,
          applicantIds,
          ...filteredJobData
        } = jobData.toObject();
        return filteredJobData;
      })
    );

    // Filter out any null results in case a job was not found
    const filteredPostedJobs = postedJobs.filter((job) => job !== null);

    // Return the filtered job data
    return res.status(200).json({ data: filteredPostedJobs });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a Job
const deleteJob = async (req, res) => {
  const jobId = req.params.jobId;
  const companyId = req.companyId;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }
    if (!(job.companyId === companyId)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const deletedJob = await Job.findByIdAndDelete({ _id: jobId });
    if (!deletedJob) {
      return res.status(400).json({ error: "Failed to delete job" });
    }
    return res.status(201).json({ job });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getJob = async (req, res) => {
  const { jobId } = req.params;
  const { companyId } = req;

  try {
    // Fetch the job by its ID
    const job = await Job.findById(jobId);

    // If job not found, return a 404 error
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Ensure that the job belongs to the requesting company
    if (!job.companyId.equals(companyId)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Retrieve the applicant data while excluding sensitive information
    const applicants = await Promise.all(
      job.applicantIds.map(async (applicantId) => {
        const userData = await User.findById(applicantId);
        if (!userData) {
          return null; // null if not found
        }

        const { password, applicationIds, _id, ...userFilteredData } =
          userData.toObject();
        return userFilteredData;
      })
    );

    // Filter out any null results (in case a user wasn't found)
    const filteredApplicants = applicants.filter(
      (applicant) => applicant !== null
    );

    // Destructure the job object to exclude certain fields
    const {
      companyId: _,
      applicantIds: __,
      ...filteredJobData
    } = job.toObject();

    // Combine the job data with the filtered applicants' data
    return res.status(200).json({
      data: {
        ...filteredJobData,
        applicants: filteredApplicants,
      },
    });
  } catch (error) {
    // Catch and return any errors
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginCompany,
  signupCompany,
  postJob,
  deleteJob,
  getCompany,
  getPostedJobs,
  getJob,
};
