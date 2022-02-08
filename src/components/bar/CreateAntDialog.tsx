import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { AntColorName } from '../../ants/colors';

// Types
export interface CreateAntDialogProps {
  open: boolean;
  onClose: () => void;
}

interface AntFormState {
  name: string;
  color: AntColorName;
}

// Component
export const CreateAntDialog: FC<CreateAntDialogProps> = (props) => {
  const { open, onClose } = props;

  // Form
  const { control } = useForm<AntFormState>({ defaultValues: { color: 'blue' } });

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
              render={({ field }) => <TextField label="Name" {...field} fullWidth />}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Controller
                name="color"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label="Color" {...field}>
                    <MenuItem value="blue">Blue</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                    <MenuItem value="pink">Pink</MenuItem>
                    <MenuItem value="white">White</MenuItem>
                    <MenuItem value="yellow">Yellow</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
