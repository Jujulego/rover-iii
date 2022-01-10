import { useInterval } from '@jujulego/alma-utils';
import { FC, useState } from 'react';

import { SmartAnt, Thing } from '../ants';
import { cellularMap, simpleMap, Map } from '../maps';
import { Vector } from '../math2d';

import { ImgGrid } from './img/ImgGrid';
import { ImgMapLayer } from './img/ImgMapLayer';
import { ImgThingLayer } from './img/ImgThingLayer';
import { ImgHistoryLayer } from './img/ImgHistoryLayer';
import { ImgTreeLayer } from './img/ImgTreeLayer';
import { ImgFogLayer } from './img/ImgFogLayer';

// Constants
const map = cellularMap(
  { w: 40, h: 20 },
  { water: 3, grass: 4, sand: 3 },
  { seed: 'tata', iterations: 5, outBiome: 'water' }
);
// const map = Map.fromMatrix([
//   ['grass', 'grass', 'water', 'grass', 'grass'],
//   ['grass', 'grass', 'water', 'grass', 'grass'],
//   ['grass', 'grass', 'water', 'grass', 'grass'],
//   ['grass', 'grass', 'water', 'grass', 'grass'],
//   ['grass', 'grass', 'water', 'grass', 'grass'],
// ]);

const ant = new SmartAnt(map, 'blue', new Vector({ x: 5, y: 15 }));

// Component
export const App: FC = () => {
  // State
  const [target, setTarget] = useState(new Vector({ x: 35, y: 5 }));

  // Render
  useInterval(500, () => {
    ant.step(target);
  });

  return (
    <ImgGrid tileSize={32}>
      <ImgMapLayer map={map} onTileClick={(pos) => { ant.teleport(pos); setTarget(new Vector(target)); }} />
      <ImgFogLayer ant={ant} map={map} />
      {/*<ImgHistoryLayer ant={ant} map={map} />*/}
      { ant.getRoots().map(root => (
        <ImgTreeLayer key={`${root.pos.x}:${root.pos.y}`} ant={ant} map={map} from={root.pos} />
      )) }
      <ImgThingLayer
        map={map}
        things={[
          Thing.createTarget(target),
          ant
        ]}
      />
    </ImgGrid>
  );
};
