import { DStarAnt } from './DStarAnt';

// Class
export class SmartAnt extends DStarAnt {
  // Methods
  protected worker() {
    return new Worker(/* webpackChunkName: "smart.worker" */ new URL('./SmartAnt.worker.ts', import.meta.url));
  }
}
