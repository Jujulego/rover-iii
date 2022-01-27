 import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FC, useEffect, useState } from 'react';

import { Ant, hasKnowledge, hasTree } from '../../ants';

// Types
export interface AntMenuProps {
  ant: Ant;
  isBarOpen: boolean;
}

// Component
export const AntMenu: FC<AntMenuProps> = ({ ant, isBarOpen }) => {
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
          <Box component="img" height={24} width={24} src={ant.image.toString()}/>
        </ListItemIcon>
        <ListItemText primary={ant.name}/>
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
        <List disablePadding>
          { hasKnowledge(ant) && (
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Fog" />
            </ListItem>
          ) }
          { hasTree(ant) && (
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Tree" />
            </ListItem>
          ) }
          <ListItem button sx={{ pl: 4 }}>
            <ListItemText primary="History" />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
