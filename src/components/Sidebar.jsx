import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AccountBox, Work, NoteAdd } from '@mui/icons-material';

const Sidebar = () => {
  return (
    
      <Box flex={1} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#profile">
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#PostJob">
            <ListItemIcon>
              <NoteAdd />
            </ListItemIcon>
            <ListItemText primary="Post New Job" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#ExistingPosts">
            <ListItemIcon>
              <Work />
            </ListItemIcon>
            <ListItemText primary="See Existing Posts" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
