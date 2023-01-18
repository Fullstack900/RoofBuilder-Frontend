
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import {MaterialCreateSchema} from '../schemas'
import { saveMaterials} from '../store'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ToastContent from './toast'
import toast from 'react-hot-toast'
//import { useNavigate } from 'react-router-dom'
import MaterialListFields from './MaterialListFields'
//const TO = require('../order_templates.json')
 import {calculateQuantity} from '@utils'
export default (props) => {
  
 // const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector(state => state.leads)
    const {show, setShow, TO, TI} = props
    const selectedLead = Object.assign(store.selectedLead)
    const measurement = selectedLead.measurement
    const calc_qty = (p) => {
      return calculateQuantity(p, measurement)
    }
    
  const resolver = useYupValidationResolver(MaterialCreateSchema)

  const defaultWaste = (p) => {
  
  let hips = 0
  let valleys = 0 
  if (measurement.lines) { 
    const lines = measurement.lines
    for (let line = 0; line < lines.length; line++) {
      const type = lines[line][lines[line].length - 4] //the line type is at the end of the array
      
      if (type === "Hip") {
        hips = hips + ((lines[line].length - 7) / 2) //the line could contain multiple segments counts the number of latitude longitude
      }
      if (type === "Valley") {
        valleys = valleys + ((lines[line].length - 7) / 2)
      }
    }
  }
  //console.log("hips", hips)
  //console.log("valleys", valleys)
    switch (p.category) {
      case 'Shingles':
        switch (true) { //ranges by count of hips + valleys
          case (hips + valleys) < 2:
            return 5
          case (hips + valleys) < 4:
            return 7
          case (hips + valleys) < 6:
            return 9
          case (hips + valleys) < 12:
            return 10
          case (hips + valleys) > 11:
            return 15
        }
      case 'W-Valley':
        return 5
      case 'Other':
          return 10
    }
    return 0
    }
  const defaultValues = {
    project: selectedLead.id,
    
    materialList:TO.data.categories[2].templates[0].items.map((i) => {
      //console.log(Math.ceil(((calc_qty(i) * defaultWaste(i)) / 100) + calc_qty(i)))
       return {quantity:Math.ceil(((calc_qty(i) * defaultWaste(i)) / 100) + calc_qty(i)), waste:defaultWaste(i), color:'', itemcode:i.itemCode} 
      })
  }

//console.log(defaultValues.materialList){Math.ceil(calc_qty(materialItem) + calcWaste(count, materialItem))}

  // ** Hook
  const {
    //   reset,
        control,
        setError,
        handleSubmit,
        setValue,
        formState: { errors }
      } = useForm({resolver,
        defaultValues
      })
  const onSubmit = async data => {
    //console.log(data)
    try {
      const materials = await axios.put(`/api/projects/${data.project}/materials`, data) 
      dispatch(saveMaterials(materials.data))

      toast(t => (<ToastContent t={t} title="Project Updated" content="Successfully created the materials."/>))
      setShow(false)
      
    } catch (e) {
      if (e.response && e.response.status === 422) {
        for (const err in e.response.data.errors) {
          setError(err, { type: 'custom', message: e.response.data.errors[err][0] })
        }
        //console.log(e.response.data.errors)
      } else {
        toast(t => (<ToastContent t={t} title="Materials Create Failed" content={e.response.message}/>))
      //  console.log(e)
      }
    }

  }

  return (
    <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-xl'>
    <ModalHeader className='bg-transparent'  toggle={() => setShow(!show)}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <div className='text-center mb-2'>
        <h1 className='mb-1'>Add Materials</h1>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="updateform" >
          <MaterialListFields TO={TO} TI={TI} control={control} errors={errors}  setValue={setValue} measurement={selectedLead.measure}/>
          <Row className='gy-1 pt-75'>
            <Col xs={12} className='text-center mt-2 pt-50'>
            <Button type='submit' className='me-1' color='primary'>
              Save
            </Button>
            <Button
              type='reset'
              color='secondary'
              outline
              onClick={() => {
                //handleReset()
                setShow(false)
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </ModalBody>
    </Modal>

  )


}

