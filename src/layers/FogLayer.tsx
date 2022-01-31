import { styled } from '@mui/material/styles';
import { useLiveQuery } from 'dexie-react-hooks';
import { useObservableState } from 'observable-hooks';
import { memo } from 'react';
import { debounceTime } from 'rxjs';

import { AntWithKnowledge } from '../ants';

// Types
export interface FogLayerProps {
  ant: AntWithKnowledge;
}

interface TileProps {
  x: number;
  y: number;
}

// Styles
const FogTile = styled('div', { skipSx: true })<TileProps>((props) => ({
  gridRow: props.y + 1,
  gridColumn: props.x + 1,
  zIndex: 60,

  background: 'white',
  opacity: 0.5,
  pointerEvents: 'none'
}));

// Component
export const FogLayer = memo<FogLayerProps>(function FogLayer(props) {
  const { ant } = props;

  // State
  const tiles = useLiveQuery(() => ant.map.tiles().toArray(), [ant], []);
  useObservableState(() => ant.knowledge.version$.pipe(
    debounceTime(50)
  ));

  // Render
  return (
    <>
      { tiles.filter(t => !ant.knowledge.contains(t.pos)).map(({ pos }) => (
        <FogTile key={pos.x + ':' + pos.y} x={pos.x} y={pos.y} />
      )) }
    </>
  );
});
