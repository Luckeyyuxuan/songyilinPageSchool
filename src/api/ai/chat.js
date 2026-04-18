import axios from 'axios'

export function chatWithAI(data) {
  return axios({
    url: '/api/ai/chat/completions',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ce92b8908b984d27b662358b2eb0cb77.u9nIMIEUx4ueQd8J'
    },
    data
  })
}
