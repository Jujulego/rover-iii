import { ListItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import { FC } from 'react';

import { LAYERS_METADATA } from '../layers';

// Types
export interface LayerControlProps {
  layer: keyof typeof LAYERS_METADATA;
  state: boolean;
  onToggle: (value: boolean) => void;
}

// Component
export const LayerControl: FC<LayerControlProps> = ({ layer, state, onToggle }) => {
  // Render
  const { label, icon: Icon } = LAYERS_METADATA[layer];

  return (
    <ListItem sx={{ pl: 4 }}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
      <Switch edge="end" checked={state} onChange={(evt) => onToggle(evt.target.checked)} />
    </ListItem>
  );
};
