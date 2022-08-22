import { IVector, Rect, Vector } from '@ants/maths';
import { FC, useCallback, useEffect, useState } from 'react';

import { Thing } from './ants';
import { CellularGenerator } from './generators';
import { Map, mapRepository } from './maps';

import { AntLayers } from './components/AntLayers';
import { AntLayersStore } from './components/AntLayersStore';
import { AutoCreateAnts } from './components/AutoCreateAnts';
import { LayerBar } from './components/bar/LayerBar';
import { LayerStack } from './components/LayerStack';
import { MapLayers } from './components/MapLayers';
import { BiomeLayer } from './components/layers/BiomeLayer';
import { InteractiveLayer } from './components/layers/InteractLayer';
import { ThingLayer } from './components/layers/ThingsLayer';

// Constants
const MAP_NAME = 'map';
const MAP_BBOX = new Rect(0, 0, 19, 39);
const target = Thing.createTarget(new Vector({ x: 1, y: 8 }));

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>();

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    target.position = new Vector(pos);
  }, []);

  // Effects
  useEffect(() => void (async () => {
    setMap(await mapRepository.getOrGenerate(MAP_NAME, MAP_BBOX, new CellularGenerator(), {
      biomes: {
        water: 3,
        grass: 4,
        sand: 3,
      },
      seed: 'tata',
      iterations: 4,
      outBiome: 'water'
    }));
  })(), []);

  // Render
  return (
    <MapLayers map={map} target={target} tileSize={32}>
      <AutoCreateAnts />
      <AntLayersStore>
        <LayerBar />
        <LayerStack>
          <BiomeLayer />
          <AntLayers />
          <ThingLayer things={[target]} />
          <InteractiveLayer onTileClick={handleTileClick} />
        </LayerStack>
      </AntLayersStore>
    </MapLayers>
  );
};
