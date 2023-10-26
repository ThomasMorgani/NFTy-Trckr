import axios from 'axios'
import axiosThrottle from 'axios-request-throttle'

axiosThrottle.use(axios, { requestsPerSecond: 3 })

//TODO:
//CREATE METHOD TO CREATE REQUESTS
//SET DEFAULTS HERE, PASS IN PARAMSDS AND HEADERS

export default axios
