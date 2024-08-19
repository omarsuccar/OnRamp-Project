import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import Cookies from "js-cookie";
import CompanyOutlinedCard from "./CompanyOutlinedCard"; // Updated import
import CloseIcon from "@mui/icons-material/Close";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // Import icon for no applicants
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile icon

const CompanyFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [applicantsAnchorEl, setApplicantsAnchorEl] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = Cookies.get("company");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:4000/api/company/jobs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const result = await response.json();
        setJobs(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleMoreDetailsClick = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleApplicantsClick = async (jobId) => {
    try {
      const token = Cookies.get("company");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:4000/api/company/job/${jobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }
      const result = await response.json();
      console.log(result);
      setApplicants(result.data.applicants);
      setApplicantsAnchorEl(document.body); // Anchor to the body
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  const handleApplicantsClose = () => {
    setApplicantsAnchorEl(null);
    setApplicants([]);
  };

  if (loading)
    return (
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" variant="h6">
        Error fetching jobs: {error}
      </Typography>
    );

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={4}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <CompanyOutlinedCard
              title={job.companyName}
              subtitle={job.title}
              body={job.status}
              experience={job.experienceYears}
              buttonText="More Details"
              onAdditionalButtonClick={() => handleMoreDetailsClick(job)}
              onApplicantsButtonClick={() => handleApplicantsClick(job._id)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #ddd",
            backgroundColor: "#f0f0f0",
            px: 3,
            py: 2,
            fontSize: "1.5rem",
            fontWeight: "500",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Job Details
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ color: "#555" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 4,
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#fff",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {selectedJob && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "500" }}>
                {selectedJob.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "400" }}>
                <strong>Company:</strong> {selectedJob.companyName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "400" }}>
                <strong>Status:</strong> {selectedJob.status}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "400" }}>
                <strong>Experience Required:</strong>{" "}
                {selectedJob.experienceYears}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "400" }}>
                <strong>Description:</strong> {selectedJob.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={applicantsAnchorEl}
        open={Boolean(applicantsAnchorEl)}
        onClose={handleApplicantsClose}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "800px",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "500" }}>
          Applicants
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {applicants.length > 0 ? (
          applicants.map((applicant, index) => (
            <MenuItem
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <AccountCircleIcon
                sx={{ mr: 2, fontSize: 40, color: "#1976d2" }}
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "500" }}>
                  {applicant.firstName} {applicant.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {applicant.email}
                </Typography>
                <Typography variant="body2">
                  <strong>University:</strong> {applicant.university}
                </Typography>
                <Typography variant="body2">
                  <strong>Major:</strong> {applicant.major}
                </Typography>
                <Typography variant="body2">
                  <strong>Skills:</strong> {applicant.skills.join(", ")}
                </Typography>
                <Typography variant="body2">
                  <strong>Experience:</strong> {applicant.experience}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              textAlign: "center",
            }}
          >
            <EmojiEmotionsIcon sx={{ fontSize: 40, color: "#ffbb33", mb: 1 }} />
            <Typography>No applicants yet</Typography>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default CompanyFeed;
