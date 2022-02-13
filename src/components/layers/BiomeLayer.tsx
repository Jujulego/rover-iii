import { styled } from '@mui/material/styles';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useMemo } from 'react';

import { BiomeName, BIOMES } from '../../biomes';
import { Vector } from '../../math2d';

import { useMapParameters } from '../MapLayers';
import { needMap } from '../needMap';

// Types
export interface BiomeTileProps {
  pos: Vector;
  biome: BiomeName;
  onClick?: () => void;
}

interface TileProps {
  x: number;
  y: number;
}

interface LayerProps {
  s: number;
}

// Styles
const Tile = styled('img', { skipSx: true })<TileProps>((props) => ({
  height: '100%',
  width: '100%',
  gridRow: props.y + 1,
  gridColumn: props.x + 1,
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
export const BiomeTile = memo<BiomeTileProps>(function BiomeTile(props) {
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

export const BiomeLayer = needMap(function BiomeLayer({ map }) {
  // Context
  const { tileSize } = useMapParameters();

  // Database
  const tiles = useLiveQuery(() => map.tiles().toArray(), [map], []);

  // Render
  return (
    <Layer s={tileSize}>
      { tiles.map(({ pos, biome }) => (
        <BiomeTile
          key={pos.x + ':' + pos.y}
          pos={map.bbox.tl.mul(-1).add(pos)}
          biome={biome}
        />
      )) }
    </Layer>
  );
});
