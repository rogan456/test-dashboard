import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 500,
    label: '500',
  },
  {
    value: 1000,
    label: '1000',
  },
  {
    value: 2500,
    label: '2500',
  },
  {
    value: 5000,
    label: '5000',
  },
  {
    value: 10000,
    label: '10,000',
  },
  {
    value: 25000,
    label: '25,000',
  },
  {
    value: 49000,
    label: '49,000',
  },
  {
    value: 100000,
    label: '50,000+',
  },
];

function valuetext(value: number) {
  return `${value}`;
}

export default function DiscreteSliderLabel() {
  return (
    <Box sx={{ width: 400 }}>
      <Slider
        aria-label="Always visible"
        defaultValue={500}
        getAriaValueText={valuetext}
        step={1000}
        marks={marks}
        valueLabelDisplay="on"
      />
    </Box>
  );
}