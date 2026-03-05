import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProjects,
  fetchProject,
  createNewProject,
  updateExistingProject,
  removeProject
} from '../../services/projectService'

// ─── Async Thunks ───
export const getProjects = createAsyncThunk('projects/getAll', async (_, thunkAPI) => {
  try {
    return await fetchProjects()
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch projects')
  }
})

export const getProject = createAsyncThunk('projects/getOne', async (id, thunkAPI) => {
  try {
    return await fetchProject(id)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch project')
  }
})

export const createProject = createAsyncThunk('projects/create', async (projectData, thunkAPI) => {
  try {
    return await createNewProject(projectData)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create project')
  }
})

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }, thunkAPI) => {
  try {
    return await updateExistingProject(id, data)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update project')
  }
})

export const deleteProject = createAsyncThunk('projects/delete', async (id, thunkAPI) => {
  try {
    await removeProject(id)
    return id
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete project')
  }
})

// ─── Slice ───
const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    clearCurrentProject: (state) => { state.currentProject = null },
    resetProjectState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getProjects.pending, (state) => { state.isLoading = true })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload.projects
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get One
      .addCase(getProject.pending, (state) => { state.isLoading = true })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload.project
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create
      .addCase(createProject.pending, (state) => { state.isLoading = true })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects.unshift(action.payload.project)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload.project._id)
        if (index !== -1) state.projects[index] = action.payload.project
        if (state.currentProject?._id === action.payload.project._id) {
          state.currentProject = action.payload.project
        }
      })
      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p._id !== action.payload)
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null
        }
      })
  }
})

export const { clearCurrentProject, resetProjectState } = projectSlice.actions
export default projectSlice.reducer