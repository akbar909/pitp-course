import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import predictionReducer from './predictionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    prediction: predictionReducer,
  },
});