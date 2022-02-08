import { Box } from '@mui/material';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { FC, useCallback, useEffect, useState } from 'react';
import { exhaustMap, filter, interval, mergeMap, of, pairwise, startWith, withLatestFrom } from 'rxjs';

import { Ant, SmartAnt, Thing } from './ants';
import { CellularGenerator } from './generators';
import { Map } from './maps';
import { IVector, Rect, Vector } from './math2d';

import { AntLayersCtx } from './layers/AntLayersCtx';
import { AntLayers } from './layers/AntLayers';
import { LayerBar } from './layers/LayerBar';
import { LayerGrid } from './layers/LayerGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { MapLayers } from './components/MapLayers';
import { BiomeLayer } from './components/layers/BiomeLayer';
import { ThingLayer } from './components/layers/ThingsLayer';

// Constants
const target = Thing.createTarget(new Vector({ x: 1, y: 8 }));

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>(new Map('map', new Rect(0, 0, 19, 39)));
  const [ants, setAnts] = useState<Ant[]>([]);

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    target.position = new Vector(pos);
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
    setAnts(ants);
  })(), [map]);

  // Observables
  const $ants = useObservable(pluckFirst, [ants]);

  useSubscription(interval(500).pipe(
    withLatestFrom($ants),
    exhaustMap(([,ants]) => of(...ants).pipe(
      startWith(null),
      pairwise(),
      filter(([prev, ant]) => !!ant && (!prev || prev.position.equals(target.position) || prev.position.distance(ant.position) > 2)),
      mergeMap(([, ant]) => ant!.step(target.position))
    )),
  ));

  // Render
  return (
    <Box component="main" display="flex" height="100vh">
      {/*<AntLayersCtx ants={ants}>*/}
      {/*  <LayerBar ants={ants} />*/}
      {/*  <Box flex={1} overflow="auto">*/}
      {/*    { map && (*/}
      {/*      <LayerGrid tileSize={32}>*/}
      {/*        <ImgMapLayer map={map} onTileClick={handleTileClick} />*/}
      {/*        { ants.map(ant => (*/}
      {/*          <AntLayers key={ant.id} ant={ant} />*/}
      {/*        ))}*/}
      {/*        <ImgThingLayer*/}
      {/*          map={map}*/}
      {/*          things={[*/}
      {/*            Thing.createTarget(target),*/}
      {/*            ...ants*/}
      {/*          ]}*/}
      {/*        />*/}
      {/*      </LayerGrid>*/}
      {/*    ) }*/}
      {/*  </Box>*/}
      {/*</AntLayersCtx>*/}
      <MapLayers ants={ants} map={map} tileSize={32}>
        <BiomeLayer onTileClick={handleTileClick} />
        <ThingLayer things={[target]} />
      </MapLayers>
    </Box>
  );
};
