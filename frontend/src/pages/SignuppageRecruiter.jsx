import '../App.css';
import {Box, Grid} from "@mui/material";
import SignUp2 from '../components/SignupformRecruiter';

function Signuppagerecruiter() {
  return (
    <Box sx={{ height: '100vh' }}>
      <Grid container spacing={2}>
        <SignUp2/>
      </Grid>
    </Box>
  );
}

export default Signuppagerecruiter;

