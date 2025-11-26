import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const register = createAsyncThunk(
  'user/register',
  async (payload) => {
    const data = await userApi.register(payload);
    return data.userId;
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (payload) => {
    const data = await userApi.login(payload);
    
    const token = data.accessToken.split(' ')[1];
    
    const decodedUser = decodeToken(token);
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(decodedUser));
    
    return {
      user: decodedUser,
      accessToken: token,
    };
  }
);

export const update = createAsyncThunk(
  'user/update',
  async (payload) => {
    const { id, ...userData } = payload;
    const response = await userApi.update(id, userData);
    return response.data.userId; 
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: {
      user: localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')) 
        : null,
      accessToken: localStorage.getItem('accessToken') || null,
    },
    settings: {},
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      state.current = {
        user: null,
        accessToken: null,
      };
      state.settings = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;