// ** React Imports
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getContact } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// **  View Components
import ContactInfoCard from './ContactInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'

const ContactView = () => {
  // ** Store Vars
  const store = useSelector(state => state.contacts)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get lead on mount
  useEffect(() => {
    dispatch(getContact(parseInt(id)))
  }, [dispatch])

  //const [active, setActive] = useState('1')

  return store.selectedContact !== null && store.selectedContact !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <ContactInfoCard selectedContact={store.selectedContact} />
          
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>User not found</h4>
      <div className='alert-body'>
        User with id: {id} doesn't exist. Check list of all Users: <Link to='/apps/user/list'>Users List</Link>
      </div>
    </Alert>
  )
}
export default ContactView
