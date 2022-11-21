import { IPoint, rect } from '@jujulego/2d-maths';
import { styled } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC } from 'react';

import { worldClient } from '../world-client';

// Types
export interface BiomeLayerProps {
  readonly world: string;
}

interface TileProps {
  pos: IPoint;
}

interface LayerProps {
  s: number;
}

// Styles
const Tile = styled('img', { skipSx: true })<TileProps>(({ pos }) => ({
  height: '100%',
  width: '100%',
  gridRow: pos.y + 1,
  gridColumn: pos.x + 1,
  zIndex: 0
}));

const Layer = styled('div', { skipSx: true })<LayerProps>((props) => ({
  position: 'absolute',
  top: 0,
  left: 0,

  display: 'grid',
  gridAutoRows: props.s,
  gridAutoColumns: props.s,
}));

// Components
export const BiomeLayer: FC<BiomeLayerProps> = (props) => {
  // Load tiles
  const tiles = useLiveQuery(() => worldClient.loadTilesIn(props.world, rect({ x: 0, y: 0 }, { x: 2, y: 2 })), [props.world]);

  return (
    <Layer s={64}>
      { tiles?.map((tile) => (
        <Tile key={`${tile.pos.x},${tile.pos.y}`} pos={tile.pos} alt={tile.biome} />
      )) }
    </Layer>
  );
};
