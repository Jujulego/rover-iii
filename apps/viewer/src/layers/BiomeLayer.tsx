import { rect } from '@jujulego/2d-maths';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC } from 'react';

import { worldClient } from '../world-client';

// Types
export interface BiomeLayerProps {
  readonly world: string;
}

// Components
export const BiomeLayer: FC<BiomeLayerProps> = (props) => {
  // Load tiles
  const tiles = useLiveQuery(() => worldClient.loadTilesIn(props.world, rect({ x: 0, y: 0 }, { x: 2, y: 2 })), [props.world]);

  return (
    <code style={{ whiteSpace: 'pre' }}>
      { JSON.stringify(tiles, null, 2) }
    </code>
  );
};
