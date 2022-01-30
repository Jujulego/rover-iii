import { Box } from '@mui/material';
import { useObservableState } from 'observable-hooks';
import { memo } from 'react';

import { Thing } from '../../ants';
import { Map } from '../../maps';
import { NULL_VECTOR } from '../../math2d';

// Types
export interface ImgThingProps {
  map: Map;
  thing: Thing;
}

// Component
export const ImgThing = memo<ImgThingProps>(function ImgThing(props) {
  const { map, thing } = props;

  // State
  const position = useObservableState(thing.position$, NULL_VECTOR);

  // Render
  return (
    <Box
      component="img"
      height="100%"
      width="100%"
      gridRow={position.y - map.bbox.t + 1}
      gridColumn={position.x - map.bbox.l + 1}
      zIndex={100}
      src={thing.image.toString()}
    />
  );
});
