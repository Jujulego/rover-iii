import type { CellularOptions } from './CellularGenerator.worker';
import { ParallelGenerator } from './ParallelGenerator';

// Class
export class CellularGenerator extends ParallelGenerator<CellularOptions> {
  // Methods
  protected worker(): Worker {
    return new Worker(new URL(/* webpackChunkName: "cellular.generator" */'./CellularGenerator.worker.ts', import.meta.url));
  }
}
