import { rect } from '@jujulego/2d-maths';
import { UniformGenerator } from '@ants/world';
import { FC, useEffect } from 'react';

import { worldClient } from './world-client';
import { BiomeLayer } from './layers/BiomeLayer';

// Constant
const AREA = rect({ x: 0, y: 0 }, { dx: 15, dy: 10 });

// Utils
const generator = new UniformGenerator(worldClient);

// Component
export const App: FC = () => {
  // Effects
  useEffect(() => void (async () => {
    await generator.run({ world: 'test', bbox: AREA }, { biome: 'grass' });
    await generator.run({ world: 'test', bbox: rect({ x: 5, y: 2 }, { dx: 5, dy: 5 }) }, { biome: 'rock' });
    await generator.run({ world: 'test', bbox: rect({ x: 3, y: 6 }, { dx: 9, dy: 2 }) }, { biome: 'sand' });
  })(), []);

  // Render
  return (
    <BiomeLayer world="test" area={AREA} />
  );
};
