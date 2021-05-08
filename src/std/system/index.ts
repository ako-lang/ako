import log from './print'
import sleep from './sleep'
import ask from './ask'
import mem from './store'

export default {...log, ...sleep, ...ask, ...mem}
