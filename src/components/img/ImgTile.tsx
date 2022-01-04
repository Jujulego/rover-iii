import { FC } from 'react';

import { BiomeName, BIOMES } from '../../biomes';
import { Vector } from '../../math2d';
import { Box } from '@mui/material';

// Types
export interface TileProps {
  pos: Vector;
  biome: BiomeName;
}

// Component
export const ImgTile: FC<TileProps> = (props) => {
  // Render
  const biome = BIOMES.find(biome => biome.name === props.biome);

  return (
    <Box
      component="img"
      gridRow={props.pos.y + 1}
      gridColumn={props.pos.x + 1}
      src={biome?.texture?.toString() || ''}
      alt={props.biome}
    />
  );
};
