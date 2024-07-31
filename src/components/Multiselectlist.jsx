import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

const options = [
  'Fronted Development',
  'Backend Development',
  'Game Development',
  'Full Stack Development',
  'Machine Learning',
  'Data Science',
  'Business Analysis',
];

export default function MultiSelect() {
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id="multiple-select-label">Skills (Choose all applies)</InputLabel>
        <Select
          labelId="multiple-select-label"
          id="multiple-select"
          multiple
          value={selectedOptions}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selectedOptions.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
