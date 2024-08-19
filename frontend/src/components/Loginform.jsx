import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import people from "../images/people.jpg";
import {
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
  FormControlLabel,
} from "@mui/material";
import Cookies from "js-cookie"; // Import js-cookie

const defaultTheme = createTheme();

export default function Login() {
  const [value, setValue] = React.useState("recruiter"); // Default state value
  const [error, setError] = React.useState(""); // Error state
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    // Determine the API endpoint based on the selected user type
    const apiEndpoint =
      value === "recruiter"
        ? "http://localhost:4000/api/company/login"
        : "http://localhost:4000/api/user/login";

    try {
      const response = await fetch(apiEndpoint, {
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

      if (result.token) {
        // Save the token
        Cookies.set(value === "recruiter" ? "company" : "user", result.token, {
          expires: 1, // Set cookie expiration to 1 day
        });

        // Navigate to menu
        navigate("/menu");
      } else {
        setError("Invalid login credentials");
      }
    } catch (error) {
      setError("There was a problem with the login operation.");
      console.error("Error during login:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${people})`,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LinkIcon />
            </Avatar>
            <Typography component="h1" variant="h5" align="center">
              Welcome to CareerLink! <br />
              Sign In
            </Typography>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {/* Radio Buttons Row */}
              <FormControl sx={{ mb: 2 }}>
                <FormLabel id="user-type-radio-group">Sign in as</FormLabel>
                <RadioGroup
                  aria-labelledby="user-type-radio-group"
                  name="userType"
                  value={value}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="recruiter"
                    control={<Radio />}
                    label="Recruiter"
                  />
                  <FormControlLabel
                    value="applicant"
                    control={<Radio />}
                    label="Job applicant"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 1 }}
                  onClick={() =>
                    navigate(
                      `/${
                        value === "recruiter" ? "company" : "applicant"
                      }/signup`
                    )
                  }
                >
                  Sign Up as {value === "recruiter" ? "Recruiter" : "Applicant"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
