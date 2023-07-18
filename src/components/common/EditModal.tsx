import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { EditExpenseList, Expense } from 'src/api/EditList'

interface EditModalProps {
  closeModal: () => void
  expense: Expense
  onUpdateExpense: (updatedExpense: Expense) => void
}

export const EditModal: React.FC<EditModalProps> = ({
  closeModal,
  expense,
  onUpdateExpense
}) => {
  const [editedExpense, setEditedExpense] = useState<Expense>(expense)

  const handleChangeInputEditExpense = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target // input의 name
    setEditedExpense(prevExpense => ({
      ...prevExpense,
      [name]: value
    }))
  }

  const handleClickSaveButton = async () => {
    if (
      editedExpense.category.trim() === '' ||
      editedExpense.date.trim() === ''
    ) {
      alert('다시 입력해주세요.')
      return
    }

    const res = await EditExpenseList(editedExpense._id, editedExpense)
    if (typeof res !== 'boolean') {
      closeModal()
      onUpdateExpense(editedExpense)
    } else {
      alert('수정 실패')
    }
  }

  return (
    <ModalContainer>
      <ModalContent>
        <InputWrapper>
          <Title>금액:</Title>
          <input
            type="number"
            name="amount"
            value={editedExpense.amount}
            onChange={handleChangeInputEditExpense}
          />
        </InputWrapper>

        <InputWrapper>
          <Title>날짜:</Title>
          <input
            type="text"
            name="date"
            value={editedExpense.date}
            onChange={handleChangeInputEditExpense}
          />
        </InputWrapper>
        <InputWrapper>
          <Title>항목:</Title>
          <input
            type="text"
            name="category"
            value={editedExpense.category}
            onChange={handleChangeInputEditExpense}
          />
        </InputWrapper>
        <ButtonWrapper>
          <CancelButton onClick={closeModal}>취소</CancelButton>
          <SaveButton onClick={handleClickSaveButton}>저장</SaveButton>
        </ButtonWrapper>
      </ModalContent>
    </ModalContainer>
  )
}

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

const Title = styled.div`
  font-size: 16px;
  margin-right: 10px;
`

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  width: 300px;
  border-radius: 4px;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
`

const CancelButton = styled(Button)`
  margin-right: 10px;
`

const SaveButton = styled(Button)``
