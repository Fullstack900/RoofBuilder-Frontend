// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
//import Select from 'react-select'
import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
//import Avatar from '@components/avatar'

// ** Utils
//import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
// ** Store & Actions
import { updateUser } from '../store'
import { useDispatch } from 'react-redux'


const roleColors = {
  editor: 'light-info',
  admin: 'light-danger',
  author: 'light-warning',
  maintainer: 'light-success',
  subscriber: 'light-primary'
}


const MySwal = withReactContent(Swal)

const UserInfoCard = ({ selectedUser }) => {
  // ** State
  const [show, setShow] = useState(false)

  const dispatch = useDispatch()
  // ** Hook
  const {
    reset,
    control,
    //setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name:selectedUser.name,
      email:selectedUser.email,
      phone:selectedUser.phone
    }
  })
/*
  // ** render user img
 // ** Function to handle form submit
 const submitStuff = data => {
  console.log(data)
  //setData(data)
  if (true) { //checkIsValid(data)) {
    //toggleSidebar()
    console.log(selectedUser)
    dispatch(
      updateUser({
        id:selectedUser.id,
        name:data.name
       // profile: file,
        //avatar: file,
       // status: 'active',
        //email: data.email,
//         currentPlan: plan,
        //billing: 'auto debit',
        //company: data.company,
       // phone: data.phone,
       // name: data.fullName
 //       username: data.username,
       // country: data.country.value
      })
    )
  } else {
    for (const key in data) {
      if (data[key] === null) {
        setError('country', {
          type: 'manual'
        })
      }
      if (data[key] !== null && data[key].length === 0) {
        setError(key, {
          type: 'manual'
        })
      }
    }
  }
}*/
  const onSubmit = data => {

    dispatch(
      updateUser({
        id:selectedUser.id,
        name:data.name,
        email:data.email,
        phone:data.phone
      })
    )
    setShow(false)
  }

  const handleReset = () => {
    reset({
      email:selectedUser.email
      //username: selectedUser.username
     // lastName: selectedUser.fullName.split(' ')[1],
      //firstName: selectedUser.fullName.split(' ')[0]
    })
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
            
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>{selectedUser !== null ? selectedUser.fullName : 'Eleanor Aguilar'}</h4>
                  {selectedUser !== null ? (
                    <Badge color={roleColors[selectedUser.role]} className='text-capitalize'>
                      {selectedUser.role}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
          <div className='info-container'>
            {selectedUser !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Name:</span>
                  <span>{selectedUser.name}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>Email:</span>
                  <span>{selectedUser.email}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>phone:</span>
                  <span>{selectedUser.phone}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button color='primary' onClick={() => setShow(true)}>
              Edit
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit User Information</h1>
            <p>Change user info</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='name'>
                  Name
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='name'
                  name='name'
                  render={({ field }) => (
                    <Input {...field} id='name' placeholder='John' invalid={errors.name && true} />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='billing-email'>
                  Email
                </Label>
                <Input
                  type='email'
                  id='billing-email'
                  defaultValue={selectedUser.email}
                  placeholder='example@domain.com'
                />
              </Col>
             
              <Col md={6} xs={12}>
                <Label className='form-label' for='phone'>
                  phone
                </Label>                
                <Controller
                  defaultValue=''
                  control={control}
                  id='phone'
                  name='phone'
                  render={({ field }) => (
                    <Input {...field} id='phone' placeholder='1231231234' />
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

export default UserInfoCard
