import './App.css';
import {Box, Grid} from "@mui/material";
import SignUp from '../components/Signupform';

function Signuppage() {
  return (
    <Box sx={{ height: '100vh' }}>
      <Grid container spacing={2}>
        <SignUp/>
      </Grid>
    </Box>
  );
}

export default Signuppage;

