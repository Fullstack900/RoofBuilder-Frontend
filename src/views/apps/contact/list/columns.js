// ** React Imports
import { Link } from 'react-router-dom'
//import {Moment}
//import moment from "moment"

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
    name: 'Name',
    minWidth: '138px',
    minHeight:'260px',
    sortable: true,
    sortField: 'first_name',
    selector: row => row.first_name,
    cell: row => <div><ul><li>{row.first_name} {row.last_name}</li><li>{row.address_line_1}</li><li>{row.city}, {row.state} {row.zip}</li></ul></div>
  },
  {
    name: 'Mobile Phone',
   // minWidth: '230px',
    sortable: true,
    sortField: 'mobile_phone',
    selector: row => row.mobile_phone,
    cell: row => <span className='text-capitalize'> 
                    {row.mobile_phone}
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
              to={`/apps/contact/view/${row.id}`}
              //onClick={() => store.dispatch(getUser(row.id))}
            >
              <FileText size={14} className='me-50' />
              <span className='align-middle'>Details</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }
]
