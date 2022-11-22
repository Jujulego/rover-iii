import { tileKey } from '@ants/world';
import { IPoint, matrix, Rect } from '@jujulego/2d-maths';
import { styled } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC, useMemo } from 'react';

import { worldClient } from '../world-client';
import { BiomeName, BIOMES } from '../biomes';

// Types
export interface BiomeLayerProps {
  readonly world: string;
  readonly area: Rect;
}

interface TileProps {
  readonly pos: IPoint;
}

interface LayerProps {
  readonly s: number;
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
  const tiles = useLiveQuery(() => worldClient.loadTilesIn(props.world, props.area), [props.world, props.area], []);

  // Memos
  const toScreen = useMemo(() => matrix({
    a: 1, c: 0,
    b: 0, d: -1,
    tx: 0, ty: -props.area.size.dy
  }), [props.area]);

  // Render
  return (
    <Layer s={32}>
      { tiles.map((tile) => (
        <Tile
          key={tileKey(tile)}
          pos={toScreen.dot(tile.pos)}
          src={BIOMES[tile.biome as BiomeName]?.texture.toString()}
          alt={tile.biome}
        />
      )) }
    </Layer>
  );
};
