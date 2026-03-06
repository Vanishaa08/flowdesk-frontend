import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchIssues,
  fetchIssue,
  createNewIssue,
  updateExistingIssue,
  updateStatus,
  removeIssue,
  postComment
} from '../../services/issueService'

// ─── Async Thunks ───
export const getIssues = createAsyncThunk('issues/getAll',
  async ({ projectId, filters }, thunkAPI) => {
    try {
      return await fetchIssues(projectId, filters)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch issues')
    }
  }
)

export const getIssue = createAsyncThunk('issues/getOne',
  async ({ projectId, issueId }, thunkAPI) => {
    try {
      return await fetchIssue(projectId, issueId)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch issue')
    }
  }
)

export const createIssue = createAsyncThunk('issues/create',
  async ({ projectId, issueData }, thunkAPI) => {
    try {
      return await createNewIssue(projectId, issueData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create issue')
    }
  }
)

export const updateIssue = createAsyncThunk('issues/update',
  async ({ projectId, issueId, issueData }, thunkAPI) => {
    try {
      return await updateExistingIssue(projectId, issueId, issueData)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update issue')
    }
  }
)

export const moveIssue = createAsyncThunk('issues/move',
  async ({ projectId, issueId, status, order }, thunkAPI) => {
    try {
      return await updateStatus(projectId, issueId, status, order)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to move issue')
    }
  }
)

export const deleteIssue = createAsyncThunk('issues/delete',
  async ({ projectId, issueId }, thunkAPI) => {
    try {
      await removeIssue(projectId, issueId)
      return issueId
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete issue')
    }
  }
)

export const addComment = createAsyncThunk('issues/addComment',
  async ({ projectId, issueId, text }, thunkAPI) => {
    try {
      return await postComment(projectId, issueId, text)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add comment')
    }
  }
)

// ─── Slice ───
const issueSlice = createSlice({
  name: 'issues',
  initialState: {
    issues: [],
    currentIssue: null,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    clearCurrentIssue: (state) => { state.currentIssue = null },
    resetIssueState: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    // Optimistic update for Kanban drag and drop
    moveIssueOptimistic: (state, action) => {
      const { issueId, newStatus } = action.payload
      const issue = state.issues.find(i => i._id === issueId)
      if (issue) issue.status = newStatus
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getIssues.pending, (state) => { state.isLoading = true })
      .addCase(getIssues.fulfilled, (state, action) => {
        state.isLoading = false
        state.issues = action.payload.issues
      })
      .addCase(getIssues.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get One
      .addCase(getIssue.fulfilled, (state, action) => {
        state.currentIssue = action.payload.issue
      })
      // Create
      .addCase(createIssue.fulfilled, (state, action) => {
        state.issues.unshift(action.payload.issue)
      })
      // Update
      .addCase(updateIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(i => i._id === action.payload.issue._id)
        if (index !== -1) state.issues[index] = action.payload.issue
        if (state.currentIssue?._id === action.payload.issue._id) {
          state.currentIssue = action.payload.issue
        }
      })
      // Move (Kanban)
      .addCase(moveIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(i => i._id === action.payload.issue._id)
        if (index !== -1) state.issues[index] = action.payload.issue
      })
      // Delete
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter(i => i._id !== action.payload)
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentIssue) {
          state.currentIssue.comments.push(action.payload.comment)
        }
      })
  }
})

export const { clearCurrentIssue, resetIssueState, moveIssueOptimistic } = issueSlice.actions
export default issueSlice.reducer