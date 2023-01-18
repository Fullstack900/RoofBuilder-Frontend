// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getData = createAsyncThunk('appUsers/getData', async params => {
  const response = await axios.get('/api/users', {params})
  return {
    params,
    data: response.data.data,
    totalPages: response.data.total
  }
})

export const getUser = createAsyncThunk('appUsers/getUser', async  sub  => {
  const response = await axios.get(`/api/test_get/${sub}`)
  return response.data
})

export const addUser = createAsyncThunk('appUsers/addUser', async (user, { dispatch, getState }) => {
  await axios.post('/api/users', user)
  await dispatch(getData(getState().users.params))
 // await dispatch(getAllData())
  return user
})
export const updateUser = createAsyncThunk('appUsers/updateUser', async (user, { /*dispatch, getState*/ }) => {
  await axios.post('/api/user_update', user)
  //await dispatch(getData(getState().users.params))
  //await dispatch(getAllData())
  return user
})


export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedUser: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload  
      })
  }
})

export default appUsersSlice.reducer
