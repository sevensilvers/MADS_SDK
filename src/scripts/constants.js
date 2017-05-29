import {getParameterByName} from './utils.js'

export default {
  json: getParameterByName('json'),
  custTracker: getParameterByName('custTracker'),
  fet: getParameterByName('fet'),
  ct: getParameterByName('ct'),
  cte: getParameterByName('cte'),
  tags: getParameterByName('tags')
}
