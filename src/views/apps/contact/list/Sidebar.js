// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'
import { X } from 'react-feather'

// ** Store & Actions
import { addContact} from '../store'
import { useDispatch } from 'react-redux'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'

import axios from 'axios'
const ContactCreateSchema = yup.object({
  //name: yup.string().required().max(255),
  //address: yup.string().required().max(100),
  //city: yup.string().required().max(50),
  //state: yup.string().required().max(50),
 // zip: yup.string().required().max(20),
 // phone: yup.string().matches(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/, { excludeEmptyString: true }).required().max(255)
})

const defaultValues = {
  first_name: '',
  last_name: '',
  mobile_phone: '',
  work_phone:'',
  email: '',
  email2: '',
  type:'',
  description:'',
  fax_number:''
}

const ToastContent = ({ t, title, content }) => {
  return (
    <div className='d-flex'>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{title}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>{content}</span>
      </div>
    </div>
  )
}

const SidebarNewContacts = ({ open, toggleSidebar, jobId }) => {
  const resolver = useYupValidationResolver(ContactCreateSchema)

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({resolver,  defaultValues })

  // ** Function to handle form submit
  const onSubmit = async data => {
    
    if (jobId) { //send it with the create so contact can be added to the job
      console.log(jobId)
      data['job_id'] = jobId
    }
    console.log(data)
    try {
      const resp = await axios.post('/api/contacts', data)
      toast(t => (<ToastContent t={t} title="Contact Created" content="Successfully created the contact."/>))
      dispatch(addContact(resp.data))
      toggleSidebar()
    } catch (e) {
      if (e.response && e.response.status === 422) {
        for (const err in e.response.data.errors) {
          setError(err, { type: 'custom', message: e.response.data.errors[err][0] })
        }
        console.log(e.response.data.errors)
      } else {
        toast(t => (<ToastContent t={t} title="Contact Creation Failed" content={e.response.message}/>))
        console.log(e)
      }
    }
  }

  const handleSidebarClosed = () => {
    reset()
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New Contact'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='first_name'>
            First Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='first_name'
            control={control}
            render={({ field }) => (
              <Input id='first_name' placeholder='John' invalid={errors.first_name && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='last_name'>
            Last Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='last_name'
            control={control}
            render={({ field }) => (
              <Input id='last_name' placeholder='smith' invalid={errors.last_name && true}  {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='mobile_phone'>
            Mobile Phone <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='mobile_phone'
            control={control}
            render={({ field }) => (
              <Input id='mobile_phone' placeholder='' invalid={errors.mobile_phone && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='work_phone'>
            Work Phone 
          </Label>
          <Controller
            name='work_phone'
            control={control}
            render={({ field }) => (
              <Input id='work_phone' placeholder='123' invalid={errors.work_phone && true} {...field} />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='fax_number'>
          Facsimile Number
          </Label>
          <Controller
            name='fax_number'
            control={control}
            render={({ field }) => (
              <Input id='fax_number' placeholder='123' invalid={errors.fax_number && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='email'>
            Email 
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input id='email' placeholder='guy@aol..com' invalid={errors.email && true} {...field} />
            )}
          />
        </div>        
        <div className='mb-1'>
          <Label className='form-label' for='email2'>
            Email 2
          </Label>
          <Controller
            name='email2'
            control={control}
            render={({ field }) => (
              <Input id='email2' placeholder='guy2@aol..com' invalid={errors.email2 && true} {...field} />
            )}
          />
        </div>  
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

        <div className='mb-1'>
          <Label className='form-label' for='description'>
            Notes 
          </Label>
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <Input id='description' placeholder='.......' invalid={errors.description && true} {...field} />
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

export default SidebarNewContacts