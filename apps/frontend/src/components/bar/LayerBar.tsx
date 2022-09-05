import { CSSObject, Theme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import LastPageIcon from '@mui/icons-material/LastPage';
import { FC, useState } from 'react';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

import { AntMenu } from './AntMenu';
import { useAnts } from '../MapLayers';
import { CreateAntDialog } from './CreateAntDialog';

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
  const [ants,] = useAnts();

  // State
  const [open, setOpen] = useState(false);
  const [creatingAnt, setCreatingAnt] = useState(false);

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
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          zIndex: theme.zIndex.appBar - 1,

          ...(open ? openMixin(theme) : closedMixin(theme))
        },
      })}
    >
      <Toolbar />
      <List
        sx={{
          flex: 1,

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

        <ListItem button onClick={(evt) => { evt.stopPropagation(); setCreatingAnt(true); }}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New ant" />
        </ListItem>

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

      <CreateAntDialog open={creatingAnt} onClose={() => setCreatingAnt(false)} />
    </Drawer>
  );
};
