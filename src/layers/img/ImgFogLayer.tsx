import { useLiveQuery } from 'dexie-react-hooks';
import { memo } from 'react';

import { AntWithMemory } from '../../ants';
import { Map } from '../../maps';

import { FogData, ImgFogTile } from './ImgFogTile';

// Types
export interface ImgFogLayerProps {
  ant: AntWithMemory<FogData>;
  map: Map;
}

// Component
export const ImgFogLayer = memo<ImgFogLayerProps>(function ImgFogLayer (props) {
  const { ant, map } = props;

  // State
  const tiles = useLiveQuery(() => map.tiles().toArray(), [map], []);

  // Render
  return (
    <>
      { tiles.map(({ pos }) => (
        <ImgFogTile key={pos.x + ':' + pos.y} pos={pos} ant={ant} />
      )) }
    </>
  );
});
