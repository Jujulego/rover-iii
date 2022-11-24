import { rect } from '@jujulego/2d-maths';
import { GeneratorStack, GeneratorStackConfig } from '@ants/world';
import { Button, Grid } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import { worldClient } from './world-client';
import { BiomeLayer } from './layers/BiomeLayer';

// Constant
const WORLD = 'test';
// const AREA = rect({ x: 0, y: 0 }, { dx: 3, dy: 3 });
const AREA = rect({ x: 0, y: 0 }, { dx: 40, dy: 20 });
const EXPA = rect(AREA.bl.add({ dx: -1, dy: -1 }), AREA.size.add({ dx: 2, dy: 2 }));
const SEED = 'tata';

const STACK: GeneratorStackConfig = {
  steps: [
    {
      generator: 'uniform',
      opts: {
        bbox: EXPA,
        biome: 'water',
      }
    },
    {
      generator: 'random',
      opts: {
        bbox: AREA,
        seed: SEED,
        biomes: {
          water: 0.3,
          grass: 0.4,
          sand: 0.3,
        }
      }
    },
    {
      generator: 'cellular',
      opts: {
        bbox: AREA,
      }
    },
    {
      generator: 'cellular',
      opts: {
        bbox: AREA,
      }
    },
    {
      generator: 'cellular',
      opts: {
        bbox: AREA,
      }
    },
    {
      generator: 'cellular',
      opts: {
        bbox: AREA,
      }
    }
  ]
};

// Component
export const App: FC = () => {
  // State
  const [a, setA] = useState(0);
  const b = useRef(0);

  const [version, setVersion] = useState(0);

  // Effects
  useEffect(() => void (async () => {
    if (a === 0) return;

    console.group(`Generation n°${a}`);
    console.time('generation');

    const stack = new GeneratorStack(worldClient, STACK);
    stack.subscribe('progress', (event) => console.log(`#${event.step} ${event.generator} ${(event.progress * 100).toFixed(2)}%`));

    await stack.run(WORLD);

    b.current = a;

    console.timeEnd('generation');
    console.groupEnd();
  })(), [a]);

  useEffect(() => {
    setA(1);
  }, []);

  // Render
  return (
    <Grid container columns={1}>
      <Grid item onClick={() => setA(b.current + 1)}>
        <BiomeLayer world={{ world: WORLD, version }} area={EXPA} />
      </Grid>
      <Grid container item>
        <Grid item>
          <Button disabled={version === 0} onClick={() => setVersion((old) => old - 1)}>
            prev
          </Button>
        </Grid>
        <Grid item>
          <Button disabled={version === (STACK.steps.length - 1)} onClick={() => setVersion((old) => old + 1)}>
            next
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
