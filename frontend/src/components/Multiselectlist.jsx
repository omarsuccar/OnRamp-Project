import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import FormHelperText from '@mui/material/FormHelperText';

const options = [
  'Frontend Development',
  'Backend Development',
  'Game Development',
  'Full Stack Development',
  'Machine Learning',
  'Data Science',
  'Business Analysis',
];

export default function MultiSelect({ value, onChange, name, error, helperText }) {
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth variant="outlined" error={error}>
        <InputLabel id="multiple-select-label" sx={{ background: 'white', paddingX: 1 }}>
          Skills (Choose all that apply)
        </InputLabel>
        <Select
          labelId="multiple-select-label"
          id="multiple-select"
          multiple
          value={value}
          onChange={(event) => onChange(event.target.value)}
          renderValue={(selected) => selected.join(', ')}
          label="Skills (Choose all that apply)"
          name={name}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={value.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
}
