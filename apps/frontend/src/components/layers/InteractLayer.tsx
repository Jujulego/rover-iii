import { NULL_VECTOR, Rect, Vector } from '@ants/maths';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { FC, MouseEvent, useCallback, useState } from 'react';

import { useMapParameters } from '../MapLayers';
import { CreateAntDialog } from '../bar/CreateAntDialog';

// Props
export interface InteractiveLayerProps {
  onTileClick?: (pos: Vector) => void;
}

// Utils
function computeTile(evt: MouseEvent<HTMLDivElement>, tileSize: number): Vector {
  let pos = Vector.fromHolder('client', evt);
  let el: HTMLElement | null = evt.currentTarget;

  while (el) {
    pos = pos.sub(Rect.fromHolder('offset', el).tl);
    el = el.offsetParent as HTMLElement | null;
  }

  return pos.div(tileSize).floor();
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

  // State
  const [selected, setSelected] = useState<Vector>(NULL_VECTOR);
  const [ctxMenu, setCtxMenu] = useState<Vector>();
  const [creatingAnt, setCreatingAnt] = useState(false);

  // Callbacks
  const handleClick = useCallback((evt: MouseEvent<HTMLDivElement>) => {
    if (!onTileClick) return;

    onTileClick(computeTile(evt, tileSize));
  }, [onTileClick, tileSize]);

  const handleContextMenu = useCallback((evt: MouseEvent<HTMLDivElement>) => {
     evt.preventDefault();

     setSelected(computeTile(evt, tileSize));
     setCtxMenu((old) => old ? undefined : Vector.fromHolder('client', evt));
  }, [tileSize]);

  const handleCloseMenu = useCallback(() => {
    setCtxMenu(undefined);
  }, []);

  const handleCreateAnt = useCallback(() => {
    handleCloseMenu();
    setCreatingAnt(true);
  }, [handleCloseMenu]);

  // Render
  return (
    <>
      <Layer onClick={handleClick} onContextMenu={handleContextMenu} />
      <Menu
        open={!!ctxMenu} onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={ctxMenu && { top: ctxMenu.y, left: ctxMenu.x }}
        MenuListProps={{
          sx: { minWidth: 240 }
        }}
      >
        <MenuItem onClick={handleCreateAnt}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add new Ant" />
        </MenuItem>
      </Menu>
      <CreateAntDialog
        open={creatingAnt} onClose={() => setCreatingAnt(false)}
        defaults={{
          position: selected
        }}
      />
    </>
  );
});
