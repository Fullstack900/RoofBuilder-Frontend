// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getData } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
//import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'

// ** Utils
//import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
 // Label,
  Button,
 // CardBody,
 // CardTitle,
 // CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({  toggleSidebar}) => {
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
        >

          <div className='d-flex align-items-center table-header-actions'>
            <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
              Add New Contact
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const ContactsList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.contacts)

  // ** States
  const [sort, setSort] = useState('desc')
  //const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  //const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  //const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  //const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
   // dispatch(getAllData())
    dispatch(
      getData({
        sortDirection:sort,
        sortField:sortColumn,
        limitCount:rowsPerPage,
        skipCount: ((currentPage - 1) * rowsPerPage)
      //  q: searchTerm,
      //  page: currentPage
        //perPage: rowsPerPage//,
    //    role: currentRole.value,
  //      status: currentStatus.value,
   //     currentPlan: currentPlan.value
      })
    )
  }, [dispatch, store.data.length, sort, sortColumn, currentPage])

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      getData({
        sortDirection:sort,
        sortField:sortColumn,
        limitCount:rowsPerPage,
        skipCount: ((currentPage - 1) * rowsPerPage)
        //sort,
        //sortColumn,
       // q: searchTerm,
        //perPage: rowsPerPage,
        //page: page.selected + 1//,
       // role: currentRole.value,
       // status: currentStatus.value,
       // currentPlan: currentPlan.value
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        sort,
        sortColumn,
      //  q: searchTerm,
        perPage: value,
        page: currentPage//,
        //role: currentRole.value,
      //  currentPlan: currentPlan.value,
       // status: currentStatus.value
      })
    )
    setRowsPerPage(value)
  }
/*
    // ** Function in get data on search query change
    const handleFilter = val => {
      setSearchTerm(val)
      dispatch(
        getData({
          sort,
          q: val,
          sortColumn,
          page: currentPage,
          perPage: rowsPerPage,
          role: currentRole.value,
          status: currentStatus.value,
          currentPlan: currentPlan.value
        })
      )
    }*/
  
  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
    //  role: currentRole.value,
     // currentPlan: currentPlan.value,
    //  status: currentStatus.value,
   //   q: searchTerm
    }
console.log(store)
    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getData({
        sort,
        sortColumn,
       // q: searchTerm,
        page: currentPage
        //perPage: rowsPerPage//,
     //   role: currentRole.value,
      //  status: currentStatus.value,
     //   currentPlan: currentPlan.value
      })
    )
  }

  return (
    <Fragment>

      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                ///searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                //handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default ContactsList
