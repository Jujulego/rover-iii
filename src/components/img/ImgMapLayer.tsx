import { FC } from 'react';

import { Map } from '../../maps';
import { Vector } from '../../math2d';

import { ImgTile } from './ImgTile';

// Types
export interface ImgAntLayerProps {
  map: Map;
  onTileClick?: (pos: Vector) => void;
}

// Component
export const ImgMapLayer: FC<ImgAntLayerProps> = (props) => {
  const { map, onTileClick } = props;

  // Render
  return (
    <>
      {map.tiles.map(({ pos, biome }) => (
        <ImgTile
          key={`${pos.x}:${pos.y}`}
          pos={pos.sub(map.bbox.tl)}
          biome={biome}
          onClick={() => onTileClick && onTileClick(pos)}
        />
      ))}
    </>
  );
};
