import styled from 'styled-components'

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`
const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  width: 300px;
  line-height: 45px;
  border-radius: 6px;
`

const Button = styled.button`
  background-color: transparent;
  border: 1px solid #c4c4c4;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
`

const CancelButton = styled(Button)`
  padding: 3px 15px;
  margin-right: 10px;
`
export const ViewLogs = ({ closeModal }) => {
  return (
    <ModalContainer>
      <ModalContent>
        <CancelButton onClick={closeModal}>취소</CancelButton>
      </ModalContent>
    </ModalContainer>
  )
}
