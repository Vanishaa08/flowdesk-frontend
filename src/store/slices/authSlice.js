import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { registerUser, loginUser, logoutUser } from '../../services/authService'

// Async thunks
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await registerUser(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await loginUser(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await logoutUser()
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed')
  }
})

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => { state.isLoading = true })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.token = action.payload.accessToken
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
        state.token = null
      })
      // Login
      .addCase(login.pending, (state) => { state.isLoading = true })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload.user
        state.token = action.payload.accessToken
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
        state.token = null
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer