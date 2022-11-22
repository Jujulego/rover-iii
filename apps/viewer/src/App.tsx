import { rect } from '@jujulego/2d-maths';
import { RandomGenerator } from '@ants/world';
import { FC, useEffect, useRef, useState } from 'react';

import { worldClient } from './world-client';
import { BiomeLayer } from './layers/BiomeLayer';

// Constant
const AREA = rect({ x: 0, y: 0 }, { dx: 40, dy: 20 });

// Utils
const generator = new RandomGenerator(worldClient);

generator.subscribe('progress', (event) => console.log(event));

// Component
export const App: FC = () => {
  // State
  const [a, setA] = useState(0);
  const b = useRef(0);

  // Effects
  useEffect(() => void (async () => {
    if (a === 0) {
      return;
    }

    console.group(`Generation n°${a}`);
    console.time('random');
    await generator.run('test', {
      chunkSize: AREA.size.dx,
      bbox: AREA,
      biomes: {
        water: 0.3,
        grass: 0.4,
        sand: 0.3
      }
    });
    console.timeEnd('random');

    b.current = a;
    console.groupEnd();
  })(), [a]);

  // Render
  return (
    <div onClick={() => setA(b.current + 1)}>
      <BiomeLayer world="test" area={AREA} />
    </div>
  );
};
