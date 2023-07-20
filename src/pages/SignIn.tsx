import styled from 'styled-components'
import kakaobutton from '../assets/kakao_login_medium_wide.png'

export const SignIn = () => {
  //배포할때 숨기기 //일단 테스트용으로 작성해놨습니다
  const REST_API_KEY = '14a02d3245a9eb48f2c0f540947d62bb'
  //일단 vits 기본 포트로 연결
  //배포후 배포주소로 다시 작성(카카오에서도 등록해야함)
  const REDIRECT_URI = 'http://127.0.0.1:5173/kakaoLogin'

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}
  `
  const handleSignIn = () => {
    window.location.href = KAKAO_AUTH_URL
  }
  return (
    <Wrapper>
      {/* 임시로 작성해놓음 디자인 잡히면 수정 */}
      <Logo>
        SAVEWALLET<p>가계구조대</p>
      </Logo>
      <KakaoButton onClick={handleSignIn}></KakaoButton>
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
  background-color: #f4f4f5;
`

const Logo = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #f15441;
  p {
    font-size: 18px;
    color: #000;
    text-align: center;
  }
  margin-bottom: 100px;
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
`
