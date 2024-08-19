import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import MultiSelect from "./Multiselectlist"; // Ensure the import path is correct
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const theme = createTheme();

export default function SignUp() {
  const [skills, setSkills] = React.useState([]);
  const [experience, setExperience] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false); // State to handle loading
  const navigate = useNavigate(); // For navigation after sign-up

  const validateForm = () => {
    const newErrors = {};
    const formElements = [
      "firstName",
      "lastName",
      "email",
      "password",
      "university",
      "major",
    ];

    formElements.forEach((element) => {
      const value = document.getElementById(element)?.value;
      if (!value) newErrors[element] = "This field is required";
    });

    if (skills.length === 0)
      newErrors.skills = "At least one skill must be selected";
    if (!experience) newErrors.experience = "Experience is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Set loading state to true

    const formData = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      password: event.target.password.value,
      university: event.target.university.value,
      major: event.target.major.value,
      skills: skills,
      experience: experience,
    };

    try {
      const response = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      // Save the token to cookies
      Cookies.set("user", result.token, { expires: 1 });

      // Navigate to the desired page after successful sign-up
      navigate("/menu");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="university"
                  label="University"
                  name="university"
                  autoComplete="university"
                  error={!!errors.university}
                  helperText={errors.university}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="major"
                  label="Major"
                  name="major"
                  autoComplete="major"
                  error={!!errors.major}
                  helperText={errors.major}
                />
              </Grid>
              <Grid item xs={12}>
                <MultiSelect
                  name="skills"
                  value={skills}
                  onChange={(selectedSkills) => setSkills(selectedSkills)}
                  error={!!errors.skills}
                  helperText={errors.skills}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="experience-label">
                    Experience Required
                  </InputLabel>
                  <Select
                    labelId="experience-label"
                    id="experience"
                    value={experience}
                    onChange={handleExperienceChange}
                    label="Experience Required"
                    error={!!errors.experience}
                  >
                    <MenuItem value="0-1 years">0-1 years</MenuItem>
                    <MenuItem value="1-2 years">1-2 years</MenuItem>
                    <MenuItem value="3-5 years">3-5 years</MenuItem>
                    <MenuItem value="5-10 years">5-10 years</MenuItem>
                    <MenuItem value="10+ years">10+ years</MenuItem>
                  </Select>
                  {errors.experience && (
                    <Typography variant="body2" color="error">
                      {errors.experience}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Button
                      component={Link}
                      to="/login"
                      variant="text"
                      color="primary"
                      sx={{ textTransform: "none" }}
                    >
                      Login
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
