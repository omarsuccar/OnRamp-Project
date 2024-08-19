import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { AccountBox, Work, NoteAdd, Assignment } from "@mui/icons-material";

const Sidebar = ({ setSelectedComponent, userType }) => {
  // Define the items based on the userType
  const items =
    userType === "company"
      ? [
          {
            text: "Profile",
            icon: <AccountBox fontSize="large" />,
            value: "profile",
          },
          {
            text: "Add a New Job",
            icon: <NoteAdd fontSize="large" />,
            value: "postJob",
          },
          {
            text: "Jobs Posted",
            icon: <Work fontSize="large" />,
            value: "jobsPosted",
          },
        ]
      : [
          {
            text: "Profile",
            icon: <AccountBox fontSize="large" />,
            value: "profile",
          },
          {
            text: "Explore Job Posts",
            icon: <Work fontSize="large" />,
            value: "availableJobs",
          },
          {
            text: "View Applications",
            icon: <Assignment fontSize="large" />, // Updated icon
            value: "appliedJobs",
          },
        ];

  return (
    <Box
      sx={{
        width: 300,
        bgcolor: "background.paper",
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <List>
        {items.map(({ text, icon, value }) => (
          <ListItem key={value} disablePadding>
            <ListItemButton
              onClick={() => {
                console.log("Selected Component:", value); // Debug log
                setSelectedComponent(value);
              }}
              sx={{
                py: 1.5,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                  transition: "background-color 0.3s ease",
                },
                display: "flex",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 50,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  variant: "body1",
                  sx: {
                    fontWeight: "medium",
                    fontFamily: "Roboto, Arial, sans-serif",
                    lineHeight: 1.5,
                  },
                }}
                sx={{ flex: 1 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
