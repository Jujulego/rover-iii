import { FC } from 'react';

import { Map } from '../../maps';

import { ImgTile } from './ImgTile';

// Types
export interface ImgAntLayerProps {
  map: Map;
}

// Component
export const ImgMapLayer: FC<ImgAntLayerProps> = ({ map }) => (
  <>
    { map.tiles.map(({ pos, biome }) => (
      <ImgTile key={`${pos.x}:${pos.y}`} pos={pos.sub(map.bbox.tl)} biome={biome} />
    )) }
  </>
);
