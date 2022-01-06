import { useInterval } from '@jujulego/alma-utils';
import { FC } from 'react';

import { StupidAnt, Thing } from '../ants';
import { cellularMap } from '../maps';
import { Vector } from '../math2d';

import { ImgGrid } from './img/ImgGrid';
import { ImgMapLayer } from './img/ImgMapLayer';
import { ImgThingLayer } from './img/ImgThingLayer';
import { ImgHistoryLayer } from './img/ImgHistoryLayer';

// Constants
const map = cellularMap(
  { w: 40, h: 20 },
  { water: 3, grass: 4, sand: 3 },
  { seed: 'toto', iterations: 5, outBiome: 'water' }
);

const ant1 = new StupidAnt(map, 'blue', new Vector({ x: 5, y: 5 }));
const ant2 = new StupidAnt(map, 'yellow', new Vector({ x: 35, y: 5 }));

const target = new Vector({ x: 20, y: 15 });

// Component
export const App: FC = () => {
  useInterval(500, () => {
    ant1.step(target);
    ant2.step(target);
  });

  // Render
  return (
    <ImgGrid tileSize={32}>
      <ImgMapLayer map={map} />
      <ImgHistoryLayer ant={ant1} map={map} />
      <ImgHistoryLayer ant={ant2} map={map} />
      <ImgThingLayer
        map={map}
        things={[
          Thing.createTarget(target),
          ant1, ant2
        ]}
      />
    </ImgGrid>
  );
};
