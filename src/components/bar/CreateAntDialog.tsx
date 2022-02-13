import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem, PaperProps,
  Select,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { BFSAnt, DFSAnt, SmartAnt, StupidAnt } from '../../ants';
import { ANT_COLORS, AntColorName } from '../../ants/colors';
import { IVector, Vector } from '../../math2d';

import { useAnts, useMap } from '../MapLayers';
import { ControlledTextField } from '../utils/ControlledTextField';
import { ControlledFormControl } from '../utils/ControlledFormControl';

// Types
export interface CreateAntDialogProps {
  open: boolean;
  onClose: () => void;
}

interface AntFormState {
  name: string;
  color: AntColorName;
  position: IVector;
  algorithm: keyof typeof ALGORITHMS;
}

// Constants
const ALGORITHMS = {
  'BFS': BFSAnt,
  'DFS': DFSAnt,
  'Smart': SmartAnt,
  'Stupid': StupidAnt
};

// Styles
const Img = styled('img')(({ theme }) => ({
  width: 24,
  marginRight: theme.spacing(1),
  verticalAlign: 'middle',
}));

// Component
export const CreateAntDialog: FC<CreateAntDialogProps> = (props) => {
  const { open, onClose } = props;

  // Context
  const [,setAnts] = useAnts();
  const map = useMap();

  // Form
  const { control, handleSubmit, formState } = useForm<AntFormState>({
    mode: 'onChange',
    defaultValues: {
      color: 'blue',
    }
  });

  // Callbacks
  const createAnt = useCallback(({ name, algorithm, color, position }: AntFormState) => {
    if (!map) return;

    // Create ant
    const ant = new ALGORITHMS[algorithm](name, map, color, new Vector(position.x, position.y));
    setAnts((old) => [...old, ant]);
    onClose();
  }, [map, setAnts, onClose]);

  // Render
  return (
    <Dialog
      open={open} onClose={onClose}
      fullWidth maxWidth="sm"
      PaperProps={{
        component: 'form', onSubmit: handleSubmit(createAnt)
      } as PaperProps<'div'>}
    >
      <DialogTitle>Create a new ant</DialogTitle>
      <DialogContent
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: 'auto',
          gap: 2,
        }}
      >
        <ControlledTextField
          label="Name" autoFocus fullWidth
          name="name" control={control}
          rules={{
            required: true,
          }}
          sx={{
            gridColumn: 'span 2 / span 2',
            mt: 1
          }}
        />

        <ControlledFormControl
          label="Color"
          name="color" control={control}
          rules={{ required: true }}
          sx={{ gridColumn: 'span 2 / span 2' }}
        >
          <Select label="Color">
            { Object.values(ANT_COLORS).map(({ name, texture }) => (
              <MenuItem key={name} value={name}>
                <Img alt={name} src={texture.toString()} />
                <Typography component="span" sx={{ textTransform: 'capitalize' }}>{ name }</Typography>
              </MenuItem>
            )) }
          </Select>
        </ControlledFormControl>

        <ControlledTextField
          label="Position x" fullWidth type="number"
          name="position.x" control={control} defaultValue={0}
          rules={{
            required: true,
            min: map && { value: map.bbox.l, message: 'Out of the map' },
            max: map && { value: map.bbox.r, message: 'Out of the map' },
          }}
          transform={{
            fromInput: (val: string) => parseInt(val),
            toInput: (val: number) => val.toString()
          }}
        />

        <ControlledTextField
          label="Position y" fullWidth type="number"
          name="position.y" control={control} defaultValue={0}
          rules={{
            required: true,
            min: map && { value: map.bbox.t, message: 'Out of the map' },
            max: map && { value: map.bbox.b, message: 'Out of the map' },
          }}
          transform={{
            fromInput: (val: string) => parseInt(val),
            toInput: (val: number) => val.toString()
          }}
        />

        <ControlledFormControl
          label="Algorithm"
          name="algorithm" control={control}
          rules={{ required: true }}
          sx={{ gridColumn: 'span 2 / span 2' }}
        >
          <Select label="Algorithm">
            { Object.keys(ALGORITHMS).map((alg) => (
              <MenuItem key={alg} value={alg}>{ alg }</MenuItem>
            )) }
          </Select>
        </ControlledFormControl>
      </DialogContent>
      <DialogActions>
        <Button type="reset" color="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={!formState.isValid}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
