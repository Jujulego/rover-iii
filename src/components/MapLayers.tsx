import { createContext, FC, useContext } from 'react';

import { Ant } from '../ants';
import { Map } from '../maps';
import { Box } from '@mui/material';

// Types
export interface MapLayersCtxState {
  ants: Ant[];
  map?: Map;
  tileSize: number;
}

export interface MapLayersProps {
  ants?: Ant[];
  map?: Map;
  tileSize?: number;
}

// Constants
const MAP_LAYERS_DEFAULTS: MapLayersCtxState = {
  ants: [],
  tileSize: 64,
};

// Context
export const MapLayersCtx = createContext(MAP_LAYERS_DEFAULTS);

// Hooks
export function useAnts(): Ant[] {
  const { ants } = useContext(MapLayersCtx);
  return ants;
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
  const { ants, map, tileSize, children } = { ...MAP_LAYERS_DEFAULTS, ...props };

  // Render
  const width = map ? map.bbox.w : 0;
  const height = map ? map.bbox.h : 0;

  return (
    <Box position="relative" width={width * tileSize} height={height * tileSize}>
      <MapLayersCtx.Provider value={{ ants, map, tileSize }}>
        { children }
      </MapLayersCtx.Provider>
    </Box>
  );
};
