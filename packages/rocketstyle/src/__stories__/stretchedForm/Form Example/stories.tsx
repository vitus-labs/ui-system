import React from 'react'
import { Form, TextInput, Submit } from '../form'

export default {
  component: Form,
  title: 'Stretched children',
}

export const formStretched = () => (
  <Form contentAlignX="stretch">
    <TextInput label="Username" input={{ name: 'username' }} meta={{}} />
    <TextInput label="Password" input={{ name: 'password' }} meta={{}} />
    <Submit label="Submit" />
  </Form>
)
