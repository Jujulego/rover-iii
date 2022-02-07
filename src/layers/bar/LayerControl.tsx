import { ListItem, ListItemIcon, ListItemText, Switch } from '@mui/material';
import { ChangeEvent, memo } from 'react';

import { LAYERS_METADATA } from '../../commons/layers';

// Types
export interface LayerControlProps {
  layer: keyof typeof LAYERS_METADATA;
  state: boolean;
  onToggle: (value: boolean) => void;
}

// Component
export const LayerControl = memo<LayerControlProps>(function LayerControl({ layer, state, onToggle }) {
  // Render
  const { label, icon: Icon } = LAYERS_METADATA[layer];

  return (
    <ListItem sx={{ pl: 4 }}>
      <ListItemIcon>
        <Icon/>
      </ListItemIcon>
      <ListItemText primary={label} />
      <Switch
        edge="end"
        checked={state}
        onChange={(evt: ChangeEvent<HTMLInputElement>) => onToggle(evt.target.checked)}
      />
    </ListItem>
  );
});
