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
import { addLead} from '../store'
import { useDispatch } from 'react-redux'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'

import axios from 'axios'
const LeadCreateSchema = yup.object({
 /// job_name: yup.string().required().max(255),
 // address: yup.string().required().max(100),
 // city: yup.string().required().max(50),
 // state: yup.string().required().max(50),
 // zip: yup.string().required().max(20),
 // phone: yup.string().matches(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/, { excludeEmptyString: true }).required().max(255)
})

const defaultValues = {
  job_name: '',
  client_name: '',
  salesperson: '',
  sale_state: '',
  type: '',
  paidby: '',
  type: '',
  financing: '',
  priority: '',
  type: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state:'',
  zip: ''
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

const SidebarNewLeads = ({ open, toggleSidebar }) => {
  const resolver = useYupValidationResolver(LeadCreateSchema)

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
    console.log(data)
    try {
      const resp = await axios.post('/api/leads', data)
      toast(t => (<ToastContent t={t} title="Lead Created" content="Successfully created the lead."/>))
      dispatch(addLead(resp.data))
      toggleSidebar()
    } catch (e) {
      if (e.response && e.response.status === 422) {
        for (const err in e.response.data.errors) {
          setError(err, { type: 'custom', message: e.response.data.errors[err][0] })
        }
        console.log(e.response.data.errors)
      } else {
        toast(t => (<ToastContent t={t} title="Lead Creation Failed" content={e.response.message}/>))
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
      title='New Lead'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='job_name'>
            Job # <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='job_name'
            control={control}
            render={({ field }) => (
              <Input id='job_name' placeholder='John Doe' invalid={errors.job_name && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='client_name'>
            Project Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='client_name'
            control={control}
            render={({ field }) => (
              <Input id='client_name' placeholder='John Doe' invalid={errors.client_name && true} {...field} />
            )}
          />
        </div>        
        <div className='mb-1'>
          <Label className='form-label' for='salesperson'>
            Salesperson <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='salesperson'
            control={control}
            render={({ field }) => (
              <Input id='salesperson' placeholder='John Doe' invalid={errors.salesperson && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='sale_state'>
            Sale State <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='sale_state'
            control={control}
            render={({ field }) => (
                  <select id='sale_state'  {...field}>
                <option>Prospect</option>
                <option>Active</option>
                <option>Waiting</option>
                <option>Contracted</option>
                <option>Job Scheduled/In Progress</option>
                <option>Invoiced</option>
                <option>Closed</option>
                <option>Dead</option>
                </select>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='type'>
            Project Type <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <select id='type'  {...field}>
              <option> New Roof</option>
              <option>Roof Replacement</option>
              <option>Roof Repair</option>
              </select> 
            )}
          />
        </div>        
        <div className='mb-1'>
          <Label className='form-label' for='paidby'>
          paidby <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='paidby'
            control={control}
            render={({ field }) => (                    
            <select id='paidby'  {...field}>
              <option> Retail</option>
              <option>Insurance</option>
            </select> 
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='financing'>
          Financing <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='financing'
            control={control}
            render={({ field }) => (
              <Input type ="checkbox" {...field} id='financing' />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='priority'>
          Priority <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='priority'
            control={control}
            render={({ field }) => (                    
              <select id='priority'  {...field}>
                <option> Normal</option>
                <option>Expedite</option>
              </select> 
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='address_line_1'>
            Address <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='address_line_1'
            control={control}
            render={({ field }) => (
              <Input id='address_line_1' placeholder='123 street' invalid={errors.address_line_1 && true}  {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='address_line_2'>
            Address <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='address_line_2'
            control={control}
            render={({ field }) => (
              <Input id='address_line_2' placeholder='123 street' invalid={errors.address_line_2 && true}  {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='city'>
            City <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='city'
            control={control}
            render={({ field }) => (
              <Input id='city' placeholder='New York' invalid={errors.city && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='state'>
            State <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='state'
            control={control}
            render={({ field }) => (
              <Input id='state' placeholder='New York' invalid={errors.state && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='zip'>
            Zip code <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='zip'
            control={control}
            render={({ field }) => (
              <Input id='zip' placeholder='12345' invalid={errors.zip && true} {...field} />
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

export default SidebarNewLeads