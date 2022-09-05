import { $hook } from '@jujulego/aegis-react';
import { FC, useState } from 'react';

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
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import { TileMap } from '../../maps/tile-map.entity';
import { EditTileMapDialog } from './EditTileMapDialog';

// Api calls
const useTileMaps = $hook.list(TileMap.findAll);

// Component
const TileMapsTable: FC = () => {
  // Fetch all maps
  const maps = useTileMaps('all');

  // State
  const [editing, setEditing] = useState(false);

  // Render
  return (
    <Paper>
      <Toolbar sx={{ pl: 2, pr: 1 }}>
        <Typography sx={{ flex: 1 }} variant="h6">Tile Maps</Typography>
        <Tooltip title="Create">
          <IconButton onClick={() => setEditing(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh">
          <IconButton onClick={() => maps.refresh('keep')}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="col">Name</TableCell>
              <TableCell component="th" scope="col">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maps.data.map((map) => (
              <TableRow
                key={map.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{map.name}</TableCell>
                <TableCell>{map.bbox.r - map.bbox.l}:{map.bbox.b - map.bbox.t}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditTileMapDialog open={editing} onClose={() => setEditing(false)} />
    </Paper>
  );
};

export default TileMapsTable;
