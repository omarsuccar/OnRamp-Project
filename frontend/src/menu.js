import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Box, Stack } from "@mui/material";
import Postjob from "./components/Postjob";
import Feed from "./components/Feed";
import React, { useState, useEffect } from "react";
import ApplicantProfile from "./components/ApplicantProfile";
import Cookies from "js-cookie"; // Use js-cookie for cookie management
import CompanyProfile from "./components/CompanyProfile";
import CompanyFeed from "./components/CompanyFeed";
import ApplicantFeed from "./components/ApplicationFeed";

function Menu() {
  const [selectedComponent, setSelectedComponent] = useState("postJob"); // Default component
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const user = Cookies.get("user");
    const company = Cookies.get("company");

    console.log("User:", user); // Debug log
    console.log("Company:", company); // Debug log

    if (company) {
      setUserType("company");
      setSelectedComponent("jobsPosted"); // Default for company
    } else if (user) {
      setUserType("user");
      setSelectedComponent("profile"); // Default for user
    } else {
      setUserType(null);
    }
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Stack direction="row" sx={{ flex: 1 }}>
        {userType && (
          <Sidebar
            setSelectedComponent={setSelectedComponent}
            userType={userType}
          />
        )}
        <Box sx={{ flex: 1 }}>
          {userType === "company" && selectedComponent === "profile" && (
            <CompanyProfile />
          )}
          {userType === "company" && selectedComponent === "jobsPosted" && (
            <CompanyFeed />
          )}
          {userType === "company" && selectedComponent === "postJob" && (
            <Postjob />
          )}
          {userType === "user" && selectedComponent === "availableJobs" && (
            <Feed />
          )}
          {userType === "user" && selectedComponent === "appliedJobs" && (
            <ApplicantFeed />
          )}
          {userType === "user" && selectedComponent === "profile" && (
            <ApplicantProfile />
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default Menu;
