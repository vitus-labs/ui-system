import React from 'react'
import List from './List'

export default {
  component: List,
  title: 'List',
}

export const button = () => (
  <>
    <List
      data={['a']}
      valueName="label"
      itemProps={(itemProps, extend) => ({ itemProps, ...extend })}
      // primary
    />
    <List />
  </>
)
