import { useLiveQuery } from 'dexie-react-hooks';
import { memo } from 'react';

import { AntWithMemory } from '../ants';
import { Map } from '../maps';

import { FogData, FogTile } from './FogTile';

// Types
export interface ImgFogLayerProps {
  ant: AntWithMemory<FogData>;
  map: Map;
}

// Component
export const FogLayer = memo<ImgFogLayerProps>(function ImgFogLayer (props) {
  const { ant, map } = props;

  // State
  const tiles = useLiveQuery(() => map.tiles().toArray(), [map], []);

  // Render
  return (
    <>
      { tiles.map(({ pos }) => (
        <FogTile key={pos.x + ':' + pos.y} pos={pos} ant={ant} />
      )) }
    </>
  );
});
