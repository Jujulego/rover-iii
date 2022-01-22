import { useLiveQuery } from 'dexie-react-hooks';
import { memo } from 'react';

import { AntWithMemory } from '../ants';

import { FogData, FogTile } from './FogTile';

// Types
export interface FogLayerProps {
  ant: AntWithMemory<FogData>;
}

// Component
export const FogLayer = memo<FogLayerProps>(function FogLayer(props) {
  const { ant } = props;

  // State
  const tiles = useLiveQuery(() => ant.map.tiles().toArray(), [ant], []);

  // Render
  return (
    <>
      { tiles.map(({ pos }) => (
        <FogTile key={pos.x + ':' + pos.y} pos={pos} ant={ant} />
      )) }
    </>
  );
});
