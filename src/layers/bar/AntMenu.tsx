import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FC, useCallback, useEffect, useState } from 'react';

import { Ant, hasKnowledge, hasTree } from '../../ants';

import { LayerControl } from './LayerControl';
import { useAppDispatch, useAppSelector } from '../../store';
import { LayersKind, setLayerForAnt } from '../../store/layers.slice';

// Types
export interface AntMenuProps {
  ant: Ant;
  isBarOpen: boolean;
}

// Component
export const AntMenu: FC<AntMenuProps> = ({ ant, isBarOpen }) => {
  // Global state
  const { [ant.id]: layers } = useAppSelector((state) => state.layers);
  const dispatch = useAppDispatch();

  // State
  const [open, setOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (!isBarOpen) setOpen(false);
  }, [isBarOpen]);

  // Callbacks
  const handleToggle = useCallback((kind: LayersKind, value: boolean) => {
    dispatch(setLayerForAnt({ ant: ant.id, kind, value }));
  }, [dispatch, ant]);

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
              state={layers?.fog ?? false}
              onToggle={(value) => handleToggle('fog', value)}
            />
          ) }
          { hasTree(ant) && (
            <LayerControl
              layer="tree"
              state={layers?.tree ?? false}
              onToggle={(value) => handleToggle('tree', value)}
            />
          ) }
          <LayerControl
            layer="history"
            state={layers?.history ?? false}
            onToggle={(value) => handleToggle('history', value)}
          />
        </List>
      </Collapse>
    </>
  );
};
