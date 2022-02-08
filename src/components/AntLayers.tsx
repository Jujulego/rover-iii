import { FC } from 'react';

import { Ant, hasKnowledge, hasTree } from '../ants';

import { useAntLayers } from './AntLayersStore';
import { useAnts } from './MapLayers';
import { AntFogLayer } from './layers/AntFogLayer';
import { AntTreeLayer } from './layers/AntTreeLayer';
import { AntHistoryLayer } from './layers/AntHistoryLayer';

// Types
export interface LayerProps {
  ant: Ant;
}

// Components
const AntLayer: FC<LayerProps> = ({ ant }) => {
  // Context
  const [layers,] = useAntLayers(ant);

  // Render
  return (
    <>
      { (layers.fog && hasKnowledge(ant)) && <AntFogLayer ant={ant} /> }
      { (layers.tree && hasTree(ant)) && <AntTreeLayer ant={ant} /> }
      {  layers.history && <AntHistoryLayer ant={ant} limit={100} /> }
    </>
  );
};

export const AntLayers: FC = () => {
  // Context
  const ants = useAnts();

  // Render
  return (
    <>
      { ants.map(ant => (
        <AntLayer key={ant.id} ant={ant} />
      )) }
    </>
  );
};
