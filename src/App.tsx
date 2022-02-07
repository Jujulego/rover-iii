import { Box } from '@mui/material';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { exhaustMap, filter, interval, mergeMap, of, pairwise, startWith, withLatestFrom } from 'rxjs';

import { Ant, hasKnowledge, hasTree, SmartAnt, Thing } from './ants';
import { CellularGenerator } from './generators';
import { Map } from './maps';
import { IVector, Rect, Vector } from './math2d';
import { useAppDispatch, useAppSelector } from './store';

import { FogLayer } from './layers/FogLayer';
import { HistoryLayer } from './layers/HistoryLayer';
import { LayerBar } from './layers/LayerBar';
import { LayerGrid } from './layers/LayerGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { TreeLayer } from './layers/TreeLayer';
import { enableLayer } from './store/layers.slice';

// Component
export const App: FC = () => {
  // Global state
  const layers = useAppSelector((state) => state.layers);
  const dispatch = useAppDispatch();

  // State
  const [map, setMap] = useState<Map>(new Map('map', new Rect(0, 0, 19, 39)));
  const [ants, setAnts] = useState<Ant[]>([]);
  const [target, setTarget] = useState(new Vector({ x: 1, y: 8 }));

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    setTarget(new Vector(pos));
  }, []);

  // Effects
  useEffect(() => void (async () => {
    const start = performance.now();
    const gen = new CellularGenerator();
    await gen.generate(map, {
      biomes: {
        water: 3,
        grass: 4,
        sand: 3,
      },
      seed: 'tata',
      iterations: 4,
      outBiome: 'water'
    });
    console.log(`map generation took ${performance.now() - start}ms`);

    const ants = [
      new SmartAnt('Smart I', map, 'pink', new Vector({ x: 5, y: 15 })),
      new SmartAnt('Smart II', map, 'blue', new Vector({ x: 31, y: 1 })),
    ];

    setMap(map);
    for (const ant of ants) {
      dispatch(enableLayer({ kind: 'history', ant: ant.id }));
    }
    setAnts(ants);
  })(), [map, dispatch]);

  // Observables
  const $ants = useObservable(pluckFirst, [ants]);

  useSubscription(interval(500).pipe(
    withLatestFrom($ants),
    exhaustMap(([,ants]) => of(...ants).pipe(
      startWith(null),
      pairwise(),
      filter(([prev, ant]) => !!ant && (!prev || prev.position.equals(target) || prev.position.distance(ant.position) > 2)),
      mergeMap(([, ant]) => ant!.step(target))
    )),
  ));

  // Render
  return (
    <Box component="main" display="flex" height="100vh">
      <LayerBar ants={ants} />
      <Box flex={1} overflow="auto">
        { map && (
          <LayerGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { ants.map(ant => (
              <Fragment key={ant.id}>
                { (layers[ant.id]?.fog && hasKnowledge(ant)) && <FogLayer ant={ant} /> }
                { (layers[ant.id]?.tree && hasTree(ant)) && <TreeLayer ant={ant} /> }
                {  layers[ant.id]?.history && <HistoryLayer ant={ant} limit={100} /> }
              </Fragment>
            ))}
            <ImgThingLayer
              map={map}
              things={[
                Thing.createTarget(target),
                ...ants
              ]}
            />
          </LayerGrid>
        ) }
      </Box>
    </Box>
  );
};
