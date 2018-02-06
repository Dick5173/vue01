import Axios from 'axios'
import qs from 'qs'

export const getDraftList = () => {
  return Axios.get(`/admin/audit/draft`)
}
export const getTemplateList = () => {
  return Axios.get(`/admin/audit/template`)
}
export const AddDraftToTemplate = (id) => {
  let formData = {
    draft_id: id
  }
  return Axios.post(`/admin/audit/draft/totemplate`, qs.stringify(formData))
}
