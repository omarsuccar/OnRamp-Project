import React, { useState, useEffect } from "react";
import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  InputBase,
  Box,
  Menu,
  MenuItem,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTheme, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  height: "64px",
}));

const Search = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(0.5, 2),
  borderRadius: theme.shape.borderRadius * 3,
  width: "400px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
}));

const SearchIconStyled = styled(SearchIcon)(({ theme }) => ({
  fontSize: "1.5rem",
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  cursor: "pointer",
}));

const Navbar = () => {
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = Cookies.get("user");
        let link;
        let token;
        if (userToken) {
          link = "http://localhost:4000/api/user/info";
          token = userToken;
        }
        const companyToken = Cookies.get("company");
        if (companyToken) {
          link = "http://localhost:4000/api/company/info";
          token = companyToken;
        }
        const response = await fetch(link, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const { name, firstName, lastName } = data.data;
          if (!name) {
            setUserInfo(`${firstName} ${lastName}`);
          }
          if (!firstName && !lastName) {
            setUserInfo(name);
          }
        } else {
          console.error("Failed to fetch company data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePlusClick = () => {
    setPlusMenuOpen(true);
  };

  const handleProfileClick = () => {
    setProfileMenuOpen(true);
  };

  const handleClosePlusMenu = () => {
    setPlusMenuOpen(false);
  };

  const handleCloseProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    const userToken = Cookies.get("user");
    if (userToken) {
      Cookies.remove("user");
    } else {
      const companyToken = Cookies.get("company");
      if (companyToken) {
        Cookies.remove("company");
      }
    }

    // Redirect to login page
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ height: "64px" }}>
      <StyledToolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/menu"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "1.5rem",
          }}
        >
          CareerLink
        </Typography>

        <Search>
          <InputBase
            placeholder="Search"
            startAdornment={
              <InputAdornment position="start">
                <SearchIconStyled />
              </InputAdornment>
            }
            fullWidth
          />
        </Search>

        <UserBox onClick={handleProfileClick}>
          {!isSmallScreen && (
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: "medium",
              }}
            >
              {userInfo ? userInfo : "Loading..."}
            </Typography>
          )}
          <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" />
        </UserBox>
      </StyledToolbar>
      <Menu
        id="plus-menu"
        aria-labelledby="plus-menu-button"
        open={plusMenuOpen}
        onClose={handleClosePlusMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClosePlusMenu}>Profile</MenuItem>
        <MenuItem onClick={handleClosePlusMenu}>Post New Job</MenuItem>
        <MenuItem onClick={handleClosePlusMenu}>See Existing Post</MenuItem>
      </Menu>
      <Menu
        id="profile-menu"
        aria-labelledby="profile-menu-button"
        open={profileMenuOpen}
        onClose={handleCloseProfileMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCloseProfileMenu}>Profile</MenuItem>
        <MenuItem onClick={handleCloseProfileMenu}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
