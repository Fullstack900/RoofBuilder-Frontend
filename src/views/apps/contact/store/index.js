// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getAllData = createAsyncThunk('appContacts/getAllData', async () => {
  const response = await axios.get('/api/contacts')

  return response.data.data
})

export const getData = createAsyncThunk('appContacts/getData', async params => {
  const response = await axios.get('/api/contacts', {params})
  
  return {
    params,
    data: response.data.data,
    totalPages: Math.ceil(response.data.total / params.limitCount)
  }
})

export const getContact = createAsyncThunk('appContacts/getContact', async id => {
  const response = await axios.get(`/api/contacts/${id}`)
  return response.data
})

export const addContact = createAsyncThunk('appContacts/addContact', async (contact, { dispatch, getState }) => {
  await dispatch(getData(getState().contacts.params))
  //await dispatch(getAllData())
  return contact
})

export const updateContact = createAsyncThunk('appContacts/updateContact', async (contact, { /*dispatch, getState*/ }) => {
  await axios.post('/api/contacts_update', contact)
  //await dispatch(getData(getState().contacts.params))
  //await dispatch(getAllData())
  return contact
})
export const appContactsSlice = createSlice({
  name: 'appContacts',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedContact: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.selectedContact = action.payload
      })
  }
})

export default appContactsSlice.reducer
