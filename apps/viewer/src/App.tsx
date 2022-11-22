import { rect } from '@jujulego/2d-maths';
import { RandomGenerator } from '@ants/world';
import { FC, useEffect, useState } from 'react';

import { worldClient } from './world-client';
import { BiomeLayer } from './layers/BiomeLayer';

// Constant
const AREA = rect({ x: 0, y: 0 }, { dx: 40, dy: 20 });

// Utils
const generator = new RandomGenerator(worldClient);

// Component
export const App: FC = () => {
  // State
  const [n, setN] = useState(0);

  // Effects
  useEffect(() => void (async () => {
    await generator.run('test', {
      chunkSize: AREA.size.dx - 1,
      bbox: AREA,
      biomes: {
        water: 0.3,
        grass: 0.4,
        sand: 0.3
      }
    });
  })(), [n]);

  // Render
  return (
    <div onClick={() => setN((old) => old+1)}>
      <BiomeLayer world="test" area={AREA} />
    </div>
  );
};
