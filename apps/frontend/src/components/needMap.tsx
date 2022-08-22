import { FC, forwardRef, Ref } from 'react';

import { Map } from '../maps';

import { useMap } from './MapLayers';

// Types
export interface NeedMapProps {
  map: Map;
}

// HOC
export function needMap<P>(Component: FC<P & NeedMapProps>) {
  // Wrapper
  const NeedMap = (props: P, ref: Ref<FC<P & NeedMapProps>>) => {
    // Context
    const map = useMap();

    // Render
    if (!map) {
      return null;
    }

    return <Component ref={ref} {...props} map={map} />;
  };

  // Name
  const name = Component.displayName || Component.name;
  NeedMap.displayName = `NeedMap(${name})`;

  return forwardRef(NeedMap);
}
