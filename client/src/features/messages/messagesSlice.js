import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  serverMessage: '',
};

// Create/send new message
const createMessage = createAsyncThunk(
  'message/create',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
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

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: {},
});

export const { reset } = messagesSlice.actions;
export default messagesSlice.reducer;
