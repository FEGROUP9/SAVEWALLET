import React from 'react'
import ListItems from 'src/components/list/ListItems'
import styled from 'styled-components'
import Month from 'src/components/common/Month'

export const List = () => {
  return (
    <>
      <div>List</div>
      <Month></Month>
      <ListItems></ListItems>
    </>
  )
}
