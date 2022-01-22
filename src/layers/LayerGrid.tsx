import { Box } from '@mui/material';
import { FC } from 'react';

// Types
export interface ImgGridProps {
  tileSize?: number;
}

// Component
export const LayerGrid: FC<ImgGridProps> = ({ tileSize = 64, children }) => (
  <Box display="grid" gridAutoRows={tileSize} gridAutoColumns={tileSize}>
    { children }
  </Box>
);
