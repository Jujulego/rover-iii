import { rect } from '@jujulego/2d-maths';
import { CellularGenerator, RandomGenerator, UniformGenerator } from '@ants/world';
import { FC, useEffect, useRef, useState } from 'react';

import { worldClient } from './world-client';
import { BiomeLayer } from './layers/BiomeLayer';

// Constant
const WORLD = 'test';
const AREA = rect({ x: 0, y: 0 }, { dx: 40, dy: 20 });
const EXPA = rect(AREA.bl.add({ dx: -1, dy: -1 }), AREA.size.add({ dx: 2, dy: 2 }));
const SEED = 'tata';

// Utils
const cellular = new CellularGenerator(worldClient);
const random = new RandomGenerator(worldClient);
const uniform = new UniformGenerator(worldClient);

cellular.subscribe('progress', (event) => console.log(`cellular ${event.count} (${event.progress * 100}%)`));
random.subscribe('progress', (event) => console.log(`random ${event.count} (${event.progress * 100}%)`));
uniform.subscribe('progress', (event) => console.log(`uniform ${event.count} (${event.progress * 100}%)`));

// Component
export const App: FC = () => {
  // State
  const [a, setA] = useState(0);
  const b = useRef(0);

  // Effects
  useEffect(() => void (async () => {
    if (a === 0) return;

    console.group(`Generation n°${a}`);
    console.time('generation');

    console.groupCollapsed('uniform');
    console.time('uniform');
    await uniform.run(WORLD, {
      bbox: EXPA,
      // bbox: rect({ x: 0, y: 0 }, { dx: 5, dy: 5 }),
      version: 0,
      biome: 'water'
    });
    console.timeEnd('uniform');
    console.groupEnd();

    console.groupCollapsed('random');
    console.time('random');
    await random.run(WORLD, {
      bbox: AREA,
      // bbox: rect({ x: 1, y: 1 }, { dx: 3, dy: 3 }),
      version: 0,
      seed: SEED,
      biomes: {
        water: 0.3,
        grass: 0.4,
        sand: 0.3
      }
    });
    console.timeEnd('random');
    console.groupEnd();

    for (let v = 0; v < 4; v++) {
      console.groupCollapsed(`cellular ${v + 1}`);
      console.time('cellular');
      await cellular.run(WORLD, {
        // chunkSize: AREA.size.dx,
        bbox: AREA,
        // bbox: rect({ x: 1, y: 1 }, { dx: 3, dy: 3 }),
        version: v + 1,
        previous: v,
      });
      console.timeEnd('cellular');
      console.groupEnd();
    }

    b.current = a;
    console.timeEnd('generation');
    console.groupEnd();
  })(), [a]);

  useEffect(() => {
    setA(1);
  }, []);

  // Render
  return (
    <div onClick={() => setA(b.current + 1)}>
      <BiomeLayer world={WORLD} area={EXPA} />
    </div>
  );
};
