/*eslint-disable no-unused-vars */
import {useState, useEffect} from 'react'
import { Modal, ModalBody, ModalHeader, Form, Row, Button, Col, Label, Image, Spinner } from 'reactstrap'
import { useForm, FormProvider } from 'react-hook-form'
import MaterialListFields from './MaterialListFields'
import { useSelector, useDispatch } from 'react-redux'
import useAxios from 'axios-hooks'
import axios from 'axios'
import Select, { components } from 'react-select'
import { updateLead} from '../store'
import ToastContent from './toast'
import toast from 'react-hot-toast'

const SelectProductMap = ({onTemplateChange}) => {
  const [{ data, loading, error}] = useAxios('/api/measure-product-maps')
  const [processing, setProcessing] = useState(false)
  const dispatch = useDispatch()

  const store = useSelector(state => state.leads)
  const selectedLead = store.selectedLead
  const value = selectedLead?.materialList?.measureProductMap

  const OptionComponent = ({ data, ...props }) => {

    return (
      <components.Option {...props} key={data.value}>
        {data.icon && (
          <img style={{maxHeight: '20px', float:'left', paddingRight:'0.5em'}} src={data.icon} />
        )}
        {data.label}
      </components.Option>
    )
  }

  const mapItem = (i) => {
    return {value:i._id, label:i.productTemplate.name, icon:i.productTemplate.logo, isDefault:i.isDefault, productTemplate:i.productTemplate._id}
  }

  const mapOptions = () => {
    return [
      {
       // label: 'Templates',
        options: data.data.map((i) => mapItem(i))
      }
    ]
  }

  const processTemplate = async(value) => {
    setProcessing(true)

    try {
      await axios.post(`/api/projects/${selectedLead._id}/calc-materials`, {productTemplate:value})
      const lead = await axios.get(`/api/projects/${selectedLead._id}`)
      await dispatch(updateLead(lead.data))
      if (onTemplateChange) {
        onTemplateChange(lead.data)
      }
    } catch (e) {
      console.log(e)
      toast(t => (<ToastContent t={t} title="Update Measurements failed" content={e?.response?.message}/>))
    }

    setProcessing(false)
  }

  const findValue = (options, value) => {
    let found = null
    if (value) {
      found = options.filter((i) => i.value === value)
    }
    if (!found) {
      found = options.filter((i) => i.isDefault)
    }

    if (found) {
      return found[0]
    }
    return null
  }

  let options = []
  let selectedOption = null
  if (!loading) {
    options = mapOptions()
    selectedOption = findValue(options[0].options, value)
  }


  return (
    <Row className='mb-1'>
      <Label sm='1' xs='12'>
        Template
      </Label>
      <Col sm='7' xs='12'>
        {loading ? 'Loading...' : (
          <Select
            
            className='react-select'
            classNamePrefix='select'
            components={{
              Option: OptionComponent
            }}
            options={options}
            value={selectedOption}
          />
        )}
      </Col>
      <Col sm='3' xs='12'>
        {processing ? (
          <Button color='primary'>
            <Spinner color='white' size='sm' />
            <span className='ms-50'>Saving...</span>
          </Button>
        ) : (
          <Button color='primary' onClick={() => processTemplate(selectedOption?.productTemplate)}>Update Measurements</Button>
        )}
      </Col>
    </Row>
  )
}

const MaterialListDialog = ({visible, onClose, project}) => {
  const [processing, setProcessing] = useState(false)
  const store = useSelector(state => state.leads)
  const selectedLead = store.selectedLead
  const dispatch = useDispatch()

  const methods = useForm({
    //{resolver
    //,
       }
)
  useEffect(() => {
    const  defaultValues = {
      project: selectedLead._id,
      materialList: selectedLead?.materialList?.items
    }

    methods.reset(defaultValues)
  }, [selectedLead])

  const handleTemplateChange = (lead) => {
    //reset the form, default values invalid
    methods.reset({
      project: lead._id,
      materialList: lead.materialList?.items
    })
  }

  const handleCancel = () => {
    methods.reset()
    onClose()
  }

  const onSubmit = async data => { 
    setProcessing(true)
    
    const postData = {
      ...selectedLead,
      materialList: {
        measureProductMap: selectedLead?.materialList?.measureProductMap,
        items: data.materialList
      }
    }
    console.log('onSubmit', postData)
    try {
      await axios.put(`/api/projects/${selectedLead._id}`, postData)
      console.log('saved')
      const lead = await axios.get(`/api/projects/${selectedLead._id}`)
      console.log('loaded', lead)
      await dispatch(updateLead(lead.data))
      handleTemplateChange(lead.data)
      onClose()
    } catch (e) {
      console.log('is error', e)
      toast(t => (<ToastContent t={t} title="Save failed" content={e?.response?.message}/>))
    }
    setProcessing(false)

    
  }

  return (
    <Modal isOpen={visible} toggle={handleCancel} className='modal-dialog-centered modal-xl' >
      <ModalHeader className='bg-transparent'  toggle={handleCancel}></ModalHeader>
      <ModalBody className='px-sm-5 pt-50 pb-5'>
        <div className='text-center mb-2'>
          <h1 className='mb-1'>Update Materials</h1>
        </div>
        <SelectProductMap onTemplateChange={handleTemplateChange} key={selectedLead?.materialList?.productTemplate}/>
        <FormProvider {...methods} >
          <Form onSubmit={methods.handleSubmit(onSubmit)} className="updateform" >
            <MaterialListFields />
            <Row className='gy-1 pt-75'>
              <Col xs={12} className='text-center mt-2 pt-50'>
              {processing ? (
                  <Button color='primary'>
                    <Spinner color='white' size='sm' />
                    <span className='ms-50'>Saving...</span>
                  </Button>
                ) : (
                  <Button type='submit' className='me-1' color='primary'>
                    Save
                  </Button>
                )}

                <Button
                  type='reset'
                  color='secondary'
                  outline
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </FormProvider>
      </ModalBody>
    </Modal>
  )

}

export default MaterialListDialog