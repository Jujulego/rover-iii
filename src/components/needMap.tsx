import { FC } from 'react';

import { Map } from '../maps';

import { useMap } from './MapLayers';

// Types
export interface NeedMapProps {
  map: Map
}

// HOC
export function needMap<P>(Component: FC<P & NeedMapProps>) {
  // Wrapper
  const NeedMap: FC<P> = (props: P) => {
    // Context
    const map = useMap();

    // Render
    if (!map) {
      return null;
    }

    return <Component {...props} map={map} />;
  };

  // Name
  const name = Component.displayName || Component.name;
  NeedMap.displayName = `needMap(${name})`;

  return NeedMap;
}
