import { memo } from 'react';

import { Thing } from '../../ants';
import { Map } from '../../maps';

import { ImgThing } from './ImgThing';

// Types
export interface ImgThingLayerProps {
  map: Map;
  things: Thing[];
}

// Component
export const ImgThingLayer = memo<ImgThingLayerProps>(function ImgThingLayer({ map, things }) {
  return <>
    { things.map((thg) => (
      <ImgThing key={thg.id} map={map} thing={thg} />
    )) }
  </>;
});
