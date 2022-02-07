import { Ant, hasKnowledge, hasTree } from '../ants';

import { FogLayer } from './FogLayer';
import { HistoryLayer } from './HistoryLayer';
import { TreeLayer } from './TreeLayer';
import { FC } from 'react';
import { useAntLayers } from './AntLayersCtx';

// Types
export interface AntLayersProps {
  ant: Ant;
}

// Component
export const AntLayers: FC<AntLayersProps> = ({ ant }) => {
  // Context
  const [layers,] = useAntLayers(ant);

  // Render
  return (
    <>
      { (layers.fog && hasKnowledge(ant)) && <FogLayer ant={ant} /> }
      { (layers.tree && hasTree(ant)) && <TreeLayer ant={ant} /> }
      {  layers.history && <HistoryLayer ant={ant} limit={100} /> }
    </>
  );
};
