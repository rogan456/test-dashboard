import * as React from 'react';
import Switch from '@mui/material/Switch';

interface BasicSwitchesProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function BasicSwitches({ checked, onChange }: BasicSwitchesProps) {
  return (
    <div>
      <Switch
        {...label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}
