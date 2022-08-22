import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Ant } from 'src/ants';
import { LayerKind, LayersState } from 'src/commons/layers';
import { useAnts } from './MapLayers';

// Types
export type LayerUpdator = (layer: LayerKind, value: boolean) => void;
export type AntLayerUpdator = (ant: Ant, layer: LayerKind, value: boolean) => void;

export interface AntLayersCtxState {
  layers: Partial<Record<string, LayersState>>;
  updateLayers: AntLayerUpdator;
}

// Context
export const AntLayersCtx = createContext<AntLayersCtxState>({
  layers: {},
  updateLayers: () => null
});

// Hooks
export function useAntLayers(ant: Ant): [LayersState, LayerUpdator] {
  // Context
  const { layers, updateLayers } = useContext(AntLayersCtx);

  // Memo
  const state = useMemo(() => layers[ant.id] ?? { fog: false, history: false, tree: false }, [layers, ant.id]);

  // Callbacks
  const updator = useCallback((layer: LayerKind, value: boolean) => {
    updateLayers(ant, layer, value);
  }, [updateLayers, ant]);

  return [state, updator];
}

// Component
export const AntLayersStore: FC<{ children?: ReactNode }> = ({ children }) => {
  // Context
  const [ants,] = useAnts();

  // State
  const [layers, setLayers] = useState<AntLayersCtxState['layers']>({});

  // Effects
  useEffect(() => {
    // Add layers
    setLayers((old) => ants.reduce((acc, ant) => ({
      ...acc,
      [ant.id]: {
        fog: false,
        history: true,
        tree: false,
      }
    }), old));
  }, [ants]);

  // Callbacks
  const updateLayers = useCallback((ant: Ant, layer: LayerKind, value: boolean) => {
    // Update layer value
    setLayers((old) => ({
      ...old,
      [ant.id]: { ...old[ant.id] ?? { fog: false, history: false, tree: false }, [layer]: value }
    }));
  }, [setLayers]);

  // Render
  return (
    <AntLayersCtx.Provider value={{ layers, updateLayers }}>
      { children }
    </AntLayersCtx.Provider>
  );
};
