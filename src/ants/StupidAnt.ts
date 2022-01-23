import { ParallelAnt } from './ParallelAnt';

// Class
export class StupidAnt extends ParallelAnt {
  // Attributes
  readonly worker = new Worker(new URL('./StupidAnt.worker.ts', import.meta.url));
}
