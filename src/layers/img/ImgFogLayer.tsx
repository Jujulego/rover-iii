import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC } from 'react';

import { DStarAnt } from '../../ants';
import { Map } from '../../maps';

// Types
export interface ImgFogLayerProps {
  ant: DStarAnt;
  map: Map;
}

interface TileProps {
  x: number;
  y: number;

}

// Styles
const Tile = styled('div', { skipSx: true })<TileProps>((props) => ({
  gridRow: props.y + 1,
  gridColumn: props.x + 1,

  background: 'white',
  opacity: 0.5,
  pointerEvents: 'none'
}));

// Component
export const ImgFogLayer: FC<ImgFogLayerProps> = (props) => {
  const { ant, map } = props;

  // State
  const tiles = useLiveQuery(() => map.tiles().toArray(), [map], []);

  // Render
  return (
    <>
      { tiles.filter(({ pos }) => !ant.getMapData(pos)?.detected).map(({ pos }) => (
        <Tile
          key={`${pos.x}:${pos.y}`}
          x={pos.x - map.bbox.l}
          y={pos.y - map.bbox.t}
        />
      )) }
    </>
  );
};
