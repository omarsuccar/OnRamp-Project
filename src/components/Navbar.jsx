import React, { useState } from 'react'
import {AppBar, styled, Toolbar, Typography, InputBase, Box, Menu, MenuItem} from '@mui/material'
import { Person } from '@mui/icons-material'

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent:"space-between",
});

const Search = styled("div")(({theme})=>({
    backgroundColor: "white",
    padding:"0 10px",
    borderRadius: theme.shape.borderRadius,
    width:"40%",
}));

const Icons = styled(Box)(({theme})=>({
}));

const UserBox = styled(Box)(({theme})=>({
    display: "flex",
    alignItems:"center",
    gap:"10px",
}));

const Navbar = () => {
  const [open, setOpen] = useState(false)
  return (
    <AppBar position="sticky"> 
        <StyledToolbar>
            <Typography variant="h6"> CareerLink </Typography>
            <Search> <InputBase placeholder="Search"/></Search>
            <UserBox>
                <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}> Welcome! </Typography>
                <Icons><Person onClick={e=>setOpen(true)}></Person></Icons>
            </UserBox>
        </StyledToolbar>
        <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            open={open}
            onClose={(e)=>setOpen(false)}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <MenuItem>My profile</MenuItem>
            <MenuItem>Logout</MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Navbar