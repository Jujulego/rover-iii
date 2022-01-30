import { DStarAnt } from './DStarAnt';

// Class
export class SmartAnt extends DStarAnt {
  // Attributes
  readonly worker = new Worker(/* webpackChunkName: "smart.worker" */ new URL('./SmartAnt.worker.ts', import.meta.url));
}
