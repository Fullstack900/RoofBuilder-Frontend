// ** User List Component
//import Table from './Table'

import CardList from './CardList'
// ** Reactstrap Imports
import { Row, Col, Card, Button } from 'reactstrap'
// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import { useState } from 'react'
// ** Styles
import '@styles/react/apps/app-users.scss'
import CreateDialog from '../view/CreateDialog'
require('../view/styles.css')


const LeadsList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  return (
    <div className='app-lead-list'>
      <h2>Projects</h2>
            <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
              Add New Project
            </Button>
      <CardList/>
      <CreateDialog show={sidebarOpen} setShow={toggleSidebar}/>
    </div>
  )
}

export default LeadsList
