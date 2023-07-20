import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
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
  const [selectAmount, setSelectAmount] = useState(true)

  useEffect(() => {
    setSelectAmount(expense.amount >= 0)
  }, [expense])

  const handleClickAmount = (isExpense: boolean) => {
    setSelectAmount(isExpense)

    setEditedExpense(prevExpense => ({
      ...prevExpense,
      amount: isExpense
        ? Math.abs(prevExpense.amount)
        : -Math.abs(prevExpense.amount)
    }))
  }

  const handleChangeInputEditExpense = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditedExpense(prevExpense => ({
      ...prevExpense,
      [name]: value
    }))
  }

  const handleChangeAccountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEditedExpense(prevExpense => ({
      ...prevExpense,
      account: value
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
      alert('수정 성공')
    } else {
      alert('수정 실패')
    }
  }

  return (
    <ModalContainer>
      <ModalContent>
        <AmountSelect>
          <Title>분류:</Title>
          <AmountButton
            onClick={() => handleClickAmount(true)}
            className={selectAmount ? 'active' : ''}>
            수입
          </AmountButton>
          <AmountButton
            onClick={() => handleClickAmount(false)}
            className={selectAmount ? '' : 'active'}>
            지출
          </AmountButton>
        </AmountSelect>
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
          <Title>사용:</Title>
          <input
            className="account-input"
            type="text"
            onChange={handleChangeAccountInput}
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
          <select
            name="category"
            onChange={handleChangeInputEditExpense}
            value={editedExpense.category} // 기본값 설정
          >
            <option value="카테고리">카테고리</option>
            <option value="식비">식비</option>
            <option value="생활/건강">생활/건강</option>
            <option value="쇼핑">쇼핑</option>
            <option value="교통">교통</option>
            <option value="주거/통신">주거/통신</option>
            <option value="금융">금융</option>
            <option value="문화/여가">문화/여가</option>
            <option value="교육/학습">교육/학습</option>
            <option value="자녀/육아">자녀/육아</option>
            <option value="경조/선물">경조/선물</option>
          </select>
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
  border-radius: 10px;
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

  select {
    width: 100px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`

const AmountSelect = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
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
  border-radius: 5px;
`

const CancelButton = styled(Button)`
  margin-right: 10px;
`

const SaveButton = styled(Button)``

const AmountButton = styled(Button)`
  &.active {
    border: 2px solid #f15441;
  }
`