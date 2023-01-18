// ** React Imports
import { useState, Fragment } from 'react'
//import { useSelector } from 'react-redux'
import {useDispatch} from 'react-redux'
// ** Invoice List Sidebar
import SidebarNewContacts from '../../contact/list/Sidebar'
// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'
// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** measurement sidebar
import MeasureModal from './MeasureModal'
// ** Custom Components
//import Avatar from '@components/avatar'
//import MaterialsCard from './MaterialsCard'
import moment from "moment"
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
require('./styles.css')
// const ot = require('../order_templates.json')
const MySwal = withReactContent(Swal)

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTape, faSatellite, faGear, faNoteSticky, faExclamation, faFilePdf, faList} from '@fortawesome/free-solid-svg-icons'
import UpdateDialog from './UpdateDialog'
import axios from 'axios'
import { updateLead} from '../store'
import MaterialListDialog from './MaterialListDialog'
import ErrorBoundary from '../../../components/ErrorBoundary'

const LeadInfoCard = ({ selectedLead }) => {
      const dispatch = useDispatch()

      const [showUpdate, setShowUpdate] = useState(false)
      const [sidebarOpen, setSidebarOpen] = useState(false)
      //const [showCreateMaterials, setShowCreateMaterials] = useState(false)
      const [showMaterialsDialog, setShowMaterialsDialog] = useState(false)

      //const store = useSelector(state => state.leads)
      //const [showUpdateMaterials, setShowUpdateMaterials] = useState(false)

      //const [templates, setTemplates] = useState(null)
      //const [itemTemplates] = useState([])

      const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

      const [contactSidebarOpen, setContactSidebarOpen] = useState(false)
      const toggleContactSidebar = () => setContactSidebarOpen(!contactSidebarOpen)

      const setShowMaterials = async () => {
        console.log('selectedLead', selectedLead)
        if (!selectedLead?.materialList?.measureProductMap) {
          console.log('Autofilling Materials')
          await axios.post(`/api/projects/${selectedLead._id}/calc-materials`)
          const lead = await axios.get(`/api/projects/${selectedLead._id}`)
          await dispatch(updateLead(lead.data))
        }
        setShowMaterialsDialog(true)
      }

      /*
      const get_item_templates = async () => {
        const resp = await axios.get('/api/json/template_items')
        const it = resp.data
        setItemTemplates(it)
      }

//const materials = []
      useEffect(() => {
        //get_templates()
        if (store.materialsList) {
          //console.log(store.materialsList)
//materials = store.materialsList
        }
      }, [])
console.log(selectedLead)
*/

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div>
          
            <h2>
              <FontAwesomeIcon icon={faGear} />
              <span style={{marginLeft:"20px"}}>
            {selectedLead.client_name}
            </span>
              <span style={{display: (selectedLead.description && selectedLead.description.length !== 0) ? "inline" : "none", marginLeft:"20px"}} >
            <FontAwesomeIcon icon={faNoteSticky} /></span>
            <span style={{display: selectedLead.priority === "Expedite" ? "inline" : "none", color:"red", marginLeft:"20px"}} >
            <FontAwesomeIcon icon={faExclamation} /></span>
 
            <span>
            </span>
            <FontAwesomeIcon icon={faPencil} onClick={() => setShowUpdate(true)} style={{float:"right"}}/>
            </h2>
            
            <div>
            {selectedLead.job_name}
            
            </div>
            <div>
            {selectedLead.salesperson}
            <span style={{float:"right"}}>
            {selectedLead.sale_state}
            </span>
            </div>
            <div style={{textAlign:"right"}}>
              <span>{selectedLead.type}</span><span> - </span>
              <span>{selectedLead.paidby}</span><span> </span>
              <span style={{display:"none"}} >$0.00 put value here</span>
            </div>
            <a className='maplink' target="_blank" href={`http://maps.google.com/?q=${selectedLead.address_line_1}, ${selectedLead.city}, ${selectedLead.state}, ${selectedLead.zip}`} >
             {selectedLead.address_line_1}<br/>
             {selectedLead.address_line_2} { selectedLead.address_line_2 ? <br/> : ''}
              {selectedLead.city}, {selectedLead.state} {selectedLead.zip}
            </a>
            <span style={{position:"absolute", right:"20px", bottom:"20px"}}>Created<br/>{moment(selectedLead.created_at).utc().format('M/D/YYYY')}</span>
          </div>
          </CardBody></Card>
          <Card onClick={toggleSidebar}>
            <CardBody>
          <h2>
          <FontAwesomeIcon icon={faTape}  /> Measurements
          <span style={{display: selectedLead.measure?.pdf_file ? "inline" : "none", color:"black", marginLeft:"20px"}} >
            <a href={selectedLead.measure?.tempmap}><FontAwesomeIcon icon={faFilePdf} /></a>
            </span>

          <FontAwesomeIcon icon={faPencil}  style={{float:"right"}}/>
          <a style={{float:"right"}} href={`/tools/measure_map.html?project=${selectedLead._id}`}>
          <FontAwesomeIcon icon={faSatellite} /></a>
          
          </h2>

          </CardBody></Card> 

          
          <Card>
            <CardBody>
            <h2>
              <FontAwesomeIcon icon={faList} /> Materials
              <FontAwesomeIcon icon={faPencil} onClick={() => setShowMaterials()} style={{float:"right"}}/>
            </h2>
            </CardBody>
          </Card> 

          <MaterialListDialog visible={showMaterialsDialog} onClose={() => setShowMaterialsDialog(false)} project={selectedLead} key={selectedLead._id}/>

          <UpdateDialog show={showUpdate} setShow={setShowUpdate}/>
      <SidebarNewContacts Sidebar open={contactSidebarOpen} toggleSidebar={toggleContactSidebar} jobId={selectedLead._id} />
      <ErrorBoundary>
        <MeasureModal open={sidebarOpen} toggleSidebar={toggleSidebar} measurement={selectedLead.measurement}/>
      </ErrorBoundary>

    </Fragment>
  )
}

export default LeadInfoCard