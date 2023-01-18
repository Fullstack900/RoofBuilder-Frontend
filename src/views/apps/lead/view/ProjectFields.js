//import {useEffect} from 'react'
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, FormFeedback} from 'reactstrap'
import Select from 'react-select'
import { Controller } from 'react-hook-form'
import { selectThemeColors } from '@utils'
//import GoogleAddressSelect/*, {lookupPlaceById}*/ from './GoogleAddressSelect'
import SearchLocationInput from './GoogleAutoselect'

export default (props) => {
    const {control, errors, setValue} = props

    console.log('form errors', errors)

    /*
const onAddressPicked = (value) => {
    console.log(value)
    //lookupPlaceById(value.value)
}
*/

const statusOptions = [
    { value: 'Prospect', label: 'Prospect' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Estimated', label: 'Estimated' },
    { value: 'Waiting', label: 'Waiting' },
    { value: 'Contracted', label: 'Contracted' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Invoiced', label: 'Invoiced' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Dead', label: 'Dead' }
  ]

  const typeOptions = [
    { value: 'Roof Replacement', label: 'Roof Replacement' },
    { value: 'New Roof', label: 'New Roof' },
    { value: 'Roof Repair', label: 'Roof Repair' }
  ]

  const priorityOptions = [
    { value: 'Normal', label: 'Normal' },
    { value: 'Expedite', label: 'Expedite' }
  ]
  
  const paidByOptions = [
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Customer Cash', label: 'Customer Cash' },
    { value: 'Customer Financed', label: 'Customer Financed' }
  ]

  const getOptionValue = (arr, value) => {
    const rs = arr.filter(itm => itm.value === value)
    return rs
  }

    const SelectThemed = (props) => (
         <Select 
            className='react-select'
            classNamePrefix='select'
            theme={selectThemeColors}
            {...props}
        />)

    const updateAddress = (address/*, onChange*/) => {
        if (typeof address === 'string') {
            setValue('address_line_1', address)
        } else {
            setValue('address_line_1', address.street_address)
            setValue('city', address.city)
            setValue('state', address.state)
            setValue('zip', address.zip)
        }
    }

    return (
        <Row className='gy-1 pt-75'>
        <Col md={6} xs={12}>

            <div className='mb-1'>
                <Label className='form-label' for='client_name'>
                Project Name
                </Label>
                <Controller
                defaultValue=''
                control={control}
                id='client_name'
                name='client_name'
                render={({ field }) => (
                    <Input {...field} id='client_name' placeholder='' invalid={errors.client_name && true} />
                )}
                />
                {errors.client_name && <FormFeedback>{errors.client_name.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='job_name'>
                Job #
                </Label>
                <Controller
                defaultValue=''
                control={control}
                id='job_name'
                name='job_name'
                render={({ field }) => (
                    <Input {...field} id='job_name' placeholder='' invalid={errors.job_name && true} />
                )}
                />
                {errors.job_name && <FormFeedback>{errors.job_name.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='salesperson'>
                    Salesperson
                </Label>
                <Controller
                defaultValue=''
                control={control}
                id='salesperson'
                name='salesperson'
                render={({ field }) => (
                    <Input {...field} id='salesperson' placeholder='John' invalid={errors.salesperson && true} />
                )}
                />
                {errors.salesperson && <FormFeedback>{errors.salesperson.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='sale_state'>
                    Project Status
                </Label>
                <Controller
                control={control}
                name='sale_state'
                render={({ field:{value, name, onChange} }) => {
                    return (
                        <SelectThemed
                        name={name}
                        onChange={(newValue) => onChange(newValue.value)}
                        defaultValue={getOptionValue(statusOptions, value)}
                        options={statusOptions}
                        isClearable={false}
                        invalid={errors.sale_state && true}
                    />)
                    }
                }
                />
                {errors.sale_state && <FormFeedback>{errors.sale_state.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='type'>
                Project Type
                </Label>
                <Controller
                control={control}
                name='type'
                render={({ field:{value, name, onChange} }) => {
                    return (
                        <SelectThemed
                        name={name}
                        onChange={(newValue) => onChange(newValue.value)}
                        defaultValue={getOptionValue(typeOptions, value)}
                        options={typeOptions}
                        isClearable={false}
                        invalid={errors.type && true}
                    />)
                    }
                }
                />
                {errors.type && <FormFeedback>{errors.type.message}</FormFeedback>}
            </div>
          
            <div className='mb-1'>
                <Label className='form-label' for='priority'>
                Priority
                </Label>
                <Controller
                control={control}
                name='priority'
                render={({ field:{value, name, onChange} }) => {
                    return (
                        <SelectThemed
                        name={name}
                        onChange={(newValue) => onChange(newValue.value)}
                        defaultValue={getOptionValue(priorityOptions, value)}
                        options={priorityOptions}
                        isClearable={false}
                        invalid={errors.priority && true}
                    />)
                    }
                }
                />
                {errors.priority && <FormFeedback>{errors.priority.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='paidby'>
                    Paid by
                </Label>
                <Controller
                    control={control}
                    name='paidby'
                    render={({ field:{value, name, onChange} }) => {
                        return (
                            <SelectThemed
                            name={name}
                            onChange={(newValue) => onChange(newValue.value)}
                            defaultValue={getOptionValue(paidByOptions, value)}
                            options={paidByOptions}
                            isClearable={false}
                            invalid={errors.paidby && true}
                        />)
                        }
                    }
                />
                {errors.paidby && <FormFeedback>{errors.paidby.message}</FormFeedback>}
            </div>
          </Col>

          <Col md={6} xs={12}>
            <div className='mb-1'>
                <Label className='form-label' for='address_line_1'>
                    Address
                </Label>
                <Controller
                defaultValue=''
                control={control}
                id='address_line_1'
                name='address_line_1' // { onChange, onBlur, value, name, ref }
                render={({ field:{onChange, value, onBlur} }) => (
                    <SearchLocationInput 
                        placeholder='123 street' 
                        onChange={(value) => updateAddress(value, onChange)}
                        onBlur={onBlur}
                        value={value}
                    />
                    
                )}/>
                {errors.address_line_1 && <FormFeedback>{errors.address_line_1.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='address_line_2'>
                    Address2
                </Label>
                <Controller
                defaultValue=''
                control={control}
                id='address_line_2'
                name='address_line_2'
                render={({ field }) => (
                <Input
                {...field}
                type='address_line_2'
                id='address_line_2'
                placeholder=''
                />
                )}/>
                {errors.address_line_2 && <FormFeedback>{errors.address_line_2.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='city'>
                    City
                </Label>
                <Controller
                defaultValue=''
                control={control}
                id='city'
                name='city'
                render={({ field }) => (
                <Input
                {...field}
                type='city'
                id='city'
                placeholder=''
                />
                )}/>
                {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='state'>
                    State
                </Label>                
                <Controller
                defaultValue=''
                control={control}
                id='state'
                name='state'
                render={({ field }) => (
                    <Input {...field} id='state' placeholder='Ohio' />
                )}
                />
                {errors.state && <FormFeedback>{errors.state.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='zip'>
                    Zip
                </Label>                
                <Controller
                defaultValue=''
                control={control}
                id='zip'
                name='zip'
                render={({ field }) => (
                    <Input {...field} id='zip' placeholder='12345' />
                )}
                />
                {errors.zip && <FormFeedback>{errors.zip.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='description'>
                    Notes
                </Label>     
                <Controller
                defaultValue=''
                control={control}
                id='description'
                name='description'
                render={({ field }) => (
                    <Input type='textarea' {...field} id='description' placeholder='' />
                )}
                />
                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
            </div>
          </Col>
        </Row>
    )
}