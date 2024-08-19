import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

const theme = createTheme({
  typography: {
    fontSize: 14,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.1rem",
          padding: "12px 24px",
          width: "auto",
        },
      },
    },
  },
});

export default function Postjob() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobStatus, setJobStatus] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [description, setDescription] = useState("");

  const handleStatusChange = (event) => {
    setJobStatus(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperienceRequired(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    if (value.length <= 2500) {
      setDescription(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const data = new FormData(event.currentTarget);
    const title = data.get("title");

    const requestBody = {
      title,
      description,
      postedAt: new Date().toISOString(),
      status: jobStatus,
      experienceYears: experienceRequired,
    };

    try {
      const token = Cookies.get("company");

      const response = await fetch(
        "http://localhost:4000/api/company/post/job",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Job posted successfully!");
        console.log("Job posted:", result);
      } else {
        throw new Error(result.message || "Failed to post job");
      }
    } catch (error) {
      setErrorMessage(`Posting failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          backgroundColor: "#f9f9f9",
          border: "none",
          boxShadow: "none",
          pt: 0,
          mt: 8,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            p: 3,
            backgroundColor: "#fff",
            borderRadius: 0,
            boxShadow: "none",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            Post a New Job Opportunity
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Fill out the form below to create a new job posting. Ensure all
            fields are completed to attract the right candidates.
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Job Title"
                  name="title"
                  autoComplete="title"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Job Description"
                  name="description"
                  autoComplete="description"
                  multiline
                  rows={4}
                  variant="outlined"
                  inputProps={{ maxLength: 2500 }}
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="status-label">Job Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={jobStatus}
                    onChange={handleStatusChange}
                    label="Job Status"
                  >
                    <MenuItem value="Onsite">Onsite</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="experience-label">
                    Experience Required
                  </InputLabel>
                  <Select
                    labelId="experience-label"
                    id="experienceRequired"
                    value={experienceRequired}
                    onChange={handleExperienceChange}
                    label="Experience Required"
                  >
                    <MenuItem value="0-1 years">0-1 years</MenuItem>
                    <MenuItem value="1-2 years">1-2 years</MenuItem>
                    <MenuItem value="3-5 years">3-5 years</MenuItem>
                    <MenuItem value="5-10 years">5-10 years</MenuItem>
                    <MenuItem value="10+ years">10+ years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ maxWidth: "300px", width: "100%", height: "48px" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Post Job"}
              </Button>
            </Box>
          </Box>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              {successMessage}
            </Alert>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
