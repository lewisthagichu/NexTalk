import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messagesService from './messagesService';

const initialState = {
  messages: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  serverMessage: '',
};

// Create/send new message
export const createMessage = createAsyncThunk(
  'messages/create',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return messagesService.createMessage(messageData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create/send new file
export const createFile = createAsyncThunk(
  'files/create',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return messagesService.createFile(messageData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all messages for selected user
export const getMessages = createAsyncThunk(
  'messages/getAll',
  async (selectedUserId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return messagesService.getMessages(selectedUserId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.serverMessage = action.payload;
      })
      .addCase(createFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages.push(action.payload);
      })
      .addCase(createFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.serverMessage = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.serverMessage = action.payload;
      });
  },
});

export const { reset } = messagesSlice.actions;
export default messagesSlice.reducer;
