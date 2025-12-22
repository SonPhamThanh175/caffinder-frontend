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

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userApi.updateProfile(payload);
      
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra');
    }
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
      location: localStorage.getItem('userLocation')
        ? JSON.parse(localStorage.getItem('userLocation'))
        : null,
    },
    settings: {
      showLocationModal: false,
    },
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('userLocation');
      state.current = {
        user: null,
        accessToken: null,
        location: null,
      };
      state.settings = {
        showLocationModal: false,
      };
    },
    showLocationModal(state) {
      state.settings.showLocationModal = true;
    },
    hideLocationModal(state) {
      state.settings.showLocationModal = false;
    },
    updateLocation(state, action) {
      state.current.location = action.payload;
      localStorage.setItem('userLocation', JSON.stringify(action.payload));
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.current = action.payload;
        const savedLocation = localStorage.getItem('userLocation');
        if (!savedLocation) {
          state.settings.showLocationModal = true;
        }
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.current.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  logout, 
  showLocationModal, 
  hideLocationModal, 
  updateLocation,
  clearError 
} = userSlice.actions;

export default userSlice.reducer;