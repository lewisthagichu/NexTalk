import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import messagesReducer from '../features/messages/messagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
  },
});
