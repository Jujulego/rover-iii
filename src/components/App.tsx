import { FC } from 'react';

import { Ant, Thing } from '../ants';
import { cellularMap } from '../maps';
import { Vector } from '../math2d';

import { ImgGrid } from './img/ImgGrid';
import { ImgMapLayer } from './img/ImgMapLayer';
import { ImgThingLayer } from './img/ImgThingLayer';

// Component
export const App: FC = () => {
  // Render
  const map = cellularMap(
    { w: 20, h: 20 },
    { water: 3, grass: 4, sand: 3 },
    { seed: 'toto', iterations: 5, outBiome: 'water' }
  );

  return (
    <ImgGrid tileSize={62}>
      <ImgMapLayer map={map} />
      <ImgThingLayer map={map} things={[
        new Ant(map, 'blue', new Vector({ x: 3, y: 2 })),
        Thing.createTarget(new Vector({ x: 14, y: 15 }))
      ]} />
    </ImgGrid>
  );
};
