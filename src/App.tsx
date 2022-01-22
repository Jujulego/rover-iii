import { useInterval } from '@jujulego/alma-utils';
import { FC, useCallback, useEffect, useState } from 'react';

import { SmartAnt, Thing } from './ants';
import { cellularMap, Map } from './maps';
import { IVector, Vector } from './math2d';

import { LayerGrid } from './layers/LayerGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { HistoryLayer } from './layers/HistoryLayer';
import { TreeLayer } from './layers/TreeLayer';
import { FogLayer } from './layers/FogLayer';
import { Box } from '@mui/material';

// Component
export const App: FC = () => {
  // State
  const [map, setMap] = useState<Map>();
  const [ant, setAnt] = useState<SmartAnt>();
  const [target,] = useState(new Vector({ x: 20, y: 15 }));

  // Callback
  const handleTileClick = useCallback((pos: IVector) => {
    if (ant) ant.position = new Vector(pos);
  }, [ant]);

  // Effects
  useEffect(() => void (async () => {
    const map = await cellularMap(
      'perceval',
      { w: 40, h: 20 },
      { water: 3, grass: 4, sand: 3 },
      { seed: 'perceval', iterations: 5, outBiome: 'water' }
    );

    const ant = new SmartAnt(map, 'blue', new Vector({ x: 5, y: 15 }));

    setMap(map);
    setAnt(ant);
  })(), []);

  // Render
  useInterval(1000, () => {
    ant?.step(target);
  });

  return (
    <Box component="main" display="flex" height="100vh">
      {/*<LayerBar />*/}
      <Box flex={1} overflow="auto">
        { map && (
          <LayerGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { ant && (
              <>
                <FogLayer ant={ant} map={map} />
                <TreeLayer ant={ant} map={map} />
                <HistoryLayer ant={ant} map={map} limit={100} />
                <ImgThingLayer
                  map={map}
                  things={[
                    Thing.createTarget(target),
                    ant
                  ]}
                />
              </>
            ) }
          </LayerGrid>
        ) }
      </Box>
    </Box>
  );
};
