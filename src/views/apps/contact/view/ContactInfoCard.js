// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
//import Select from 'react-select'
//import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'
// ** measurement sidebar
//import Sidebar from './Sidebar'
// ** Custom Components
//import Avatar from '@components/avatar'

// ** Utils
//import { selectThemeColors } from '@utils'
import { updateContact} from '../store'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

import { useDispatch } from 'react-redux'

const MySwal = withReactContent(Swal)

const ContactInfoCard = ({ selectedContact }) => {
  // ** State
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
     // const [sidebarOpen, setSidebarOpen] = useState(false)
     // const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const onSubmit = data => {
    dispatch(
      updateContact({
        id:selectedContact.id,
        first_name:data.first_name,
        last_name:data.last_name,
        mobile_phone:data.mobile_phone,
        work_phone:data.work_phone,
        email:data.email,
        email2:data.email2,
        description:data.description,
        fax_number:data.fax_number
      })
    )

  }
  
  // ** Hook
  const {
 //   reset,
    control,
 //   setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: selectedContact.first_name,
      last_name: selectedContact.last_name,
      email: selectedContact.email,
      email2: selectedContact.email2,
      fax_number:selectedContact.fax_number,
      type: selectedContact.type,
      work_phone: selectedContact.work_phone,
      mobile_phone: selectedContact.mobile_phone,
      description: selectedContact.description
    }
  })
console.log(selectedContact)
  return (
    <Fragment>
      <Card>
        <CardBody>

        <div className='d-flex justify-content-center pt-2'>
            <Button color='primary' onClick={() => setShow(true)}>
              Edit
            </Button>
          </div>
          <div>First Name {selectedContact.first_name}</div>
          <div>Last Name {selectedContact.last_name}</div>
          
          <div>Mobile Phone {selectedContact.mobile_phone}</div>
          <div>Home Phone{selectedContact.work_phone}</div>
          <div>FAX: {selectedContact.fax_number}</div>
          <div>Email {selectedContact.email}</div>
          <div>Email2 {selectedContact.email2}</div>
          <div>Type {selectedContact.type}</div>
          <div>Notes{selectedContact.description}</div>
</CardBody></Card>
<Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <h1>Edit Contact</h1>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='first_name'>
                  First Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='first_name'
                  name='first_name'
                  render={({ field }) => (
                    <Input {...field} id='first_name' placeholder='John' invalid={errors.first_name && true} />
                  )}
                />
              </Col>
             
              <Col md={6} xs={12}>
                <Label className='form-label' for='last_name'>
                Last Name
                </Label>                
                <Controller
                  defaultValue=''
                  control={control}
                  id='last_name'
                  name='last_name'
                  render={({ field }) => (
                    <Input {...field} id='last_name' placeholder='Smith' />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='mobile_phone'>
                Phone 1
                </Label>                
                <Controller
                  defaultValue=''
                  control={control}
                  id='mobile_phone'
                  name='mobile_phone'
                  render={({ field }) => (
                    <Input {...field} id='mobile_phone' placeholder='Smith' />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='work_phone'>
                Phone 2
                </Label>                
                <Controller
                  defaultValue=''
                  control={control}
                  id='work_phone'
                  name='work_phone'
                  render={({ field }) => (
                    <Input {...field} id='work_phone' placeholder='Smith' />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='fax_number'>
                FAX
                </Label>               
                <Controller
                  defaultValue=''
                  control={control}
                  id='fax_number'
                  name='fax_number'
                  render={({ field }) => (
                    <Input {...field} id='fax_number' placeholder='12312312' />
                  )}
                />
              </Col>                        
              <Col md={6} xs={12}>
                <Label className='form-label' for='email'>
                Email
                </Label>               
                <Controller
                  defaultValue=''
                  control={control}
                  id='email'
                  name='email'
                  render={({ field }) => (
                    <Input {...field} id='email' placeholder='guy@aol.com' />
                  )}
                />
              </Col>     
              <Col md={6} xs={12}>
                <Label className='form-label' for='email2'>
                Email 2
                </Label>               
                <Controller
                  defaultValue=''
                  control={control}
                  id='email2'
                  name='email2'
                  render={({ field }) => (
                    <Input {...field} id='email2' placeholder='guy2@aol.com' />
                  )}
                />
              </Col>     
              {/*             
              <Col md={6} xs={12}>
                <Label className='form-label' for='email2'>
                Email 2
                </Label>               
                <Controller
                  defaultValue=''
                  control={control}
                  id='email2'
                  name='email2'
                  render={({ field }) => (
                    <Input {...field} id='email2' placeholder='12312312' />
                  )}
                />
              </Col>  
                  */}   
                       <Col md={6} xs={12}>
                               
        <div className='mb-1'>
          <Label className='form-label' for='type'>
            Type 
          </Label>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <select id='type'  invalid={errors.type && true} {...field}>
                <option>Wife</option>
                <option>Husband</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Insurance Agent</option>
              </select>
             
            )}
          />
        </div>
        </Col> 
              <Col md={6} xs={12}>
                <Label className='form-label' for='description'>
                Notes
                </Label>               
                <Controller
                  defaultValue=''
                  control={control}
                  id='description'
                  name='description'
                  render={({ field }) => (
                    <textarea {...field} id='description' placeholder='Notes.......' />
                  )}
                />
              </Col>
              <Col xs={12} className='text-center mt-2 pt-50'>
                <Button type='submit' className='me-1' color='primary'>
                  Save
                </Button>
                <Button
                  type='reset'
                  color='secondary'
                  outline
                  onClick={() => {
                    handleReset()
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
    </Fragment>
  )
}

export default ContactInfoCard
