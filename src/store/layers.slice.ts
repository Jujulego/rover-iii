import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export type LayersKind = 'fog' | 'history' | 'tree';
export type LayersState = Partial<Record<LayersKind, boolean>>;

// Slice
export const layersSlice = createSlice({
  name: 'layers',
  initialState: {} as Partial<Record<string, LayersState>>,
  reducers: {
    setLayerForAnt(state, action: PayloadAction<{ kind: LayersKind, ant: string, value: boolean }>) {
      const { kind, ant, value } = action.payload;

      state[ant] = { ...state[ant], [kind]: value };
    },
    enableLayer(state, action: PayloadAction<{ kind: LayersKind, ant: string }>) {
      const { kind, ant } = action.payload;

      state[ant] = { ...state[ant], [kind]: true };
    },
    disableLayer(state, action: PayloadAction<{ kind: LayersKind, ant: string }>) {
      const { kind, ant } = action.payload;

      state[ant] = { ...state[ant], [kind]: false };
    },
  }
});

// Export
export const { setLayerForAnt, enableLayer, disableLayer } = layersSlice.actions;
export default layersSlice.reducer;
