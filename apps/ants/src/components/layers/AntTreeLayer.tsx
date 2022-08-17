import { styled } from '@mui/material/styles';
import { useObservableState } from 'observable-hooks';
import { FC } from 'react';
import { debounceTime, map } from 'rxjs';

import { AntWithTree, TreeNode } from '../../ants';
import { Map } from '../../maps';
import { IVector } from '../../math2d';
import { useMapParameters } from '../MapLayers';

// Types
export interface AntTreeLayerProps {
  ant: AntWithTree;
}

interface LayerProps {
  h: number;
  w: number;
  s: number;
}

// Styles
const Layer = styled('svg', { skipSx: true })<LayerProps>((props) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: props.w * props.s,
  height: props.h * props.s,
  zIndex: 10,
  pointerEvents: 'none',
}));

// Utils
function generatePath(map: Map, node: TreeNode): string {
  // Path
  let path = `L ${node.pos.x - map.bbox.l + 0.5} ${node.pos.y - map.bbox.t + 0.5}`;

  for (const n of node.children) {
    const p = generatePath(map, n);

    if (p) {
      path += `${p} M ${node.pos.x - map.bbox.l + 0.5} ${node.pos.y - map.bbox.t + 0.5}`;
    }
  }

  return path;
}

// Component
export const AntTreeLayer: FC<AntTreeLayerProps> = (props) => {
  const { ant } = props;

  // Context
  const { tileSize } = useMapParameters();

  // State
  const [paths] = useObservableState(() => ant.tree.version$.pipe(
    debounceTime(50),
    map(() => {
      const paths: [IVector, string][] = [];

      for (const root of ant.tree.roots()) {
        // Compute path
        const path = generatePath(ant.map, root).replace(/^L/, 'M');

        if (path.indexOf('L') !== -1) {
          paths.push([root.pos, path]);
        }
      }

      return paths;
    })
  ), []);

  // Render
  return (
    <Layer
      w={ant.map.bbox.w + 1} h={ant.map.bbox.h + 1} s={tileSize}
      viewBox={`0 0 ${ant.map.bbox.w + 1} ${ant.map.bbox.h + 1}`}
    >
      { paths.map(([root, path]) => (
        <path
          key={root.x + ':' + root.y}
          d={path}
          fill="transparent"
          stroke={ant.color.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".1"
          opacity={ant.color.opacity}
        />
      ))}
    </Layer>
  );
};
