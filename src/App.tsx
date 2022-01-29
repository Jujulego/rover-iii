import { Box } from '@mui/material';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { FC, useCallback, useEffect, useState } from 'react';
import { exhaustMap, interval, withLatestFrom } from 'rxjs';

import { Ant, DFSAnt, hasKnowledge, hasTree, SmartAnt, Thing } from './ants';
import { cellularMap, Map } from './maps';
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
  const [smart, setSmart] = useState<Ant>();
  const [target, setTarget] = useState(new Vector({ x: 35, y: 5 }));
  const [layers, setLayers] = useState<Record<string, LayersState>>({});

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
    const ant = new DFSAnt('DFS', map, 'blue', new Vector({ x: 5, y: 15 }));

    setMap(map);
    setLayers((old) => ({
      ...old,
      [ant.name]: {
        fog: true,
        history: true,
        tree: true,
      }
    }));
    setSmart(ant);
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
      <LayerBar
        ants={[smart].filter((o): o is Ant => !!o)}
        layers={layers}
        onAntLayerToggle={(ant, layer) => setLayers((old) => ({ ...old, [ant]: { ...old[ant], [layer]: !old[ant][layer] }}))}
      />
      <Box flex={1} overflow="auto">
        { map && (
          <LayerGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { (smart && layers[smart.name]?.fog && hasKnowledge(smart)) && <FogLayer ant={smart} /> }
            { (smart && layers[smart.name]?.tree && hasTree(smart)) && <TreeLayer ant={smart} /> }
            { smart  && layers[smart.name]?.history && <HistoryLayer ant={smart} limit={100} /> }
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
