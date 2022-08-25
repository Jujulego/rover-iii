import { $hook } from '@jujulego/aegis-react';
import { FC } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { TileMap } from '../maps/tile-map.entity';

// Api calls
const useTileMaps = $hook.list(TileMap.findAll);

// Component
const HomePage: FC = () => {
  // Fetch all maps
  const maps = useTileMaps('home');

  // Render
  return (
    <Box component="main" mx={4} my={4}>
      <Box component="header" display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ mr: 2 }}>Tile Maps</Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      <TableContainer component={Paper}>
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
    </Box>
  );
};

export default HomePage;
