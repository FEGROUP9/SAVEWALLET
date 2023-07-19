import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogoutIcon, LoginIcon } from '@heroicons/react/outline'
import { UserCircleIcon } from '@heroicons/react/solid'

export const SlideMenu = ({ isMenuOpen, handleCloseMenu }) => {
  const outside = useRef<any>()
  const navigate = useNavigate()
  const id = localStorage.getItem('id')

  const handleClickOutside = (e: any) => {
    if (!outside.current.contains(e.target)) {
      handleCloseMenu()
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleClickLogoutButton = () => {
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    navigate('/signin')
  }
  return (
    <MenuSlideBackground className={isMenuOpen ? 'open' : ''}>
      <MenuSlide
        className={isMenuOpen ? 'open' : ''}
        ref={outside}>
        <MenuItem className="user-info">
          <UserCircleIcon />
          <div className="info">
            {id ? <span>ID: {id}</span> : <span>로그인이 필요합니다.</span>}
          </div>
        </MenuItem>

        {id ? (
          <MenuItem className="logout">
            <LogoutIcon />
            <LogoutButton onClick={handleClickLogoutButton}>
              로그아웃
            </LogoutButton>
          </MenuItem>
        ) : (
          <MenuItem>
            <LoginIcon />
            <NavLink
              to="signin"
              className="login">
              로그인
            </NavLink>
          </MenuItem>
        )}
      </MenuSlide>
    </MenuSlideBackground>
  )
}

const MenuSlideBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  visibility: hidden;
  transition: 0.1s ease;
  &.open {
    visibility: visible;
  }
`

const MenuSlide = styled.div`
  width: 250px;
  height: 100%;
  position: absolute;
  left: -250px;
  top: 0;
  background-color: #fff;
  transition: 0.5s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.open {
    left: 0;
  }
`

const MenuItem = styled.div`
  width: 40%;
  height: 56px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &.user-info {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #f15441;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 48px;
      height: 48px;
      margin-right: 5px;
      color: #f15441;
      position: relative;
      left: 0;
    }
  }
  .login {
    text-decoration: none;
    color: #000;
    margin-left: 5px;
    &:hover {
      color: #f15441;
    }
  }
  svg {
    width: 24px;
    height: 24px;
    color: #7b7b7b;
  }
`

const LogoutButton = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 16px;
  &:hover {
    color: #f15441;
  }
`
