import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'
import issueReducer from './slices/issueSlice'
import sprintReducer from './slices/sprintSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    issues: issueReducer,
    sprints: sprintReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store