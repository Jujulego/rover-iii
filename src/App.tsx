import { Box } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';

import { SmartAnt, StupidAnt, Thing } from './ants';
import { cellularMap, Map } from './maps';
import { IVector, Vector } from './math2d';

import { LayerGrid } from './layers/LayerGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { HistoryLayer } from './layers/HistoryLayer';
import { TreeLayer } from './layers/TreeLayer';
import { FogLayer } from './layers/FogLayer';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { exhaustMap, interval, withLatestFrom } from 'rxjs';

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>();
  const [ant, setAnt] = useState<SmartAnt>();
  const [target,] = useState(new Vector({ x: 35, y: 5 }));

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    if (ant) ant.position = new Vector(pos);
  }, [ant]);

  // Effects
  useEffect(() => void (async () => {
    const map = await cellularMap(
      'map',
      { w: 40, h: 20 },
      { water: 3, grass: 4, sand: 3 },
      { seed: 'tata', iterations: 5, outBiome: 'water' }
    );

    const ant = new SmartAnt(map, 'blue', new Vector({ x: 2, y: 16 }));

    setMap(map);
    setAnt(ant);
  })(), []);

  // Observables
  const $ant = useObservable(pluckFirst, [ant]);
  useSubscription(interval(500).pipe(
    withLatestFrom($ant),
    exhaustMap(async ([,ant]) => ant?.step(target))
  ));

  // Render
  return (
    <Box component="main" display="flex" height="100vh">
      {/*<LayerBar />*/}
      <Box flex={1} overflow="auto">
        { map && (
          <LayerGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { ant && (
              <>
                <FogLayer ant={ant} />
                <TreeLayer ant={ant} />
                <HistoryLayer ant={ant} />
                <ImgThingLayer
                  map={map}
                  things={[
                    Thing.createTarget(target),
                    ant
                  ]}
                />
              </>
            ) }
          </LayerGrid>
        ) }
      </Box>
    </Box>
  );
};
