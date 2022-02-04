import { styled } from '@mui/material/styles';
import { memo, useMemo } from 'react';

import { BiomeName, BIOMES } from '../../biomes';
import { Vector } from '../../math2d';

// Types
export interface ImgTileProps {
  pos: Vector;
  biome: BiomeName;
  onClick?: () => void;
}

interface TileProps {
  x: number;
  y: number;
}

// Styles
const Tile = styled('img', { skipSx: true })<TileProps>((props) => ({
  height: '100%',
  width: '100%',
  gridRow: props.y + 1,
  gridColumn: props.x + 1,
  zIndex: 0
}));

// Component
export const ImgTile = memo<ImgTileProps>(function ImgTile(props) {
  // Render
  const biome = useMemo(() => BIOMES.find(biome => biome.name === props.biome), [props.biome]);

  return (
    <Tile
      x={props.pos.x}
      y={props.pos.y}
      src={biome?.texture?.toString() || ''}
      alt={props.biome}
      onClick={props.onClick}
    />
  );
});
