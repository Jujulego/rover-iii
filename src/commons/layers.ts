import BlurOnIcon from '@mui/icons-material/BlurOn';
import HistoryIcon from '@mui/icons-material/History';
import ParkIcon from '@mui/icons-material/Park';
import { ComponentType, createContext } from 'react';

// Types
export type LayerKind = 'fog' | 'history' | 'tree';
export type LayersState = Record<LayerKind, boolean>;

export interface LayerMetadata {
  label: string;
  icon: ComponentType;
}

// Constants
export const LAYERS_METADATA: Record<LayerKind, LayerMetadata> = {
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
