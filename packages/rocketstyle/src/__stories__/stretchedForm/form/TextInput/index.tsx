import React from 'react'
import FormGroup from '../FormGroup'
import InputGroup from '../InputGroup'
import FormText from '../FormText'
import Label from '../Label'
import Input from '../Input'
import InputIcon from '../InputIcon'

// const RESERVED_WORDS = [
//   'readOnly',
//   'disabled',
//   'required',
//   'onChange',
//   'onBlur',
//   'onFocus',
//   'maxLength',
//   'value',
//   'placeholder',
// ]

const renderPseudoContent = ({ beforeContent, icon, identifier }) => {
  if (beforeContent) {
    return beforeContent({ identifier })
  }

  if (icon) {
    return <InputIcon htmlFor={identifier} name={icon} />
  }

  return null
}

const __id = +new Date()

export default ({
  icon,
  beforeContent,
  id,
  label,
  placeholder,
  name,
  input,
  type,
  readOnly,
  disabled,
  required,
  meta,
  // ...props
}) => {
  const identifier = id || `${input.name}-${__id}`
  const { touched, error } = meta

  return (
    <FormGroup>
      {label && <Label htmlFor={identifier}>{label}</Label>}
      <InputGroup
        beforeContent={renderPseudoContent({ identifier, icon, beforeContent })}
        beforeContentCss={(css) => css`
          ${({ theme: t }) => css`
            margin-left: ${t.spacing.xs}px;
            margin-right: ${t.spacing.xs}px;
          `};
        `}
      >
        <Input
          name={name}
          id={identifier}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          {...input}
        />
      </InputGroup>
      {touched && error && <FormText invalid={!!error}>{error}</FormText>}
    </FormGroup>
  )
}
