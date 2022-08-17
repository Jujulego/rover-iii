import { styled } from '@mui/material/styles';
import { useLiveQuery } from 'dexie-react-hooks';
import { useObservableState } from 'observable-hooks';
import { memo } from 'react';
import { debounceTime } from 'rxjs';

import { AntWithKnowledge } from '../../ants';

import { useMapParameters } from '../MapLayers';

// Types
export interface AntFogLayerProps {
  ant: AntWithKnowledge;
}

interface TileProps {
  x: number;
  y: number;
}

interface LayerProps {
  s: number;
}

// Styles
const Tile = styled('div', { skipSx: true })<TileProps>((props) => ({
  gridRow: props.y + 1,
  gridColumn: props.x + 1,
  zIndex: 60,

  background: 'white',
  opacity: 0.5,
  pointerEvents: 'none'
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

// Component
export const AntFogLayer = memo<AntFogLayerProps>(function AntFogLayer(props) {
  const { ant } = props;

  // Context
  const { tileSize } = useMapParameters();

  // State
  const tiles = useLiveQuery(() => ant.map.tiles().toArray(), [ant], []);
  useObservableState(() => ant.knowledge.version$.pipe(
    debounceTime(50)
  ));

  // Render
  return (
    <Layer s={tileSize}>
      { tiles.filter(t => !ant.knowledge.contains(t.pos)).map(({ pos }) => (
        <Tile key={pos.x + ':' + pos.y} x={pos.x} y={pos.y} />
      )) }
    </Layer>
  );
});
