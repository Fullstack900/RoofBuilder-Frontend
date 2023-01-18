// ** React Import
import { useState, useEffect} from 'react'
//import { useParams } from 'react-router-dom'

import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Row, Col, Button, Label, FormText, Form, Input, Modal, ModalBody, ModalHeader } from 'reactstrap'

// ** Store & Actions
import { useSelector,  useDispatch } from 'react-redux'
import axios from 'axios'
import * as yup from 'yup'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'
import { updateLead} from '../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTape } from '@fortawesome/free-solid-svg-icons'
import {convertUoM} from './calcs'
require('./styles.css')

const EditMeasurement = ({ open, toggleSidebar})  => {
  const store = useSelector(state => state.leads)
  const [showRidgeSat, setShowRidgeSat] = useState(false)
  const [showHipSat, setShowHipSat] = useState(false)
  const [showEaveSat, setShowEaveSat] = useState(false)
  const [showValleySat, setShowValleySat] = useState(false)
  const [showRakeSat, setShowRakeSat] = useState(false)
  //const [showAreaSat, setShowAreaSat] = useState(false)
  //const [showSteepSat, setShowSteepSat] = useState(false)

  const [showPipeBoot3, setShowPipeBoot3] = useState(false)
  const [showPipeBoot4, setShowPipeBoot4] = useState(false)
  const [showRidgeVent, setShowRidgeVent] = useState(false)
  const [showBoxVent, setShowBoxVent] = useState(false)

  const [showUpdate, setShowUpdate] = useState(false)

  const [selectedUom/*setSelectedUom*/] = useState({load:{m:'f', m2:'f2', ea:'ea'}, save:{f2:'m2', f:'m', ea:'ea'}, name:'ft'})

  const selectedLead = store.selectedLead
  const measurement = store.selectedLead.measurement
  /*[
    { name:"cover", uom:"m2", total:flatarea, overriddenTotal:null, pitch:0},
    { name:"cover", uom:"m2", total:steeparea, overriddenTotal:null, pitch:3},
    { name:"hip", uom:"m", total:hip, overriddenTotal:null },
    { name:"eave", uom:"m", total:eave, overriddenTotal:null },
    { name:"ridge", uom:"m", total:ridge, overriddenTotal:null},
    { name:"rake", uom:"m" , total:rake, overriddenTotal:null},
    { name:"valley", uom:"m" , total:valley, overriddenTotal:null},
    { name:"pipe-boot-3-inch", uom:"ea" ,total:pipe3, overriddenTotal:null},
    { name:"pipe-boot-4-inch", uom:"ea" ,total:pipe4, overriddenTotal:null},
    { name:"box-vent", uom:"ea" ,total:boxvent, overriddenTotal:null},
]
*/
  const ventTotal = (name) => {
    const lines = measurement?.markers
    let totalpipe3 = parseInt("0")
    let totalpipe4 = parseInt("0")
    let totalboxvent = parseInt("0")
    if (lines) {
        lines.forEach(line => {
        const venttype = line[2].toLowerCase()
          switch (venttype) { //totals based upon tool type
              case 'pipe boot - 3 inch':
                totalpipe3++
                break
                case 'pipe boot - 4 inch':
                  totalpipe4++
                break
                case 'box vent':
                  totalboxvent++
                  break
          }
      })
    }
    switch (name) {
      case 'pipeboot3':
        return totalpipe3
      case 'pipeboot4':
        return totalpipe4
      case 'boxvent':
        return totalboxvent
    }
  }

  const MeasurementSchema = yup.object({
   // ridge: yup.string().required()
  
   // address: yup.string().required().max(100),
   // city: yup.string().required().max(50),
   // state: yup.string().required().max(50),
   // zip: yup.string().required().max(20),
   // phone: yup.string().matches(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/, { excludeEmptyString: true }).required().max(255)
  })

  const dispatch = useDispatch()

  const convertMeasureArrayUom = (arr, uomMap) => {
    return arr.map(({uom, total, overriddenTotal, ...rest}) => ({
      ...rest,
      uom: uomMap[uom],
      total: convertUoM(uom, uomMap[uom], total),
      overriddenTotal: overriddenTotal ? convertUoM(uom, uomMap[uom], overriddenTotal) : null
    }))
  }
  const defaultValues = {}
  
  if (selectedLead?.measurement?.calculated_values) {
    convertMeasureArrayUom(measurement['calculated_values'], selectedUom.load).forEach(cv => {
      if (cv.name === 'cover' && cv['pitch'] === 0) {
        defaultValues['flatarea'] = cv.overriddenTotal
        defaultValues['flatarea-calc'] = cv.total
      } else if (cv.name === 'cover' && cv['pitch'] === 3) {
        defaultValues['steeparea'] = cv.overriddenTotal
        defaultValues['steeparea-calc'] = cv.total
      } else {
        defaultValues[cv.name] = cv.overriddenTotal
        defaultValues[`${cv.name}-calc`] = cv.total
      }
    })
  }
  console.log('defaultValues', defaultValues)

  const resolver = useYupValidationResolver(MeasurementSchema)

  // ** Vars
  const {
    control,
    formState: {  },
    //register, 
   // watch,
    //setValue,
    //setError,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({ resolver, defaultValues })
console.log(errors)

  const toolTotal = (name) => {
    return getValues(`${name}-calc`)
    //console.log("tt", name)
    //console.log(selectedLead.measurement?.calculated_values.filter((m) => m.name === name)[0].total)
    //return selectedLead?.measurement?.calculated_values.filter((m) => m.name === name)[0].total
  }

  // ** Function to handle form submit
  const onSubmit = async data => {  
    
    const ob = Object.assign({}, selectedLead) //create new lead object to add data to
    const newd = {
      ... selectedLead.measurement //use the data already saved
    }
    
    let calculated_values = []
    if (selectedLead?.measurement?.calculated_values) {

      const tempArray = convertMeasureArrayUom(measurement['calculated_values'], selectedUom.load)
      console.log('selectedUom.load', tempArray)
      tempArray.forEach((cv) => {
        const new_data = {
          ...cv
        }       
        if (cv.name === 'cover' && cv['pitch'] === 0) {
            new_data['overriddenTotal'] = parseInt(data['flatarea'])
        } else if (cv.name === 'cover' && cv['pitch'] === 3) {
          new_data['overriddenTotal'] = parseInt(data['steeparea'])
        } else {
          new_data['overriddenTotal'] = parseInt(data[cv.name])
        }
        calculated_values.push(new_data)
      })

      console.log('set', calculated_values)
      calculated_values = convertMeasureArrayUom(calculated_values, selectedUom.save)
      console.log('selectedUom.save', calculated_values)
    }
    newd.calculated_values = calculated_values

  
    ob.measurement = newd // set the new measurement
    const lead = await axios.put(`/api/projects/${selectedLead._id}`, ob)
      dispatch(updateLead(lead.data)).then(() => {
        toggleSidebar(!open)
      })
  }

  const compareVent = (v, name, setFunc) => {
    const inputVal = (parseInt(v))
    console.log(inputVal)
    //return
    const t = (measurement?.calculated_values.filter((m) => m.name === "pipe-boot-3-inch")[0].total)
    console.log(t)
   // const totalVal = (selectedLead.measurement && selectedLead?.measurement?.calculated_values.filter((m) => m.name === name)[0].total)
    setFunc(inputVal !== t)
    
  }
  /*
  const steepAreaTotal = () => {
    let total = 0.0
    const areas = measurement?.areas //JSON.parse(measurement.areas)
    if (areas) {
      areas.forEach(area => {
        if (area[4] > 2) {
        total = total + area[1]
        }
      })
    }
  return   +(total * 3.28084 * 3.28084).toFixed(2)
}

const low_pitchAreaTotal = () => {
  const areas = measurement?.areas //JSON.parse(measurement.areas)
  let total = 0.0
  if (areas) {

    areas.forEach(area => {
      if (area[4] < 3) {
      total = total + area[1]
      }
    })
  }
return   +(total * 3.28084 * 3.28084).toFixed(2)
}
*/

  useEffect(() => {

  }, [selectedLead])//if the project changes the measurement could change
  
  const lines = (tool) => {
    console.log(tool)//filter based on
    const linesData = (measurement?.measurements ?? []).filter((m) => {
      if (m.type === "line") { //filter only lines
        return true
      }
      return false
    })
    if (!linesData) {
      return (
        <div>
        <b style={{backgroundColor:"yellow"}} >* No lines drawn on map</b></div>
        )
    }
        return (<div>
          <h4>Roof Lines</h4>
          <table className='areatable'>
          <thead>
            <tr>
            <th>#</th>
            <th>Length</th>
            <th>Type</th>
            <th>Pitch</th>
            </tr>
          </thead>
          <tbody>
          { 
            linesData.map((l, i) => { 
            return (<tr><td>{i}</td><td>{convertUoM(l.UOM, selectedUom.load[l.UOM], l.total)} {selectedUom.load[l.UOM]}</td><td>{l.materialType}</td><td>{l.pitch}/12</td></tr>)
          })
          
          }
          </tbody>
        </table>
        </div>)
  }
  const satInfo = (name, stateVar) => {
    if (stateVar) {
      return <div style={{color:'black', backgroundColor:'yellow'}}> * Satellite image {name} length is {toolTotal(name).toFixed(2)} ft
      
      </div>
    } else {
      return <span></span>
    }
  }
  const ventInfo = (name, stateVar) => {
    if (stateVar) {
      return <span style={{color:'black', backgroundColor:'yellow'}}> * Satellite total is {ventTotal(name)}</span>
    } else {
      return <span></span>
    }
  }
  
/*
const satareaInfo = () => {
  if (showAreaSat) {
    return <span style={{color:'black', backgroundColor:'yellow'}}> * Satellite image area is {low_pitchAreaTotal()} ft^2</span>
  } else {
    return <span></span>
  }
}

const satsteepInfo = () => {
  if (showSteepSat) {
    return <span style={{color:'black', backgroundColor:'yellow'}}> * Satellite image area is {steepAreaTotal()} ft^2</span>
  } else {
    return <span></span>
  }
}
*/
const areas = () => {
  const polygons = (measurement?.measurements ?? []).filter((m) => {
    if (m.type === "area") { //filter only lines
      return true
    }
    return false
  })
  if (!polygons) {
    return (
      <div>
      <b style={{backgroundColor:"yellow"}} >* No areas drawn on map</b></div>
      )
  }
      return (<div>
        <h4>Roof Planes</h4>
        <table className='areatable'>
        <thead>
          <tr>
          <th>#</th>
          <th>Area</th>
          <th>Pitch</th>
          </tr>
        </thead>
        <tbody>
        { 
          polygons.map((area, i) => { 
          return (<tr><td>{i}</td><td>{convertUoM(area.UOM, selectedUom.load[area.UOM], area.total)} {selectedUom.load[area.UOM]}</td><td>{area.pitch}/12</td></tr>)
        })
        
        }
        </tbody>
      </table>
      </div>)
}

const markers = () => {
  const points = (measurement?.measurements ?? []).filter((m) => {
    if (m.type === "point") { //filter only points
      return true
    }
    return false
  })
  if (!points) {
    return (
      <div>
      <b style={{backgroundColor:"yellow"}} >* No areas drawn on map</b></div>
      )
  }
      return (<div>
        <h4>Roof Markers</h4>
        <table className='areatable'>
        <thead>
          <tr>
          <th>#</th>
          <th>type</th>
          <th> </th>
          </tr>
        </thead>
        <tbody>
        { 
          points.map((p, i) => { 
          return (<tr><td>{i}</td><td>{p.materialType} </td><td> </td></tr>)
        })
        
        }
        </tbody>
      </table>
      </div>)
}

  return (
    <div>
    <Modal isOpen={open} toggle={() => toggleSidebar(!open)} className='measure-modal modal-dialog-centered modal-lg'>
    <ModalHeader className='bg-transparent' toggle={() => {
      toggleSidebar(!open)
    }}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <div className='text-center mb-2'>
        <h1 className='mb-1'><FontAwesomeIcon icon={faTape}  />Edit Measurements</h1>
      </div>
    
      <Form onSubmit={handleSubmit(onSubmit)} className='measure-modal'>

        
      <Row >
        <Col xl={4} lg={4} xs={12}>
        <h2>Areas</h2>
        {areas()}
        <br/>
        <div className='mb-1'>
          <Label className='form-label' for='flatarea'>
          &#60; 3/12 Area<span className='text-danger'>*</span>
          </Label>
          <Controller
          
            name='flatarea'
            control={control}
            render={({ field}) => (
              <>
                <Input placeholder={getValues('flatarea-calc')}
                {...field} 
                invalid={errors.area && true} 
                />
                {getValues('flatarea') && (
                  <span style={{color:'black', backgroundColor:'yellow'}}> * Satellite image area is {getValues('flatarea-calc')} ft^2</span>
                  )}
              </>
            )}

          />

        </div>
        <div className='mb-1'>
          <Label className='form-label' for='steeparea'>
            ≥ 3/12 Area <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='steeparea'
            control={control}
            render={({ field}) => (
              <>
                <Input placeholder={getValues('steeparea-calc')}
                {...field}
                invalid={errors.area && true}               
                />
                {getValues('steeparea') && (
                    <span style={{color:'black', backgroundColor:'yellow'}}> * Satellite image area is {getValues('steeparea-calc')} ft^2</span>
                )}
              </>
            )}
          />

        </div>
        </Col>
        <Col xl={4} lg={4} xs={12}>
      <h2>Lengths</h2>
      {lines("todo:filter")}
        <div className='mb-1'>
        
          <Label className='form-label' for='ridge'>
            Ridges <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='ridge'
            control={control}
            render={({ field: {  onChange, name, ...field }}) => (
              <div>
              <Input id='ridge' invalid={errors.ridge} placeholder={getValues('ridge-calc')}
              onChange={({ target: { value } }) => {
                onChange(value) 
                setShowRidgeSat(value !== "")
              }}
              {...field} />

              {satInfo(name, showRidgeSat)}
              
              </div>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='hip'>
            Hips <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='hip'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
              <Input id='hip'  placeholder={getValues('hip-calc')}
              onChange={({ target: { value } }) => {
                onChange(value)
                setShowHipSat(value !== "")
              }}
              {...field} />
              {satInfo(name, showHipSat)}
              </div>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='valley'>
            Valleys <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='valley'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
                <Input id='valley' placeholder={getValues('valley-calc')}
                onChange={({ target: { value } }) => {
                  onChange(value)
                  setShowValleySat(value !== "")
                }}  
                {...field} />
                 {satInfo(name, showValleySat)}
              </div>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='eave'>
            Eaves <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='eave'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
              <Input id='eave' placeholder={getValues('eave-calc')}
              onChange={({ target: { value } }) => {
                onChange(value)
                setShowEaveSat(value !== "")
              }}  
              {...field} />
              {satInfo(name, showEaveSat)}
              </div>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rake'>
            Rakes<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='rake'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
              <Input id='rake' placeholder={getValues('rake-calc')}
              onChange={({ target: { value } }) => {
                onChange(value)
                setShowRakeSat(value !== "")
              }}  
              {...field} />
              {satInfo(name, showRakeSat)}
              </div>
            )}
          />
        </div>
        </Col>
      <Col xl={4} lg={4} xs={12}>
       <h3>Vents</h3>
       {markers()}
        <div>
          <Label className='form-label' for='pipeboot3'>
                  3" Pipe Boots - {getValues('pipe-boot-3-inch-calc')}
          </Label>
          <Controller
            name='pipe-boot-3-inch'
            control={control}
            render={({ field: { onChange,    ...field }}) => (
              <div>
              <Input id='pipeboot3' placeholder={getValues('pipe-boot-3-inch-calc')}
                       onChange={({ target: { value } }) => {
                        onChange(value)
                        setShowPipeBoot3(value.length > 0)
                      }} 
                      invalid={errors.pipeboot3 && true} 
                      {...field} />
                  {showPipeBoot3 && getValues('pipe-boot-3-inch-calc') }
              
              </div>
              
            )}
          />
          
          </div>
          <div>
       
        <Label className='form-label' for='pipeboot4'>
                  4" Pipe Boots  
          </Label>
          <Controller
            name='pipeboot4'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
              <Input id='pipeboot4' placeholder={getValues('pipe-boot-4-inch-calc')}
              onChange={({ target: { value } }) => {
                onChange(value)
                compareVent(value, name, setShowPipeBoot4)
              }} 
              invalid={errors.pipeboot4 && true} {...field} />
              {ventInfo(name, showPipeBoot4)}
              </div>
            )}
          />
          </div>
          <div>
          <Label className='form-label' for='ridgevent'>
          Ridge Vents Length 
          </Label>
          <Controller
            name='ridgevent'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
              <Input id='ridgevent' 
              onChange={({ target: { value } }) => {
                onChange(value)
                compareVent(value, name, setShowRidgeVent)
              }}  invalid={errors.ridgevent && true} {...field} />
              {ventInfo(name, showRidgeVent)}
              </div>
            )}
          />
          </div>
          <div>
          <Label className='form-label' for='boxvent'>
          Box Vents 
          </Label>
          <Controller
            name='boxvent'
            control={control}
            render={({ field: { onChange,   name, ...field }}) => (
              <div>
              <Input id='boxvent' placeholder={getValues('box-vent-calc')}
              onChange={({ target: { value } }) => {
                onChange(value)
                setShowBoxVent(false)
              }}
               invalid={errors.boxvent && true} {...field} />
              {ventInfo(name, showBoxVent)}
              </div>
            )}
          />
          </div>
          </Col>
          <br></br>
          <h3>
            * Changing these values overwrites the calculated values
          </h3>
     
          </Row>
        <Button type='submit' className='me-1' color='primary'>
          Save
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form></ModalBody>
      
    </Modal>
    <Modal isOpen={showUpdate} toggle={() => setShow(!showUpdate)} className='modal-dialog-centered modal-lg'>
    <ModalHeader className='bg-transparent'  toggle={() => setShowUpdate(!showUpdate)}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <Form>
      <Row className='gy-1 pt-75'>
            <Col xs={12} className='text-center mt-2 pt-50'>
            <div className='text-center mb-2'>
        <h1 className='mb-1'>Are you sure?</h1>
      </div>

      <div>
      I will manually update the quantities and wastes values on the Materials card.
      Let the system automatically overwrite the quantities and wastes values on the Materials cards.
      Cancel this save.
      </div>
     
            <Button type='submit' className='me-1' color='primary'>
              Save
            </Button>
            <Button
              type='reset'
              color='secondary'
              outline
              onClick={() => {
                //handleReset()
                setShowUpdate(false)
              }}
            >
              Cancel
            </Button>
  </Col></Row>
      </Form>
    </ModalBody>
    </Modal>
    </div>
  )
}

export default EditMeasurement
