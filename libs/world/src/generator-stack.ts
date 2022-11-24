import { EventSource } from '@jujulego/event-tree';

import {
  CellularGenerator, GeneratorProgressEvent,
  RandomGenerator,
  RandomGeneratorOpts, TileGenerator,
  TileGeneratorOpts, UniformGenerator,
  UniformGeneratorOpts
} from './generators';
import { WorldClient } from './world-client';

// Types
export interface IStackStep<N extends string, O extends TileGeneratorOpts = TileGeneratorOpts> {
  readonly generator: N;
  readonly opts: Omit<O, 'base'>;
}

export type CellularStep = IStackStep<'cellular'>;
export type RandomStep = IStackStep<'random', RandomGeneratorOpts>;
export type UniformStep = IStackStep<'uniform', UniformGeneratorOpts>;

export type StackStep = CellularStep | RandomStep | UniformStep;

export interface GeneratorStackConfig {
  readonly steps: StackStep[];
}

export interface StackProgressEvent {
  // global level
  readonly generator: string;
  readonly step: number;
  readonly progress: number;

  readonly generatorEvent: GeneratorProgressEvent;
}

export type GeneratorStackEventMap = {
  progress: StackProgressEvent;
};

// Class
export class GeneratorStack extends EventSource<GeneratorStackEventMap> {
  // Constructor
  constructor(
    readonly client: WorldClient,
    readonly config: GeneratorStackConfig
  ) {
    super();
  }

  // Methods
  private _createGenerator(generator: StackStep['generator']): TileGenerator<TileGeneratorOpts> {
    switch (generator) {
      case 'cellular':
        return new CellularGenerator(this.client);

      case 'random':
        return new RandomGenerator(this.client);

      case 'uniform':
        return new UniformGenerator(this.client);
    }
  }

  async run(world: string): Promise<void> {
    for (let i = 0; i < this.config.steps.length; i++){
      const step = this.config.steps[i];

      // Run step
      const gen = this._createGenerator(step.generator);

      gen.subscribe('progress', (event) => {
        this.emit('progress', {
          generator: step.generator,
          step: i,
          progress: (i + event.progress) / this.config.steps.length,

          generatorEvent: event,
        });
      });

      await gen.run({ world, version: i }, {
        ...step.opts,
        base: { world, version: i - 1 },
      });
    }
  }
}
