import {networkAction, errorPopup} from '..'
import {firebaseSavedItem} from '../../functions'
import myAxios from '../../config/axios'
import {itemNameHuman} from '../../data/valid-api-calls'
import {getItem} from './get-item'

export function deleteItem (itemType, item, data) {
  return async (dispatch, getState) => {
    if (itemNameHuman.hasOwnProperty(itemType)) {
      dispatch(networkAction(1, 'delete ' + itemType))
      try {
        await myAxios.delete('/' + itemType + '/' + item, data)
        dispatch(getItem(itemType, 'all'))
        firebaseSavedItem('all', itemType)
        return true
      } catch (e) {
        try {
          const reply = typeof e.response.data.response !== 'undefined' && e.response.data.response.length > 0 ? e.response.data.response : 'Kunde inte utföra åtgärden.'
          const err = typeof e.response.data.error !== 'undefined' && e.response.data.error.length > 0 ? e.response.data.error : 'Okänt eller inget svar från API.'
          const text = reply === err ? reply : reply + '\n' + err
          dispatch(errorPopup({visible: true, message: text, suppressed: false}))
          return false
        } catch (e) {
          dispatch(errorPopup({visible: true, message: 'Kunde utföra åtgärden.\nOkänt eller inget svar från API.', suppressed: false}))
          return false
        }
      } finally {
        dispatch(networkAction(0, 'delete ' + itemType))
      }
    } else {
      dispatch(errorPopup({visible: true, message: 'En felaktigt formaterad förfrågan till APIt har blockerats', suppressed: false}))
      return false
    }
  }
}
