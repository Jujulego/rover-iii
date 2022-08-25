import { FC } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import TileMapsTable from '../components/TileMapsTable';

// Component
const HomePage: FC = () => {
  // Render
  return (
    <Box component="main" mx={4} my={4}>
      <Box component="section" mb={2}>
        <Box component="header" display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ mr: 2 }}>Tile Maps</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <TileMapsTable />
      </Box>
    </Box>
  );
};

export default HomePage;
