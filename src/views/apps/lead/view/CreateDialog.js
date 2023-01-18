
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import ProjectFields from './ProjectFields'
import {LeadCreateSchema} from '../schemas'
import { addLead} from '../store'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useYupValidationResolver } from '@hooks/useYupValidationResolver'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ToastContent from './toast'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

    const {show, setShow} = props

  const resolver = useYupValidationResolver(LeadCreateSchema)

  const defaultValues = {
    sale_state: 'Prospect',
    type: 'Roof Replacement',
    priority:'Normal',
    paidby:'Insurance'
  }

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
      const lead = await axios.post(`/api/projects`, data)
      dispatch(addLead(lead.data))

      toast(t => (<ToastContent t={t} title="Project Updated" content="Successfully created the project."/>))
      setShow(false)
      navigate(`/apps/lead/view/${lead.data._id}`)
    } catch (e) {
      if (e.response && e.response.status === 422) {
        for (const err in e.response.data.errors) {
          setError(err, { type: 'custom', message: e.response.data.errors[err][0] })
        }
        //console.log(e.response.data.errors)
      } else {
        toast(t => (<ToastContent t={t} title="Project Create Failed" content={e.response.message}/>))
      //  console.log(e)
      }
    }

  }

  return (
    <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
    <ModalHeader className='bg-transparent'  toggle={() => setShow(!show)}></ModalHeader>
    <ModalBody className='px-sm-5 pt-50 pb-5'>
      <div className='text-center mb-2'>
        <h1 className='mb-1'>Add Project</h1>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="updateform" >
          <ProjectFields control={control} errors={errors}  setValue={setValue}/>
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

