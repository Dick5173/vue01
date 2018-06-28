import Axios from 'axios'
import * as AliyunApi from 'src/api/aliyun'

export const uploadImage = async (blob, fileName) => {
  const uploadToken = await AliyunApi.getOssToken()
  const uploadHost = uploadToken.host
  const formData = new FormData()
  // 参数
  formData.append('OSSAccessKeyId', uploadToken.accessid)
  formData.append('policy', uploadToken.policy)
  formData.append('signature', uploadToken.signature)
  formData.append('key', `${uploadToken.path}/${encodeURIComponent(fileName)}`)
  formData.append('success_action_status', 200)
  // 图片数据
  formData.append('file', blob)
  const ossUrl = `${uploadHost}/${uploadToken.path}/${encodeURIComponent(fileName).replace(/%/g, '%25')}`
  await Axios.post(uploadHost, formData)
  return ossUrl
}

export const imageBase64toBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {type: mimeString})
}
