import { $hook } from '@jujulego/aegis-react';
import { ChangeEvent, FC, useCallback, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';

import { ITileMap, TileMap } from '../../maps/tile-map.entity';
import { EditTileMapDialog } from './EditTileMapDialog';
import { DeleteTileMapsAlert } from './DeleteTileMapsAlert';

// Api calls
const useTileMaps = $hook.list(TileMap.findAll);

// Component
const TileMapsTable: FC = () => {
  // Fetch all maps
  const maps = useTileMaps('all');

  // State
  const [editing, setEditing] = useState<boolean | ITileMap>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  // Callbacks
  const handleSelectAll = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(maps.data.map(m => m.id));
    } else {
      setSelected([]);
    }
  }, [maps]);

  const handleSelect = useCallback((map: ITileMap) => {
    const idx = selected.indexOf(map.id);

    if (idx === -1) {
      setSelected([...selected, map.id]);
    } else {
      setSelected([
        ...selected.slice(0, idx),
        ...selected.slice(idx + 1)
      ]);
    }
  }, [selected, maps]);

  // Render
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Toolbar
        sx={{
          pl: 2, pr: 1,
          ...(selected.length > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          })
        }}
      >
        { selected.length === 0 ? (
          <Typography sx={{ flex: 1 }} variant="h6">Tile maps</Typography>
        ) : (
          <Typography sx={{ flex: 1 }} color="inherit" variant="subtitle1">{selected.length} tile map(s) selected</Typography>
        ) }
        { selected.length === 0 && (
          <Tooltip title="Create">
            <IconButton onClick={() => setEditing(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) }
        { selected.length === 1 && (
          <Tooltip title="Edit">
            <IconButton onClick={() => setEditing(maps.data.find(m => m.id === selected[0]) ?? false)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) }
        { selected.length > 0 && (
          <Tooltip title="Delete" sx={{ ml: 1 }}>
            <IconButton onClick={() => setDeleting(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) }
        <Tooltip title="Refresh" sx={{ ml: 1 }}>
          <IconButton onClick={() => maps.refresh('keep')}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < maps.data.length}
                  checked={maps.data.length > 0 && selected.length === maps.data.length}
                  inputProps={{
                    'aria-label': 'select all tile maps'
                  }}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell component="th" scope="col">Name</TableCell>
              <TableCell component="th" scope="col">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maps.data.map((map) => {
              const isSelected = selected.includes(map.id);

              return (
                <TableRow
                  key={map.id}
                  hover tabIndex={-1}
                  selected={isSelected} onClick={() => handleSelect(map)}
                  role="checkbox" aria-checked={isSelected}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">{map.name}</TableCell>
                  <TableCell>{map.bbox.r - map.bbox.l}:{map.bbox.b - map.bbox.t}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <EditTileMapDialog
        tileMap={typeof editing === "object" ? editing : undefined}
        open={!!editing} onClose={() => setEditing(false)}
      />

      <DeleteTileMapsAlert
        tileMaps={
          selected.map((id) => maps.data.find((map) => map.id === id))
            .filter((map): map is ITileMap => !!map)
        }
        open={deleting} onClose={() => setDeleting(false)}
      />
    </Paper>
  );
};

export default TileMapsTable;
