import React, { useState } from 'react'
import styled from 'styled-components'
import { DeleteExpenseList } from 'src/api/DeleteList'

interface DeleteExpenseProps {
  expenseId: string
  onDelete: () => void
}

export const DeleteExpense: React.FC<DeleteExpenseProps> = ({
  expenseId,
  onDelete
}) => {
  const handleDelete = async () => {
    const deleteSuccess = await DeleteExpenseList(expenseId)
    if (deleteSuccess) {
      onDelete()
    } else {
      alert('삭제 실패')
    }
  }

  return (
    <div>
      <button onClick={handleDelete}>삭제</button>
    </div>
  )
}
