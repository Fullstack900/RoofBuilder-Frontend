import { X } from 'react-feather'
const ToastContent = ({ t, title, content }) => {
    return (
      <div className='d-flex'>
        <div className='d-flex flex-column'>
          <div className='d-flex justify-content-between'>
            <h6>{title}</h6>
            <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
          </div>
          <span>{content}</span>
        </div>
      </div>
    )
  }

  export default ToastContent