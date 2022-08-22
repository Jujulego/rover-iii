import { IVector } from '@ants/maths';

import { BiomeName } from '../../biomes';
import { WorkerMessage } from '../../workers/messages';

// Types
export interface NetworkMessage<T extends string> extends WorkerMessage<T> {
  from?: string;
}

export interface AntNetworkMapUpdate extends NetworkMessage<'mapUpdate'> {
  type: 'mapUpdate';
  pos: IVector;
  biome: BiomeName;
}

export type AntNetworkMessage = AntNetworkMapUpdate;
export type Received<M extends NetworkMessage<string>> = M & Required<NetworkMessage<string>>;
