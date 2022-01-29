import BlurOnIcon from '@mui/icons-material/BlurOn';
import HistoryIcon from '@mui/icons-material/History';
import ParkIcon from '@mui/icons-material/Park';

// Constants
export const LAYERS_METADATA = {
  fog: {
    label: 'Fog',
    icon: BlurOnIcon,
  },
  history: {
    label: 'History',
    icon: HistoryIcon,
  },
  tree: {
    label: 'Tree',
    icon: ParkIcon,
  },
};

// Types
export type LayersState = Record<keyof typeof LAYERS_METADATA, boolean>;
