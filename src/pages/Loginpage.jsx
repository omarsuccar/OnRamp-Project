import './App.css';
import {Box} from "@mui/material";
import SignInSide from '../components/Loginform';

function Loginpage() {
  return (
    <Box sx={{ height: '100vh' }}>
      <SignInSide/>
    </Box>
  );
}

export default Loginpage;