import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from './authSlice';

// Async thunks
export const makePrediction = createAsyncThunk(
  'prediction/make',
  async (predictionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/predict', predictionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getUserPredictions = createAsyncThunk(
  'prediction/getUserPredictions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/predictions');
      return response.data.predictions;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getStats = createAsyncThunk(
  'prediction/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: {
    predictions: [],
    currentPrediction: null,
    stats: {
      total_predictions: 0,
      performance_distribution: {},
      average_confidence: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPrediction: (state) => {
      state.currentPrediction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Make prediction
      .addCase(makePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makePrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPrediction = action.payload;
      })
      .addCase(makePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user predictions
      .addCase(getUserPredictions.fulfilled, (state, action) => {
        state.predictions = action.payload;
      })
      .addCase(getUserPredictions.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get stats
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPrediction, clearError } = predictionSlice.actions;
export default predictionSlice.reducer;