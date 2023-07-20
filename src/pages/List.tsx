import React from 'react'
import ListItems from 'src/components/list/ListItems'
import { Footer } from 'src/components/common/index'
import { Month } from 'src/components/common/index'

export const List = () => {
  return (
    <>
      <Month></Month>
      <ListItems></ListItems>
      <Footer></Footer>
    </>
  )
}
