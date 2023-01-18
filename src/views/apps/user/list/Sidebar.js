// ** React Import
//import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
//import { selectThemeColors } from '@utils'

// ** Third Party Components
//import Select from 'react-select'
//import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'

import { useYupValidationResolver } from '@hooks/useYupValidationResolver'
// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { addUser } from '../store'
import { useDispatch } from 'react-redux'
//import axios from 'axios'
const defaultValues = {
  email: '',
  //contact: '',
  //company: '',
  fullName: '',
  password: ''
//  country: null
}
const UserCreateSchema = yup.object({
  name: yup.string().required().max(255),
  address: yup.string().required().max(100),
  city: yup.string().required().max(50),
  state: yup.string().required().max(50),
  zip: yup.string().required().max(20),
  phone: yup.string().matches(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/, { excludeEmptyString: true }).required().max(255)
})

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
 // const [data, setData] = useState(null)
  //const [plan, setPlan] = useState('basic')
  //const [role, setRole] = useState('subscriber')
  //const [file, setFile] = useState()
//let file = useState()

  // ** Store Vars
  const dispatch = useDispatch()
  const resolver = useYupValidationResolver(UserCreateSchema)
  // ** Vars
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({resolver, defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
      toggleSidebar()
      dispatch(
        addUser({
          email: data.email,
          password: data.password,
          name: data.fullName
        })
      )
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    //setRole('subscriber')
  //  setPlan('basic')
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New User'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>

        <div className='mb-1'>
          <Label className='form-label' for='fullName'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => (
              <Input id='fullName' placeholder='John Doe' invalid={errors.fullName && true} {...field} />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='userEmail'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='userEmail'
                placeholder='john.doe@example.com'
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color='muted'>You can use letters, numbers & periods</FormText>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='password'>
            Password <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input type="password" id='password' placeholder='**' invalid={errors.pasword && true} {...field} />
            )}
          />
        </div>
        <Button type='submit' className='me-1' color='primary'>
          Add
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
