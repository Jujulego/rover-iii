import { useLiveQuery } from 'dexie-react-hooks';
import { memo } from 'react';

import { Map } from '../../maps';
import { IVector } from '../../math2d';

import { ImgTile } from './ImgTile';

// Types
export interface ImgMapLayerProps {
  map: Map;
  onTileClick?: (pos: IVector) => void;
}

// Component
export const ImgMapLayer = memo<ImgMapLayerProps>(function ImgMapLayer(props) {
  const { map, onTileClick } = props;

  // State
  const tiles = useLiveQuery(() => map.tiles().toArray(), [map], []);

  // Render
  return (
    <>
      { tiles.map(({ pos, biome }) => (
        <ImgTile
          key={pos.x + ':' + pos.y}
          pos={map.bbox.tl.mul(-1).add(pos)}
          biome={biome}
          onClick={() => onTileClick && onTileClick(pos)}
        />
      )) }
    </>
  );
});
