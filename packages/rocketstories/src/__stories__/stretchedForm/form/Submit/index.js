import Button from '../../Button'

export default Button.attrs(({ isSubmitting }) => ({
  type: 'submit',
  label: 'Submit',
  primary: true,
  disabled: isSubmitting
}))
