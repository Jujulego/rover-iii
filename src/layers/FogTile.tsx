import { styled } from '@mui/material/styles';
import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import { FC } from 'react';

import { IVector, Vector } from '../math2d';
import { AntWithMemory } from '../ants';
import { filter, map, switchMap, withLatestFrom } from 'rxjs';

// Types
export interface FogData {
  detected?: boolean;
}

// Types
export interface ImgFogTileProps {
  pos: IVector;
  ant: AntWithMemory<FogData>;
}

interface TileProps {
  x: number;
  y: number;
}

// Styles
const Tile = styled('div', { skipSx: true })<TileProps>((props) => ({
  gridRow: props.y + 1,
  gridColumn: props.x + 1,

  background: 'white',
  opacity: 0.5,
  pointerEvents: 'none'
}));

// Component
export const FogTile: FC<ImgFogTileProps> = (props) => {
  const { ant } = props;

  // Observables
  const pos$ = useObservable(pluckFirst, [props.pos]);

  // State
  const [detected] = useObservableState(() => ant.memory.updates$.pipe(
    withLatestFrom(pos$),
    filter(([update, pos]) => new Vector(pos).equals(update[0])),
    map(([update]) => update[1]?.detected)
  ));

  // Render
  if (detected) return null;

  return (
    <Tile x={props.pos.x} y={props.pos.y} />
  );
};
