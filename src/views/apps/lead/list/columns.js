// ** React Imports
import { Link } from 'react-router-dom'
//import {Moment}
import moment from "moment"

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
//import { store } from '@store/store'
//import { getUser, deleteUser } from '../store'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export const columns = [
  {
    name: 'Job #',
    minWidth: '138px',
    minHeight:'260px',
    sortable: true,
    sortField: 'job_name',
    selector: row => row.job_name,
    cell: row => <div>{row.job_name} </div>
  },
  {
    name: 'Project Name',
    minWidth: '138px',
    minHeight:'260px',
    sortable: true,
    sortField: 'client_name',
    selector: row => row.client_name,
    cell: row => <div>{row.client_name}</div>
  },
  {
    name: 'Address',
    minWidth: '138px',
    minHeight:'260px',
    sortable: true,
    sortField: 'address_line_1',
    selector: row => row.address_line_1,
    cell: row => <div><ul><li>{row.address_line_1}</li><li>{row.city}, {row.state} {row.zip}</li></ul></div>
  },
  {
    name: 'Date Created',
   // minWidth: '230px',
    sortable: true,
    sortField: 'created_at',
    selector: row => row.created_at,
    cell: row => <span className='text-capitalize'> 
                    {moment(row.created_at).utc().format('YYYY-MM-DD')}
                  </span>
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: row => (
      <div className='column-action'>
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag={Link}
              className='w-100'
              to={`/apps/lead/view/${row.id}`}
              onClick={() => store.dispatch(getLead(row.id))}
            >
              <FileText size={14} className='me-50' />
              <span className='align-middle'>Details</span>
            </DropdownItem>            <DropdownItem
              ///tag={Link}
              //className='w-100'
              //to={`/apps/lead/view/${row.id}`}
              //onClick={() => store.dispatch(getUser(row.id))}
            >
              <a href={`/tools/measure_map.html?project=${row.id}`}>Measure {`/tools/measure_map.html?project=${row.id}`}</a>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }
]
