import React from 'react'
import List from './List'

export default {
  component: List,
  title: 'List',
}

export const button = () => (
  <>
    <List />
    <List primary />
  </>
)
