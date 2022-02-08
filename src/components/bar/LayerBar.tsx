import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CSSObject, Theme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage';
import { FC, useState } from 'react';

import { AntMenu } from './AntMenu';
import { useAnts } from '../MapLayers';

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
export const LayerBar: FC = () => {
  // Context
  const ants = useAnts();

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

        ...(open ? openMixin(theme) : closedMixin(theme)),
        '& .MuiDrawer-paper': {
          overflowX: 'hidden',
          ...(open ? openMixin(theme) : closedMixin(theme))
        },
      })}
    >
      <List
        sx={{
          minHeight: '100%',

          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => setOpen(true)}
      >
        { ants.map((ant) => (
          <AntMenu
            key={ant.id}
            ant={ant}
            isBarOpen={open}
          />
        )) }

        <Divider sx={{ mt: 'auto' }} />
        <ListItem button onClick={(evt) => { evt.stopPropagation(); setOpen((old) => !old); }}>
          <ListItemIcon>
            <LastPageIcon
              sx={({ transitions }) => ({
                transform: open ? 'rotate(180deg)' : 'rotate(0)',

                transition: transitions.create('transform', {
                  easing: transitions.easing.sharp,
                  duration: open ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
                }),
              })}
            />
          </ListItemIcon>
          <ListItemText primary="Close" />
        </ListItem>
      </List>
    </Drawer>
  );
};
