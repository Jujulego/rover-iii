import { FC, Fragment, useCallback, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { ITileMap, TileMap } from '../../maps/tile-map.entity';

// Types
export interface DeleteTileMapsAlertProps {
  tileMaps: ITileMap[];

  open: boolean;
  onClose: () => void;
}

// Component
export const DeleteTileMapsAlert: FC<DeleteTileMapsAlertProps> = ({ tileMaps, open, onClose }) => {
  // State
  const [deleting, setDeleting] = useState(false);

  // Callbacks
  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await Promise.all(tileMaps.map((map) => TileMap.delete({ id: map.id })));
      TileMap.$list('all').data = TileMap.$list('all').data
        .filter((map) => !tileMaps.find((del) => del.id === map.id))

      onClose();
    } finally {
      setDeleting(false);
    }
  }, [tileMaps, onClose]);

  // Render
  return (
    <Dialog
      open={open} onClose={onClose}
      fullWidth maxWidth="sm"
    >
      <DialogTitle>
        Delete these {tileMaps.length} tile map(s)?
      </DialogTitle>
      <Divider/>
      <List disablePadding>
        {tileMaps.map((map) => (
          <Fragment key={map.id}>
            <ListItem>
              <ListItemText primary={map.name}/>
            </ListItem>
            <Divider/>
          </Fragment>
        ))}
      </List>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>Cancel</Button>
        <LoadingButton
          loading={deleting} loadingIndicator="Deleting..."
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
