import styled from 'styled-components'
import kakaobutton from '../assets/kakao_login_medium_wide.png'
import logo from '../assets/logo_gradi.png'
import { NavLink } from 'react-router-dom'

export const SignIn = () => {
  //배포할때 숨기기 //일단 테스트용으로 작성해놨습니다
  const REST_API_KEY = '14a02d3245a9eb48f2c0f540947d62bb'
  //일단 vits 기본 포트로 연결
  //배포후 배포주소로 다시 작성(카카오에서도 등록해야함)
  const REDIRECT_URI = 'http://127.0.0.1:3000/kakaoLogin'

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}
  `
  const handleSignIn = () => {
    window.location.href = KAKAO_AUTH_URL
  }
  return (
    <Wrapper>
      <Logo />
      <Title>SAVEWALLET</Title>
      <KakaoButton onClick={handleSignIn}></KakaoButton>
      <HomeButton to="/">돌아가기</HomeButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 2rem;
  background-color: #ededed;
`

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  background-image: url(${logo});
  background-size: contain;
`

const Title = styled.span`
  font-size: 24px;
  color: #2d2c2c;
  font-weight: bold;
  margin-bottom: 50px;
`

const KakaoButton = styled.div`
  width: 280px;
  height: 45px;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  background-color: #fee500;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #191919;
  background-image: url(${kakaobutton});
  margin-bottom: 10px;
`

const HomeButton = styled(NavLink)`
  box-sizing: border-box;
  width: 280px;
  height: 45px;
  background-color: transparent;
  border: 1px solid #6471e9;
  outline: none;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #362f2f;
  font-size: 14px;
  font-weight: 600;
`
