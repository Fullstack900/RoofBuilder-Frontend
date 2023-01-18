
import { useEffect } from 'react'
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import ProjectFields from './ProjectFields'
import {LeadUpdateSchema} from '../schemas'
import { updateLead} from '../store'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ToastContent from './toast'
import toast from 'react-hot-toast'

export default (props) => {
  const store = useSelector(state => state.leads)

  const dispatch = useDispatch()

    const {show, setShow} = props

  const resolver = useYupValidationResolver(LeadUpdateSchema)

  const selectedLead = Object.assign(store.selectedLead)

  const mapLead = (lead) => {
    return {
      client_name: lead.client_name,
      job_name: lead.job_name,
      salesperson: lead.salesperson,
      sale_state: lead.sale_state,
      type: lead.type,
      paidby:lead.paidby,
      //financing:lead.financing,
      priority:lead.priority,
      state:lead.state,
      city:lead.city,
      address_line_1:lead.address_line_1,
      address_line_2:lead.address_line_2,
      zip:lead.zip,
      description:lead.description
    }
  }

  const defaultValues = mapLead(selectedLead)

  // ** Hook
  const {
        reset,
        control,
        setError,
        handleSubmit,
        setValue,
        formState: { errors }
      } = useForm({resolver,
        defaultValues
      })

      useEffect(() => {
        if (selectedLead) {
          reset(mapLead(selectedLead))
        }
      }, [selectedLead])

  const onSubmit = async data => {
    try {
      //const resp = await axios.post('/api/leads', data)
      //dispatch(
      //  updateLead(selectedLead.id, data)
      //)
      const lead = await axios.put(`/api/projects/${selectedLead._id}`, data)
      dispatch(updateLead(lead.data))

      toast(t => (<ToastContent t={t} title="Project Updated" content="Successfully updated the project."/>))
      setShow(false)
    } catch (e) {
      if (e.response && e.response.status === 422) {
        for (const err in e.response.data.errors) {
          setError(err, { type: 'custom', message: e.response.data.errors[err][0] })
        }
        //console.log(e.response.data.errors)
      } else {
        toast(t => (<ToastContent t={t} title="Project Update Failed" content={e.response.message}/>))
      //  console.log(e)
      }
    }

  }

  return (
    <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
    <ModalHeader className='bg-transparent'  toggle={() => setShow(!show)}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <div className='text-center mb-2'>
        <h1 className='mb-1'>Edit Project</h1>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="updateform" >
          <ProjectFields control={control} errors={errors} setValue={setValue}/>
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

