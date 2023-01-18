// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getAllData = createAsyncThunk('appLeads/getAllData', async () => {
  const response = await axios.get('/api/projects')

  return response.data.data
})

export const getData = createAsyncThunk('appLeads/getData', async params => {
  const response = await axios.get('/api/projects', {params})
  
  return {
    params,
    data: response.data.data,
    totalPages: Math.ceil(response.data.total / params.limitCount)
  }
})

export const getLead = createAsyncThunk('appLeads/getLead', async id => {
  const response = await axios.get(`/api/projects/${id}`)
  return response.data
})

export const addLead = createAsyncThunk('appLeads/addLead', async (lead, { /*dispatch, getState*/ }) => {
  //await dispatch(getData(getState().leads.params))
  //await dispatch(getAllData())
  return lead
})
export const deleteLeadContact = createAsyncThunk('appLeads/deleteLeadContact', async (lead, { dispatch, getState }) => {
  await dispatch(getData(getState().leads.params))
  //await dispatch(getAllData())
  return lead
})
export const updateMeasurements = createAsyncThunk('appLeads/updateMeasurement', async (measurements, { dispatch, getState }) => {
  await axios.post('/api/manualmeasurements', measurements)
 // console.log(measurements)
  console.log(getState())
  await dispatch(getLead(getState().leads.selectedLead.id))
 
  return measurements
})
export const updateLead = createAsyncThunk('appLeads/updateLead', async (lead, { /*dispatch, getState*/ }) => {
  //await axios.post('/api/lead_update', lead)  
  console.log('updateLead', lead)
  return lead
})
export const getMaterials = createAsyncThunk('appLeads/getMaterials', async id => {
  const response = await axios.get(`/api/projects/${id}/materials`)
  return response.data
})
export const saveMaterials = createAsyncThunk('appLeads/updateMaterials', async (list, { /*dispatch, getState*/ }) => {
  //const response = await axios.put('/api/projects/${id}/materials', list) 
  //console.log(response) f
  return list
})
export const deleteMaterials = createAsyncThunk('appLeads/deleteMaterials', async (data, { /*dispatch, getState*/ }) => {
  await axios.post('/api/deletematerials', data)  
  return data
})
export const appLeadsSlice = createSlice({
  name: 'appLeads',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedLead: null,
    materialsList: null
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
      .addCase(getLead.fulfilled, (state, action) => {
        //console.log(action.payload)
        state.selectedLead = action.payload
      })
      .addCase(updateMeasurements.fulfilled, (state, action) => {
        //console.log(action.payload)
        Object.assign(state.selectedLead.measure, action.payload)
       })
      .addCase(saveMaterials.fulfilled, (state, action) => {
        state.selectedLead.materialsList = action.payload  
        state.materialsList = action.payload  
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.materialsList = action.payload  
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        //save the measurements and contacts
        const measurements = state.selectedLead.measure
        const contacts = state.selectedLead.contacts
        //const material = state.selectedLead.contacts
        //action.payload.material = measurements
        //action.payload.measure = measurements
        //action.payload.contacts = contacts
        console.log('action', action)
        const lead = {
          ...action.payload,
          measure:measurements,
          contacts
        }
        console.log('lead', lead)
        state.selectedLead = lead
        return state
      })
  }
})

export default appLeadsSlice.reducer
