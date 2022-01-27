import { Box } from '@mui/material';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { FC, useCallback, useEffect, useState } from 'react';
import { exhaustMap, interval, withLatestFrom } from 'rxjs';

import { Ant, AntWithKnowledge, AntWithTree, hasKnowledge, hasTree, SmartAnt, StupidAnt, Thing } from './ants';
import { cellularMap, Map, simpleMap } from './maps';
import { IVector, Vector } from './math2d';

import { LayerBar } from './layers/LayerBar';
import { LayerGrid } from './layers/LayerGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { HistoryLayer } from './layers/HistoryLayer';
import { TreeLayer } from './layers/TreeLayer';
import { FogLayer } from './layers/FogLayer';

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>();
  const [smart, setSmart] = useState<Ant & Partial<AntWithKnowledge> & Partial<AntWithTree>>();
  const [target, setTarget] = useState(new Vector({ x: 35, y: 5 }));

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    setTarget(new Vector(pos));
  }, []);

  // Effects
  useEffect(() => void (async () => {
    const map = await cellularMap(
      'map',
      { w: 40, h: 20 },
      { water: 3, grass: 4, sand: 3 },
      { seed: 'tata', iterations: 5, outBiome: 'water' }
    );

    //const map = await simpleMap('map', { w: 5, h: 5 }, 'grass');

    setMap(map);
    setSmart(new SmartAnt('Smart', map, 'blue', new Vector({ x: 5, y: 15 })));
  })(), []);

  // Observables
  const $smart = useObservable(pluckFirst, [smart]);

  useSubscription(interval(500).pipe(
    withLatestFrom($smart),
    exhaustMap(async ([,ant]) => ant?.step(target))
  ));

  // Render
  return (
    <Box component="main" display="flex" height="100vh">
      <LayerBar ants={[smart].filter((o): o is Ant => !!o)} />
      <Box flex={1} overflow="auto">
        { map && (
          <LayerGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { (smart && hasKnowledge(smart)) && <FogLayer ant={smart} /> }
            { (smart && hasTree(smart)) && <TreeLayer ant={smart} /> }
            { smart && <HistoryLayer ant={smart} limit={100} /> }
            <ImgThingLayer
              map={map}
              things={[
                Thing.createTarget(target),
                smart
              ].filter((o): o is Thing => !!o)}
            />
          </LayerGrid>
        ) }
      </Box>
    </Box>
  );
};
