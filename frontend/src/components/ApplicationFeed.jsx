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
  Snackbar,
  Alert,
} from "@mui/material";
import Cookies from "js-cookie";
import OutlinedCard from "./OutlinedCard"; // Adjust import path if necessary
import CloseIcon from "@mui/icons-material/Close";

const ApplicationFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [applicationError, setApplicationError] = useState(null); // New state for application errors

  useEffect(() => {
    const fetchJobs = async () => {
      const token = Cookies.get("user");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/user/jobs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data.data);
      } catch (error) {
        setError(error.message);
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

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  const handleCloseApplicationError = () => {
    setApplicationError(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error" variant="h6">
          Error fetching jobs: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job._id}>
            <OutlinedCard
              job={job}
              hasApplied={true} // Always set to true as per your requirement
              onApply={() => console.log(`Apply to job ${job.title}`)}
              onMoreDetails={() => handleMoreDetailsClick(job)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Job Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedJob && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedJob.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {selectedJob.companyName}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedJob.description}
              </Typography>
              <Typography variant="body2">
                Experience Required: {selectedJob.experienceYears}
              </Typography>
              <Typography variant="body2">
                Status: {selectedJob.status}
              </Typography>
              <Typography variant="body2">
                Posted At: {new Date(selectedJob.postedAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for application error */}
      <Snackbar
        open={!!applicationError}
        autoHideDuration={6000}
        onClose={handleCloseApplicationError}
      >
        <Alert
          onClose={handleCloseApplicationError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {applicationError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplicationFeed;
