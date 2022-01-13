import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CSSObject, Theme } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';
import { FC, useState } from 'react';

// Style mixins
const openMixin = ({ transitions }: Theme): CSSObject => ({
  width: 300,

  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: transitions.duration.enteringScreen
  })
});

const closedMixin = ({ spacing, transitions }: Theme): CSSObject => ({
  overflowX: 'hidden',
  width: `calc(${spacing(7)} + 1px)`,

  transition: transitions.create('width', {
    easing: transitions.easing.sharp,
    duration: transitions.duration.leavingScreen
  })
});

// Component
export const LayerBar: FC = () => {
  // State
  const [open, setOpen] = useState(false);

  // Render
  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{ elevation: 3 }}
      sx={(theme) => ({
        flexShrink: 0,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',

        ...(open ? openMixin(theme) : closedMixin(theme)),
        '& .MuiDrawer-paper': open ? openMixin(theme) : closedMixin(theme),
      })}
    >
      <List onClick={() => setOpen(true)}>
        <ListItem button>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Toto" />
        </ListItem>
      </List>
    </Drawer>
  );
};
