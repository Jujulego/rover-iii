import { useInterval } from '@jujulego/alma-utils';
import { FC, useEffect } from 'react';

import { StupidAnt, Thing } from '../ants';
import { cellularMap } from '../maps';
import { Vector } from '../math2d';

import { ImgGrid } from './img/ImgGrid';
import { ImgMapLayer } from './img/ImgMapLayer';
import { ImgThingLayer } from './img/ImgThingLayer';

// Constants
const map = cellularMap(
  { w: 20, h: 20 },
  { water: 3, grass: 4, sand: 3 },
  { seed: 'tutu', iterations: 5, outBiome: 'water' }
);

const ant = new StupidAnt(map, 'blue', new Vector({ x: 5, y: 5 }));

// Component
export const App: FC = () => {
  // State
  const count = useInterval(1000);

  // Effects
  useEffect(() => {
    ant.step();
  }, [count]);

  // Render
  return (
    <ImgGrid tileSize={62}>
      <ImgMapLayer map={map} />
      <ImgThingLayer
        map={map}
        things={[
          ant,
          Thing.createTarget(new Vector({ x: 15, y: 15 }))
        ]}
      />
    </ImgGrid>
  );
};
