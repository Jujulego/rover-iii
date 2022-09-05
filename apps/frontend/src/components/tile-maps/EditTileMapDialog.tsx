import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { PaperProps } from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';

import { TileMap, TileMapDTO } from '../../maps/tile-map.entity';
import { ControlledTextField } from '../utils/ControlledTextField';

// Types
export interface EditTileMapDialogProps {
  open: boolean;
  onClose: () => void;
}

// Component
export const EditTileMapDialog: FC<EditTileMapDialogProps> = (props) => {
  const { open, onClose } = props;

  // State
  const [saving, setSaving] = useState(false);

  // Form
  const { control, handleSubmit, formState } = useForm<TileMapDTO>({
    mode: 'onChange',
    defaultValues: {
      bbox: { t: 0, l: 0, b: 20, r: 20 }
    }
  });

  // Callbacks
  const saveTileMap = useCallback(async (data: TileMapDTO) => {
    setSaving(true);

    try {
      const map = await TileMap.create({}, data);
      TileMap.$list('all').data = [
        ...TileMap.$list('all').data,
        map,
      ];

      onClose();
    } finally {
      setSaving(true);
    }
  }, []);

  // Render
  return (
    <Dialog
      open={open} onClose={onClose}
      fullWidth maxWidth="sm"
      PaperProps={{
        component: 'form', onSubmit: handleSubmit(saveTileMap)
      } as PaperProps<'div'>}
    >
      <DialogTitle>Edit tile map</DialogTitle>
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

        <ControlledTextField
          label="Bounding box top" fullWidth type="number"
          name="bbox.t" control={control}
          rules={{
            required: true
          }}
          transform={{
            fromInput: (val: string) => parseInt(val),
            toInput: (val: number) => val.toString()
          }}
        />

        <ControlledTextField
          label="Bounding box left" fullWidth type="number"
          name="bbox.l" control={control}
          rules={{
            required: true
          }}
          transform={{
            fromInput: (val: string) => parseInt(val),
            toInput: (val: number) => val.toString()
          }}
        />

        <ControlledTextField
          label="Bounding box bottom" fullWidth type="number"
          name="bbox.b" control={control}
          rules={{
            required: true
          }}
          transform={{
            fromInput: (val: string) => parseInt(val),
            toInput: (val: number) => val.toString()
          }}
        />

        <ControlledTextField
          label="Bounding box right" fullWidth type="number"
          name="bbox.r" control={control}
          rules={{
            required: true
          }}
          transform={{
            fromInput: (val: string) => parseInt(val),
            toInput: (val: number) => val.toString()
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button type="reset" color="secondary" onClick={onClose}>Cancel</Button>
        <LoadingButton
          type="submit" variant="contained"
          loading={saving} loadingIndicator="Saving..."
          disabled={!formState.isValid}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
