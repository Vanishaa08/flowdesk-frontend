import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'
import issueReducer from './slices/issueSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    issues: issueReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store