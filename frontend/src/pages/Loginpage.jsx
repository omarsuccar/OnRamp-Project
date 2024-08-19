import '../App.css';
import {Box} from "@mui/material";
import Login from '../components/Loginform';

function Loginpage() {
  return (
    <Box sx={{ height: '100vh' }}>
      <Login/>
    </Box>
  );
}

export default Loginpage;