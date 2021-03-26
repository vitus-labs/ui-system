import React from 'react'
import theme from './themeDecorator'
import { Form, TextInput, Submit } from './form'

export default {
  component: Form,
  title: 'Stretched children',
  decorators: [theme],
}

export const formStretched = () => (
  <Form contentAlignX="block">
    <TextInput label="Username" input={{ name: 'username' }} />
    <TextInput label="Password" input={{ name: 'password' }} />
    <Submit label="Submit" />
  </Form>
)
