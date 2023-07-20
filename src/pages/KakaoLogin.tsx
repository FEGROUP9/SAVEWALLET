import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

//배포할때 숨기기 //일단 테스트용으로 작성해놨습니다
const REST_API_KEY = '14a02d3245a9eb48f2c0f540947d62bb'
//일단 vits 기본 포트로 연결
//배포후 배포주소로 다시 작성(카카오에서도 등록해야함)
const REDIRECT_URI = 'http://127.0.0.1:5173/kakaoLogin'

const request = axios.create({
  baseURL: 'https://kauth.kakao.com',
  headers: {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

export const KakaoLogin = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const KAKAO_CODE = location.search.split('=')[1]

  const getToken = async () => {
    try {
      const { data } = await request.post(
        '/oauth/token',
        `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${KAKAO_CODE}`
      )
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        navigate('/')
      } else {
        navigate('/signin')
      }
      return data
    } catch (error) {
      console.warn(error)
      console.warn('fail')
      return false
    }
  }
  useEffect(() => {
    if (!location.search) return
    getToken()
  }, [])

  return <div>KakaoLogin</div>
}
