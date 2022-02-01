import { Box } from '@mui/material';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { exhaustMap, interval, withLatestFrom } from 'rxjs';

import { Ant, BFSAnt, DFSAnt, hasKnowledge, hasTree, SmartAnt, Thing } from './ants';
import { CellularGenerator } from './generators';
import { Map } from './maps';
import { IVector, Vector } from './math2d';

import { FogLayer } from './layers/FogLayer';
import { HistoryLayer } from './layers/HistoryLayer';
import { LayersState } from './layers/layers';
import { LayerBar } from './layers/LayerBar';
import { LayerGrid } from './layers/LayerGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { TreeLayer } from './layers/TreeLayer';

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>();
  const [ants, setAnts] = useState<Ant[]>([]);
  const [target, setTarget] = useState(new Vector({ x: 35, y: 5 }));
  const [layers, setLayers] = useState<Record<string, LayersState>>({});

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    setTarget(new Vector(pos));
  }, []);

  // Effects
  // useEffect(() => void (async () => {
  //   const start = performance.now();
  //   const gen = new CellularGenerator();
  //   await gen.generate('test', { w: 100, h: 100 }, {
  //     biomes: {
  //       water: 3,
  //       grass: 4,
  //       sand: 3
  //     },
  //     seed: 'tata',
  //     iterations: 5,
  //     outBiome: 'water'
  //   });
  //   console.log(`map generation took ${performance.now() - start}ms`);
  // })(), []);

  useEffect(() => void (async () => {
    const start = performance.now();
    const gen = new CellularGenerator(80);
    const map = await gen.generate('map', { w: 40, h: 20 }, {
      biomes: {
        water: 3,
        grass: 4,
        sand: 3
      },
      seed: 'tata',
      iterations: 5,
      outBiome: 'water'
    });
    console.log(`map generation took ${performance.now() - start}ms`);

    const ants = [
      new DFSAnt('Depth', map, 'blue', new Vector({ x: 5, y: 15 })),
      new BFSAnt('Breath', map, 'yellow', new Vector({ x: 5, y: 15 })),
      new SmartAnt('Smart', map, 'pink', new Vector({ x: 5, y: 15 })),
    ];

    setMap(map);
    setLayers((old) => ants.reduce((acc, ant) => ({
      ...acc,
      [ant.name]: {
        fog: false,
        history: true,
        tree: false,
      }
    }), old));
    setAnts(ants);
  })(), []);

  // Observables
  const $ants = useObservable(pluckFirst, [ants]);

  useSubscription(interval(500).pipe(
    withLatestFrom($ants),
    exhaustMap(([,ants]) => Promise.all(ants.map(ant => ant.step(target))))
  ));

  // Render
  return (
    <Box component="main" display="flex" height="100vh">
      <LayerBar
        ants={ants}
        layers={layers}
        onAntLayerToggle={(ant, layer) => setLayers((old) => ({ ...old, [ant]: { ...old[ant], [layer]: !old[ant][layer] }}))}
      />
      <Box flex={1} overflow="auto">
        { map && (
          <LayerGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { ants.map(ant => (
              <Fragment key={ant.name}>
                { (layers[ant.name]?.fog && hasKnowledge(ant)) && <FogLayer ant={ant} /> }
                { (layers[ant.name]?.tree && hasTree(ant)) && <TreeLayer ant={ant} /> }
                {  layers[ant.name]?.history && <HistoryLayer ant={ant} limit={100} /> }
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
