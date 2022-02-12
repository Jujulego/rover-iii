import { FC, useCallback, useEffect, useState } from 'react';

import { Thing } from './ants';
import { CellularGenerator } from './generators';
import { Map } from './maps';
import { IVector, Rect, Vector } from './math2d';

import { AntLayers } from './components/AntLayers';
import { AntLayersStore } from './components/AntLayersStore';
import { LayerBar } from './components/bar/LayerBar';
import { LayerStack } from './components/LayerStack';
import { MapLayers } from './components/MapLayers';
import { BiomeLayer } from './components/layers/BiomeLayer';
import { ThingLayer } from './components/layers/ThingsLayer';

// Constants
const target = Thing.createTarget(new Vector({ x: 1, y: 8 }));

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>(new Map('map', new Rect(0, 0, 19, 39)));

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    target.position = new Vector(pos);
  }, []);

  // Effects
  useEffect(() => void (async () => {
    const start = performance.now();
    const gen = new CellularGenerator();
    await gen.generate(map, {
      biomes: {
        water: 3,
        grass: 4,
        sand: 3,
      },
      seed: 'tata',
      iterations: 4,
      outBiome: 'water'
    });
    console.log(`map generation took ${performance.now() - start}ms`);

    // const ants = [
    //   new SmartAnt('Smart I', map, 'pink', new Vector({ x: 5, y: 15 })),
    //   new SmartAnt('Smart II', map, 'blue', new Vector({ x: 31, y: 1 })),
    // ];

    setMap(map);
  })(), [map]);

  // Render
  return (
    <MapLayers map={map} target={target} tileSize={32}>
      <AntLayersStore>
        <LayerBar />
        <LayerStack>
          <BiomeLayer onTileClick={handleTileClick} />
          <AntLayers />
          <ThingLayer things={[target]} />
        </LayerStack>
      </AntLayersStore>
    </MapLayers>
  );
};
