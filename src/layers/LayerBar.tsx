import { Box, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CSSObject, Theme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import { FC, useState } from 'react';

import { Ant } from '../ants';

// Types
export interface LayerBarProps {
  ants: Ant[];
}

// Style mixins
const openMixin = ({ transitions }: Theme): CSSObject => ({
  width: 300,

  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: transitions.duration.enteringScreen
  })
});

const closedMixin = ({ spacing, transitions }: Theme): CSSObject => ({
  width: `calc(${spacing(7)} + 1px)`,

  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: transitions.duration.leavingScreen
  })
});

// Component
export const LayerBar: FC<LayerBarProps> = ({ ants }) => {
  // State
  const [open, setOpen] = useState(false);

  // Render
  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{ elevation: 3 }}
      sx={(theme) => ({
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflowX: 'hidden',

        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',

        ...(open ? openMixin(theme) : closedMixin(theme)),
        '& .MuiDrawer-paper': {
          overflowX: 'hidden',
          ...(open ? openMixin(theme) : closedMixin(theme))
        },
      })}
    >
      <List sx={{ flexGrow: 1 }}>
        { ants.map((ant) => (
          <ListItem button key={ant.name}>
            <ListItemIcon>
              <Box component="img" height={24} width={24} src={ant.image.toString()} />
            </ListItemIcon>
            <ListItemText primary={ant.name} />
          </ListItem>
        )) }
      </List>
      <Box display="flex" justifyContent="center" width="100%">
        <IconButton onClick={() => setOpen((old) => !old)}>
          <LastPageIcon
            sx={({ transitions }) => ({
              transform: open ? 'rotate(180deg)' : 'rotate(0)',

              transition: transitions.create('transform', {
                easing: transitions.easing.sharp,
                duration: open ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
              }),
            })}
          />
        </IconButton>
      </Box>
    </Drawer>
  );
};
