import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FC, useContext, useEffect, useState } from 'react';

import { Ant, hasKnowledge, hasTree } from '../../ants';

import { useAntLayers } from '../AntLayersCtx';
import { LayerControl } from './LayerControl';

// Types
export interface AntMenuProps {
  ant: Ant;
  isBarOpen: boolean;
}

// Component
export const AntMenu: FC<AntMenuProps> = ({ ant, isBarOpen }) => {
  // Context
  const [layers, setLayer] = useAntLayers(ant);

  // State
  const [open, setOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (!isBarOpen) setOpen(false);
  }, [isBarOpen]);

  // Render
  return (
    <>
      <ListItem button onClick={() => setOpen((old) => !old)}>
        <ListItemIcon>
          <Box component="img" height={24} width={24} src={ant.image.toString()} />
        </ListItemIcon>
        <ListItemText primary={ant.name} />
        <ExpandLessIcon
          sx={({ transitions }) => ({
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: transitions.create('transform', {
              duration: transitions.duration.short
            })
          })}
        />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          disablePadding
          subheader={<ListSubheader sx={{ pl: 4, bgcolor: 'unset' }}>Layers</ListSubheader>}
        >
          { hasKnowledge(ant) && (
            <LayerControl
              layer="fog"
              state={layers.fog}
              onToggle={(val) => setLayer('fog', val)}
            />
          ) }
          { hasTree(ant) && (
            <LayerControl
              layer="tree"
              state={layers.tree}
              onToggle={(val) => setLayer('tree', val)}
            />
          ) }
          <LayerControl
            layer="history"
            state={layers.history}
            onToggle={(val) => setLayer('history', val)}
          />
        </List>
      </Collapse>
    </>
  );
};
