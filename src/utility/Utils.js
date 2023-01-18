import { DefaultRoute } from '../router/routes'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return DefaultRoute
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})


/**
 ** function determines the quantity needed base on category and product type
 * @param {Object} product Object with category and product code
 */
export const calculateQuantity = (product, measurement) => {
     
    let quantity = 0
     switch (product.category) {
      case 'Shingles':
        quantity = (measurement.pitch_3 / 33) //bundle uom        
        break
        case 'Underlayment':
          quantity = (measurement.area / 400) 
          break
        case 'Hip and Ridge':
        quantity = (measurement.hip + measurement.ridge) / 30 
        break         
        case 'Starter':
          quantity = (measurement.hip + measurement.ridge) / 100 
          break
        case 'Drip Edge':
          quantity = measurement.rake > 0 ? Math.round((measurement.rake + 5) / 10) : 0
          break
        case 'Gutter Apron':
          quantity = measurement.eave > 0 ? Math.round((measurement.eave + 5) / 10) : 0
          break
        case 'W-Valley':
          quantity = (measurement.valley) / 10
          break
        case 'Ice and Water':
          quantity = (measurement.eave) / 66
          break
        case 'Other':
          if (product.itemCode.search("SA CAP 1 SQ") > 0) {
            quantity = measurement.low_pitch / 100 
            break
          }     
          if (product.itemCode.search("PLYBASE 2 SQ") > 0) {
            quantity = measurement.low_pitch / 200 
            break
          }            
          quantity = measurement.area / 200
          break
        case 'Coil Nails':
          quantity = measurement.area / 1800
          break
        case 'Plastic Caps':
          quantity = measurement.area / 2500
          break
        case 'Pipe Flashing ':
          break
        case 'Vents':
          if (product.itemCode.search("VENT W/NAILS 12") > 0) {
            quantity = Math.floor(measurement.ridge / 4) 
            break
          }  
          if (product.itemCode.search('TOP SHIELD ALUMINUM 750 VENT 8') > -1) {
            quantity = measurement.boxvent
            break
          }
          quantity = 0
          break
        case 'Other Fasteners':
          //const ridge = myArray.find(item => {
           // if (item.itemCode.search('SHIELD ALUMINUM 750 VENT')) {   
           //   return true
           // }
            //return false
         // })
            //console.log(ridge)
        case 'Caulk':
          quantity = 1
          break
          case 'Pipe Flashing':
            quantity = 0
            if (product.itemCode.search('PIPE FLASHING 1"') > -1) { 
             // console.log(product.itemCode)
             // console.log(measurement.pipeboot3)
             quantity = measurement.pipeboot3
             break
            } else
            if (product.itemCode.search('PIPE FLASHING 3"') > -1) { 
             // console.log(product.itemCode)
             // console.log(measurement.pipeboot4)
              quantity = measurement.pipeboot4
              break
              }
              
              break
        case 'Other Flashing Metal':   
        case 'Decking':           
          //return (measurement.ridge > 0 ? 1 : 0)
     }
 // console.log()
     return quantity

    
}