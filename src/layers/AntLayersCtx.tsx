import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Ant } from '../ants';
import { LayerKind, LayersState } from '../commons/layers';

// Types
export type LayerSetter = (layer: LayerKind, value: boolean) => void;
export type AntLayerSetter = (ant: Ant, layer: LayerKind, value: boolean) => void;

export interface AntLayersContextState {
  layers: Partial<Record<string, LayersState>>;
  setLayer: AntLayerSetter;
}

export interface AntLayersProps {
  ants: Ant[];
}

// Context
export const AntLayersContext = createContext<AntLayersContextState>({
  layers: {},
  setLayer: () => undefined,
});

// Hooks
export function useAntLayers(ant: Ant): [LayersState, LayerSetter] {
  // Context
  const { layers, setLayer } = useContext(AntLayersContext);

  // Memo
  const state = useMemo(() => layers[ant.id] ?? { fog: false, history: false, tree: false }, [layers, ant.id]);

  // Callbacks
  const setter = useCallback((layer: LayerKind, value: boolean) => setLayer(ant, layer, value), [setLayer, ant]);

  return [state, setter];
}

// Component
export const AntLayersCtx: FC<AntLayersProps> = ({ ants, children }) => {
  // State
  const [layers, setLayers] = useState<AntLayersContextState['layers']>({});

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
  const setLayer = useCallback((ant: Ant, layer: LayerKind, value: boolean) => {
    // Update layer value
    setLayers((old) => ({
      ...old,
      [ant.id]: { ...old[ant.id] ?? { fog: false, history: false, tree: false }, [layer]: value }
    }));
  }, [setLayers]);

  // Render
  return (
    <AntLayersContext.Provider value={{ layers, setLayer }}>
      { children }
    </AntLayersContext.Provider>
  );
};
