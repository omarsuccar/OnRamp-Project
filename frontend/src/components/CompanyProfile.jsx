import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Typography, Grid, Avatar, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
  lineHeight: 1.6,
}));

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
}));

const useFetchCompanyData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("company");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:4000/api/company/info", {
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

const CompanyProfile = () => {
  const { data, loading, error } = useFetchCompanyData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [foundedAt, setFoundedAt] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeNum, setEmployeeNum] = useState(0);

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setFoundedAt(
        data.foundedAt ? new Date(data.foundedAt).toLocaleDateString() : ""
      );
      setIndustry(data.industry || "");
      setEmployeeNum(data.employeeNum || 0);
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
    <Box sx={{ flexGrow: 1, p: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <SectionBox>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 140,
                  height: 140,
                  mr: 3,
                  border: "4px solid #ddd",
                }}
                alt={name}
              />
              <Box>
                <CustomTypography variant="h4">{name}</CustomTypography>
                <CustomTypography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  Email: {email}
                </CustomTypography>
                <CustomTypography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  Founded: {foundedAt}
                </CustomTypography>
                <CustomTypography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  Industry: {industry}
                </CustomTypography>
                <CustomTypography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem" }}
                >
                  Employees: {employeeNum}
                </CustomTypography>
              </Box>
            </Box>
          </SectionBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyProfile;
