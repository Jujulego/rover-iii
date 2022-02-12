import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  FormControl, FormHelperText,
  InputLabel,
  MenuItem, PaperProps,
  Select,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BFSAnt, DFSAnt, SmartAnt, StupidAnt } from '../../ants';
import { ANT_COLORS, AntColorName } from '../../ants/colors';
import { IVector, Vector } from '../../math2d';

import { useAnts, useMap } from '../MapLayers';
import { ControlledTextField } from '../utils/ControlledTextField';

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
    const ant = new ALGORITHMS[algorithm](name, map, color, new Vector(parseInt(position.x as unknown as string), parseInt(position.y as unknown as string)));
    setAnts((old) => [...old, ant]);
    onClose();
  }, [map, setAnts, onClose]);

  // Render
  return (
    <Dialog
      open={open} onClose={onClose}
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

        <Controller
          name="color"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <FormControl fullWidth required sx={{ gridColumn: 'span 2 / span 2' }}>
              <InputLabel>Color</InputLabel>
              <Select label="Color" {...field}>
                { Object.values(ANT_COLORS).map(({ name, texture }) => (
                  <MenuItem key={name} value={name}>
                    <Img alt={name} src={texture.toString()} />
                    <Typography component="span" sx={{ textTransform: 'capitalize' }}>{ name }</Typography>
                  </MenuItem>
                )) }
              </Select>
              { fieldState.error && (
                <FormHelperText error>{ fieldState.error.message }</FormHelperText>
              ) }
            </FormControl>
          )}
        />

        <ControlledTextField
          label="Position x" fullWidth type="number"
          name="position.x" control={control} defaultValue={0}
          rules={{
            required: true,
            min: map && { value: map.bbox.l, message: 'Out of the map' },
            max: map && { value: map.bbox.r, message: 'Out of the map' },
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
        />

        <Controller
          name="algorithm"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <FormControl fullWidth required sx={{ gridColumn: 'span 2 / span 2' }}>
              <InputLabel>Algorithm</InputLabel>
              <Select label="Algorithm" {...field} value={field.value ?? ''}>
                { Object.keys(ALGORITHMS).map((alg) => (
                  <MenuItem key={alg} value={alg}>{ alg }</MenuItem>
                )) }
              </Select>
              { fieldState.error && (
                <FormHelperText error>{ fieldState.error.message }</FormHelperText>
              ) }
            </FormControl>
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button type="reset" color="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={!formState.isValid}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
