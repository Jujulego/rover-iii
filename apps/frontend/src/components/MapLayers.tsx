import { Box } from '@mui/material';
import { pluckFirst, useObservable, useSubscription } from 'observable-hooks';
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { exhaustMap, filter, interval, mergeMap, of, pairwise, startWith, withLatestFrom } from 'rxjs';

import { Ant, Thing } from '../ants';
import { Map } from '../maps';

// Types
export interface MapLayersCtxState {
  map?: Map;
  tileSize: number;

  ants: Ant[];
  setAnts: Dispatch<SetStateAction<Ant[]>>
}

export interface MapLayersProps {
  target: Thing;
  map?: Map;
  tileSize?: number;
  children?: ReactNode;
}

// Constants
const MAP_LAYERS_DEFAULTS: MapLayersCtxState = {
  tileSize: 64,
  ants: [],
  setAnts: () => null,
};

// Context
export const MapLayersCtx = createContext(MAP_LAYERS_DEFAULTS);

// Hooks
export function useAnts(): [Ant[], Dispatch<SetStateAction<Ant[]>>] {
  const { ants, setAnts } = useContext(MapLayersCtx);
  return [ants, setAnts];
}

export function useMap(): Map | undefined {
  const { map } = useContext(MapLayersCtx);
  return map;
}

export function useMapParameters(): Pick<MapLayersCtxState, 'tileSize'> {
  const { tileSize } = useContext(MapLayersCtx);
  return { tileSize };
}

// Component
export const MapLayers: FC<MapLayersProps> = (props) => {
  const { map, tileSize, target, children } = { ...MAP_LAYERS_DEFAULTS, ...props };

  // State
  const [ants, setAnts] = useState<Ant[]>([]);

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
    <Box component="div" display="flex" minHeight="100vh" overflow="auto">
      <MapLayersCtx.Provider value={{ map, tileSize, ants, setAnts }}>
        { children }
      </MapLayersCtx.Provider>
    </Box>
  );
};
