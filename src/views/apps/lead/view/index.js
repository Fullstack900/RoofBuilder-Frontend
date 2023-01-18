// ** React Imports
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getLead } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// **  View Components
import LeadInfoCard from './LeadInfoCard'

// ** Styles
import '@styles/react/apps/app-users.scss'

const LeadView = () => {
  // ** Store Vars
  const store = useSelector(state => state.leads)
  const dispatch = useDispatch()

  // ** Hooks
  const { id } = useParams()

  // ** Get lead on mount
  useEffect(() => {
    dispatch(getLead(id))
   // dispatch(getMaterials(id))
  }, [])

  //const [active, setActive] = useState('1')

  return store.selectedLead !== null && store.selectedLead !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='4' lg='5' xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <LeadInfoCard selectedLead={store.selectedLead} />
          
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      
    </Alert>
  )
}
export default LeadView
