import { Box } from '@mui/material';
import { FC, useMemo } from 'react';

import { TNode, TreeMixin } from '../../ants';
import { Map } from '../../maps';
import { Vector } from '../../math2d';

// Types
export interface ImgTreeLayerProps {
  ant: TreeMixin;
  map: Map;
  from: Vector;
}

// Utils
function generatePath(ant: TreeMixin, node: TNode): string {
  // Path
  let path = `L ${node.pos.x - ant.map.bbox.l + 0.5} ${node.pos.y - ant.map.bbox.t + 0.5}`;

  for (const n of ant.getChildren(node)) {
    const p = generatePath(ant, n);

    if (p) {
      path += `${p} M ${node.pos.x - ant.map.bbox.l + 0.5} ${node.pos.y - ant.map.bbox.t + 0.5}`;
    }
  }

  return path;
}

// Component
export const ImgTreeLayer: FC<ImgTreeLayerProps> = (props) => {
  const { ant, map, from } = props;

  // Memos
  const path = useMemo(() => {
    const node = ant.getNode(from);

    return node ? generatePath(ant, node).replace(/^L/, 'M') : '';
  }, [ant, ant.treeVersion, from]);

  // Render
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${map.bbox.w + 1} ${map.bbox.h + 1}`}

      width="100%"
      height="100%"
      gridColumn={`1 / ${map.bbox.w + 2}`}
      gridRow={`1 / ${map.bbox.h + 2}`}
      pointerEvents="none"
    >
      <path
        d={path}
        fill="transparent"
        stroke={ant.color.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".1"
        opacity=".33"
      />
    </Box>
  );
};
