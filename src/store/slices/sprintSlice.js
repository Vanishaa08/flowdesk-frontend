import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchSprints,
  fetchSprint,
  createNewSprint,
  updateExistingSprint,
  startExistingSprint,
  completeExistingSprint,
  addIssueToExistingSprint,
  removeIssueFromExistingSprint,
  removeExistingSprint
} from '../../services/sprintService'

export const getSprints = createAsyncThunk('sprints/getAll',
  async (projectId, thunkAPI) => {
    try { return await fetchSprints(projectId) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sprints') }
  }
)

export const getSprint = createAsyncThunk('sprints/getOne',
  async ({ projectId, sprintId }, thunkAPI) => {
    try { return await fetchSprint(projectId, sprintId) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sprint') }
  }
)

export const createSprint = createAsyncThunk('sprints/create',
  async ({ projectId, sprintData }, thunkAPI) => {
    try { return await createNewSprint(projectId, sprintData) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create sprint') }
  }
)

export const updateSprint = createAsyncThunk('sprints/update',
  async ({ projectId, sprintId, sprintData }, thunkAPI) => {
    try { return await updateExistingSprint(projectId, sprintId, sprintData) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update sprint') }
  }
)

export const startSprint = createAsyncThunk('sprints/start',
  async ({ projectId, sprintId }, thunkAPI) => {
    try { return await startExistingSprint(projectId, sprintId) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to start sprint') }
  }
)

export const completeSprint = createAsyncThunk('sprints/complete',
  async ({ projectId, sprintId }, thunkAPI) => {
    try { return await completeExistingSprint(projectId, sprintId) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to complete sprint') }
  }
)

export const addIssueToSprint = createAsyncThunk('sprints/addIssue',
  async ({ projectId, sprintId, issueId }, thunkAPI) => {
    try { return await addIssueToExistingSprint(projectId, sprintId, issueId) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add issue') }
  }
)

export const removeIssueFromSprint = createAsyncThunk('sprints/removeIssue',
  async ({ projectId, sprintId, issueId }, thunkAPI) => {
    try { return await removeIssueFromExistingSprint(projectId, sprintId, issueId) }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove issue') }
  }
)

export const deleteSprint = createAsyncThunk('sprints/delete',
  async ({ projectId, sprintId }, thunkAPI) => {
    try { await removeExistingSprint(projectId, sprintId); return sprintId }
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete sprint') }
  }
)

const sprintSlice = createSlice({
  name: 'sprints',
  initialState: {
    sprints: [],
    currentSprint: null,
    activeSprint: null,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    clearCurrentSprint: (state) => { state.currentSprint = null },
    resetSprintState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSprints.pending, (state) => { state.isLoading = true })
      .addCase(getSprints.fulfilled, (state, action) => {
        state.isLoading = false
        state.sprints = action.payload.sprints
        state.activeSprint = action.payload.sprints.find(s => s.status === 'active') || null
      })
      .addCase(getSprints.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getSprint.fulfilled, (state, action) => {
        state.currentSprint = action.payload.sprint
      })
      .addCase(createSprint.fulfilled, (state, action) => {
        state.sprints.push(action.payload.sprint)
      })
      .addCase(updateSprint.fulfilled, (state, action) => {
        const index = state.sprints.findIndex(s => s._id === action.payload.sprint._id)
        if (index !== -1) state.sprints[index] = action.payload.sprint
      })
      .addCase(startSprint.fulfilled, (state, action) => {
        const index = state.sprints.findIndex(s => s._id === action.payload.sprint._id)
        if (index !== -1) state.sprints[index] = action.payload.sprint
        state.activeSprint = action.payload.sprint
      })
      .addCase(completeSprint.fulfilled, (state, action) => {
        const index = state.sprints.findIndex(s => s._id === action.payload.sprint._id)
        if (index !== -1) state.sprints[index] = action.payload.sprint
        state.activeSprint = null
      })
      .addCase(addIssueToSprint.fulfilled, (state, action) => {
        const index = state.sprints.findIndex(s => s._id === action.payload.sprint._id)
        if (index !== -1) state.sprints[index] = action.payload.sprint
      })
      .addCase(removeIssueFromSprint.fulfilled, (state, action) => {
        const index = state.sprints.findIndex(s => s._id === action.payload.sprint._id)
        if (index !== -1) state.sprints[index] = action.payload.sprint
      })
      .addCase(deleteSprint.fulfilled, (state, action) => {
        state.sprints = state.sprints.filter(s => s._id !== action.payload)
      })
  }
})

export const { clearCurrentSprint, resetSprintState } = sprintSlice.actions
export default sprintSlice.reducer