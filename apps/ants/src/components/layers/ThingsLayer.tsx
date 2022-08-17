import { styled } from '@mui/material/styles';
import { useObservableState } from 'observable-hooks';
import { FC, memo, useMemo } from 'react';

import { Thing } from '../../ants';
import { NULL_VECTOR } from '../../math2d';

import { useAnts, useMapParameters } from '../MapLayers';

// Types
export interface ThingLayerProps {
  things: Thing[];
}

export interface ThingTileProps {
  thing: Thing;
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
  zIndex: 50
}));

const Layer = styled('div', { skipSx: true })<LayerProps>((props) => ({
  position: 'absolute',
  top: 0,
  left: 0,

  display: 'grid',
  gridAutoRows: props.s,
  gridAutoColumns: props.s,
  pointerEvents: 'none',
}));

// Components
export const ThingTile = memo<ThingTileProps>(function ThingTile({ thing }) {
  // State
  const position = useObservableState(thing.position$, NULL_VECTOR);

  // Render
  return (
    <Tile
      x={position.x}
      y={position.y}
      src={thing.image.toString()}
    />
  );
});

export const ThingLayer: FC<ThingLayerProps> = (props) => {
  // Context
  const [ants,] = useAnts();
  const { tileSize } = useMapParameters();

  // Memo
  const things = useMemo(() => [...props.things, ...ants], [ants, props.things]);

  // Render
  return (
    <Layer s={tileSize}>
      { things.map((thing) => (
        <ThingTile key={thing.id} thing={thing} />
      )) }
    </Layer>
  );
};
