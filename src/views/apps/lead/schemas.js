import * as yup from 'yup'

export const LeadCreateSchema = yup.object({

  job_name: yup.string().nullable().max(30).label('Job #'),
  client_name: yup.string().nullable().max(255).label('Project Name'),

  priority: yup.string().required().max(100).label('Priority'),
  salesperson: yup.string().required().max(100).label('Salesperson'),
  sale_state: yup.string().required().max(100).label('Project Status'),
  type: yup.string().required().max(100).label('Project Type'),
  paidby: yup.string().required().max(100).label('Paid By'),
  //financing: yup.string().required().max(100),

  address_line_1: yup.string().nullable().max(100).label('Address'),
  address_line_2: yup.string().nullable().max(50).label('Address 2'),
  city: yup.string().nullable().max(50).label('City'),
  state: yup.string().nullable().max(50).label('State'),
  zip: yup.string().nullable().max(20).label('Zip'),

  description: yup.string().nullable().max(20).label('Notes')
})

export const LeadUpdateSchema = yup.object({

    job_name: yup.string().nullable().max(30).label('Job #'),
    client_name: yup.string().nullable().max(255).label('Project Name'),
  
    priority: yup.string().required().max(100).label('Priority'),
    salesperson: yup.string().required().max(100).label('Salesperson'),
    sale_state: yup.string().required().max(100).label('Project Status'),
    type: yup.string().required().max(100).label('Project Type'),
    paidby: yup.string().required().max(100).label('Paid By'),
    //financing: yup.string().required().max(100),
  
    address_line_1: yup.string().nullable().max(100).label('Address'),
    address_line_2: yup.string().nullable().max(50).label('Address 2'),
    city: yup.string().nullable().max(50).label('City'),
    state: yup.string().nullable().max(50).label('State'),
    zip: yup.string().nullable().max(20).label('Zip'),
  
    description: yup.string().nullable().max(20).label('Notes')
  })
  
  export const MaterialCreateSchema = yup.object({
    materialList: yup.array().of(
      yup.object().shape({
        itemcode: yup.string().required("itemcode  required"),
        quantity: yup.number().required("Quantity required"),
        waste: yup.number().required("Waste required").label("waste")
       // color: yup.string().required("Color required")
      })
    )
  })