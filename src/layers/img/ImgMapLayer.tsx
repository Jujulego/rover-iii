import { FC, memo } from 'react';

import { Map } from '../../maps';
import { Vector } from '../../math2d';

import { ImgTile } from './ImgTile';
import { useLiveQuery } from 'dexie-react-hooks';

// Types
export interface ImgMapLayerProps {
  map: Map;
  onTileClick?: (pos: Vector) => void;
}

// Component
export const ImgMapLayer: FC<ImgMapLayerProps> = memo<ImgMapLayerProps>(function ImgMapLayer(props) {
  const { map, onTileClick } = props;

  // State
  const tiles = useLiveQuery(() => map.tiles(), [map], []);

  // Render
  return (
    <>
      { tiles.map(({ pos, biome }) => (
        <ImgTile
          key={`${pos.x}:${pos.y}`}
          pos={pos.sub(map.bbox.tl)}
          biome={biome}
          onClick={() => onTileClick && onTileClick(pos)}
        />
      )) }
    </>
  );
});
