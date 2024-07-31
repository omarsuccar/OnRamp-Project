import './App.css';
import Feed from './components/Feed';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import {Box, Stack} from "@mui/material";

function App() {
  return (
    <Box>
    <Navbar/>  
    <Stack direction="row" spacing={2} justifyContent="space-between">  
      <Sidebar/>
      <Feed/>
    </Stack>  
    </Box>
  );
}

export default App;
