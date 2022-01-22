import { useInterval } from '@jujulego/alma-utils';
import { FC, useCallback, useEffect, useState } from 'react';

import { SmartAnt, Thing } from './ants';
import { cellularMap, Map } from './maps';
import { IVector, Vector } from './math2d';

import { ImgGrid } from './layers/img/ImgGrid';
import { ImgMapLayer } from './layers/img/ImgMapLayer';
import { ImgThingLayer } from './layers/img/ImgThingLayer';
import { ImgHistoryLayer } from './layers/img/ImgHistoryLayer';
import { ImgTreeLayer } from './layers/img/ImgTreeLayer';
import { ImgFogLayer } from './layers/img/ImgFogLayer';
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
  useInterval(500, () => {
    ant?.step(target);
  });

  return (
    <Box component="main" display="flex" height="100vh">
      {/*<LayerBar />*/}
      <Box flex={1} overflow="auto">
        { map && (
          <ImgGrid tileSize={32}>
            <ImgMapLayer map={map} onTileClick={handleTileClick} />
            { ant && (
              <>
                <ImgFogLayer ant={ant} map={map} />
                {/*<ImgTreeLayer ant={ant} map={map} />*/}
                <ImgHistoryLayer ant={ant} map={map} limit={100} />
                <ImgThingLayer
                  map={map}
                  things={[
                    Thing.createTarget(target),
                    ant
                  ]}
                />
              </>
            ) }
          </ImgGrid>
        ) }
      </Box>
    </Box>
  );
};
