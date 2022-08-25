import { FC } from 'react';

import Box from '@mui/material/Box';

import TileMapsTable from '../components/TileMapsTable';

// Component
const HomePage: FC = () => {
  // Render
  return (
    <Box component="main" mx={4} my={4}>
      <TileMapsTable />
    </Box>
  );
};

export default HomePage;
