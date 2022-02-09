import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl, FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BFSAnt, DFSAnt, SmartAnt, StupidAnt } from '../../ants';
import { ANT_COLORS, AntColorName } from '../../ants/colors';
import { IVector } from '../../math2d';

import { useMap } from '../MapLayers';

// Types
export interface CreateAntDialogProps {
  open: boolean;
  onClose: () => void;
}

interface AntFormState {
  name: string;
  color: AntColorName;
  position: IVector;
  algorithm: keyof typeof ALGORITHMS | null;
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
  const map = useMap();

  // Form
  const { control } = useForm<AntFormState>({
    mode: 'onChange',
    defaultValues: {
      color: 'blue',
      algorithm: null,
    }
  });

  // Render
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a new ant</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={2} mt={0}>
          <Grid item>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Name" autoFocus fullWidth required value={field.value}
                  error={!!fieldState.error} helperText={fieldState.error?.message}
                  inputRef={field.ref}
                  onBlur={field.onBlur} onChange={field.onChange}
                />
              )}
            />
          </Grid>
          <Grid item>
              <Controller
                name="color"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth required>
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
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs>
              <Controller
                name="position.x"
                control={control}
                defaultValue={map?.bbox?.l}
                rules={{
                  required: true,
                  min: { value: map?.bbox?.l ?? 0, message: 'Out of the map' },
                  max: { value: map?.bbox?.r ?? 0, message: 'Out of the map' },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Position x" fullWidth type="number" required value={field.value}
                    error={!!fieldState.error} helperText={fieldState.error?.message}
                    inputRef={field.ref} inputProps={{ min: map?.bbox?.l, max: map?.bbox?.r }}
                    onBlur={field.onBlur} onChange={field.onChange}
                  />
                )}
              />
            </Grid>
            <Grid item xs>
              <Controller
                name="position.y"
                control={control}
                defaultValue={map?.bbox?.t}
                rules={{
                  required: true,
                  min: { value: map?.bbox?.t ?? 0, message: 'Out of the map' },
                  max: { value: map?.bbox?.b ?? 0, message: 'Out of the map' },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Position y" fullWidth type="number" required value={field.value}
                    error={!!fieldState.error} helperText={fieldState.error?.message}
                    inputRef={field.ref} inputProps={{ min: map?.bbox?.t, max: map?.bbox?.b }}
                    onBlur={field.onBlur} onChange={field.onChange}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Controller
              name="algorithm"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth required>
                  <InputLabel>Algorithm</InputLabel>
                  <Select label="Algorithm" {...field}>
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
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
