// import { Notify } from 'vant'

// export default Notify
import { Toast } from 'vant'
// export default Toast
export default ({ type, message }) => {
  if (type === 'danger') {
    type = 'fail'
  }
  Toast({
    type,
    message
  })
}
