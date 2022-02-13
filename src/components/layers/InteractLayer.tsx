import { styled } from '@mui/material/styles';
import { FC, MouseEvent, useCallback } from 'react';

import { Rect, Vector } from '../../math2d';

import { useMapParameters } from '../MapLayers';

// Props
export interface InteractiveLayerProps {
  onTileClick?: (pos: Vector) => void;
}

// Styles
const Layer = styled('div', { skipSx: true })({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  zIndex: 100,
});

// Component
export const InteractiveLayer: FC<InteractiveLayerProps> = ((props) => {
  const { onTileClick } = props;

  // Context
  const { tileSize } = useMapParameters();

  // Callbacks
  const handleClick = useCallback((evt: MouseEvent<HTMLDivElement>) => {
    if (!onTileClick) return;

    let pos = Vector.fromHolder('client', evt);
    let el: HTMLElement | null = evt.currentTarget;

    while (el) {
      pos = pos.sub(Rect.fromHolder('offset', el).tl);
      el = el.offsetParent as HTMLElement | null;
    }

    onTileClick(pos.div(tileSize).floor());
  }, [onTileClick, tileSize]);

  // Render
  return <Layer onClick={handleClick} />;
});
