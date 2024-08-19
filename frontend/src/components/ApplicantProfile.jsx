import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Grid,
  Avatar,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
}));

const SectionBox = ({ title, children }) => (
  <Box
    sx={{
      p: 3,
      border: "2px solid #ccc",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      mb: 3,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const useFetchUserData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("user");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:4000/api/user/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

const ApplicantProfile = () => {
  const { data, loading, error } = useFetchUserData();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [experience, setExperience] = useState(0);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setUniversity(data.university || "");
      setMajor(data.major || "");
      setExperience(data.experience || 0);
      setSkills(data.skills || []);
    }
  }, [data]);

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
      <Typography color="error">
        Error fetching data: {error.message}
      </Typography>
    );
  if (!data) return <Typography>No data available</Typography>;

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SectionBox title="Profile">
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mr: 2,
                  border: "4px solid #ddd",
                }}
                alt={`${firstName} ${lastName}`}
              />
              <Box>
                <CustomTypography variant="h5">
                  {firstName} {lastName}
                </CustomTypography>
                <CustomTypography variant="body1" color="text.secondary">
                  Email: {email}
                </CustomTypography>
                <CustomTypography variant="body1" color="text.secondary">
                  Experience: {experience} years
                </CustomTypography>
              </Box>
            </Box>
          </SectionBox>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SectionBox title="Education">
                <CustomTypography variant="h6">Major: {major}</CustomTypography>
                <CustomTypography variant="h6">
                  University: {university}
                </CustomTypography>
              </SectionBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionBox title="Skills">
                {skills.length > 0 ? (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {skills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    ))}
                  </Stack>
                ) : (
                  <CustomTypography variant="body1" color="text.secondary">
                    No skills listed
                  </CustomTypography>
                )}
              </SectionBox>
            </Grid>

            <Grid item xs={12}>
              <SectionBox title="Experience">
                <CustomTypography variant="h6">
                  {experience} years of experience
                </CustomTypography>
              </SectionBox>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicantProfile;
