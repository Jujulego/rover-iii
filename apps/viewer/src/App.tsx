import { FC, useEffect } from 'react';

import { worldClient } from './world-client';
import { BiomeLayer } from './layers/BiomeLayer';

// Component
export const App: FC = () => {
  // Effects
  useEffect(() => void (async () => {
    await worldClient.bulkPutTile('test', [
      { pos: { x: 0, y: 0 }, biome: 'grass' },
      { pos: { x: 1, y: 0 }, biome: 'grass' },
      { pos: { x: 1, y: 1 }, biome: 'grass' },
      { pos: { x: 0, y: 1 }, biome: 'grass' },
      { pos: { x: 2, y: 0 }, biome: 'grass' },
      { pos: { x: 2, y: 1 }, biome: 'grass' },
      { pos: { x: 2, y: 2 }, biome: 'grass' },
      { pos: { x: 1, y: 2 }, biome: 'grass' },
      { pos: { x: 0, y: 2 }, biome: 'grass' },
    ]);
  })(), []);

  // Render
  return (
    <BiomeLayer world="test" />
  );
};
