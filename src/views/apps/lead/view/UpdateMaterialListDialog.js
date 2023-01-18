
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import {MaterialCreateSchema} from '../schemas'
import { saveMaterials} from '../store'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'
import {calculateQuantity} from '@utils'
import ToastContent from './toast'
import toast from 'react-hot-toast'
//import { useNavigate } from 'react-router-dom'
import MaterialListFields from './MaterialListFields'
//const TO = require('../order_templates.json')
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faFileLines, faWarning } from '@fortawesome/free-solid-svg-icons'
export default (props) => {
 // const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector(state => state.leads)
    const {show, setShow, TO, TI, Materials} = props

    
  const resolver = useYupValidationResolver(MaterialCreateSchema)
let mats = []
  const selectedLead = Object.assign(store.selectedLead)
  const measurement = selectedLead.measure
    const  defaultValues = {
    project: selectedLead.id,
    materialList:TO.data.categories[2].templates[0].items.map((i) => { return {quantity:0, waste:0, color:'', itemcode:i.itemCode} })
  }
  let totalCost = 0
  let alertFlag = false
  const getProduct = (itemcode) => {
   
    return  TO.data.categories[2].templates[0].items.find(element => element.itemCode === itemcode)   
     
  }
  if (Materials) { //we have maerials set the default value
    
    mats = Object.assign(Materials)
    defaultValues.materialList = mats.map((i) => { return {id:i.id, quantity: i.quantity, waste: i.waste, color: i.color, itemcode:i.itemcode} })//

    for (let i = 0; i < mats.length; i++) {
      const  product = getProduct(mats[i].itemcode)
      totalCost = totalCost + (Math.floor(mats[i].quantity * product.price * 100)) 
      
      const calQty = calculateQuantity(product, measurement)
      
      
     if (mats[i].quantity !== Math.ceil(calQty)) {
     // console.log(mats[i].quantity, calQty)
      //console.log("not same")
      alertFlag = true
     }
    }
  }  
console.log(alertFlag)
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
    
    try {
      const materials = await axios.put(`/api/projects/${data.project}/materials`, data)
      dispatch(saveMaterials(materials.data))

      toast(t => (<ToastContent t={t} title="Project Updated" content="Successfully updated the materials."/>))
      setShow(false)
      //navigate(`/apps/lead/view/${lead.data.id}`)
    } catch (e) {
      if (e.response && e.response.status === 422) {
        for (const err in e.response.data.errors) {
          setError(err, { type: 'custom', message: e.response.data.errors[err][0] })
        }
      } else {
        toast(t => (<ToastContent t={t} title="Materials update Failed" content={e.response.message}/>))
      
      }
    }

  }

  return (<>
    <Card onClick={() => setShow(!show)}>
      <CardBody>
        <h2 ><FontAwesomeIcon icon={faFileLines} /> Materials 
        <FontAwesomeIcon icon={faPencil}  style={{float:"right"}}/>
        <span style={{float:"right"}}>${(totalCost / 100).toFixed(2)} &nbsp;</span>
        <FontAwesomeIcon title="Quantities do not match measurements" icon={faWarning}  style={{marginRight:"10px", float:"right", display: alertFlag ? 'block' : "none"}}/>
        </h2>
       </CardBody>
    </Card>
    <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-xl' >
    <ModalHeader className='bg-transparent'  toggle={() => setShow(!show)}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <div className='text-center mb-2'>
        <h1 className='mb-1'>Update Materials</h1>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="updateform" >
          <MaterialListFields TO={TO} TI={TI} control={control} errors={errors}  setValue={setValue} measurement={selectedLead.measure} />
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
</>
  )


}

