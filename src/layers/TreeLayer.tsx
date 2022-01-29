import { styled } from '@mui/material/styles';
import { useObservableState } from 'observable-hooks';
import { FC } from 'react';
import { exhaustMap } from 'rxjs';

import { AntWithTree, TreeNode } from '../ants';
import { Map } from '../maps';
import { IVector } from '../math2d';

// Types
export interface ImgTreeLayerProps {
  ant: AntWithTree;
}

interface LayerProps {
  h: number;
  w: number;
}

// Styles
const Layer = styled('svg', { skipSx: true })<LayerProps>((props) => ({
  width: '100%',
  height: '100%',
  gridColumn: `1 / ${props.w + 2}`,
  gridRow: `1 / ${props.h + 2}`,
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
export const TreeLayer: FC<ImgTreeLayerProps> = (props) => {
  const { ant } = props;

  // State
  const [paths] = useObservableState(() => ant.tree.version$.pipe(
    exhaustMap(async () => {
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
      w={ant.map.bbox.w} h={ant.map.bbox.h}
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
