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

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve({
          latitude: null,
          longitude: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
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
    
    const location = await getCurrentLocation();
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(decodedUser));
    localStorage.setItem('userLocation', JSON.stringify(location));
    
    return {
      user: decodedUser,
      accessToken: token,
      location: location,
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
      location: localStorage.getItem('userLocation')
        ? JSON.parse(localStorage.getItem('userLocation'))
        : { latitude: null, longitude: null },
    },
    settings: {},
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
        location: { latitude: null, longitude: null },
      };
      state.settings = {};
    },
    updateLocation(state, action) {
      state.current.location = action.payload;
      localStorage.setItem('userLocation', JSON.stringify(action.payload));
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

export const { logout, updateLocation } = userSlice.actions;
export default userSlice.reducer;