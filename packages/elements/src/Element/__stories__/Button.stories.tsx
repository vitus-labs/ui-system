import Button from './Button'

storiesOf('ELEMENTS | Element', module).add('Button', () => {
  return (
    <>
      <Button gap={[10, 20]} />
      <Button gap={[10, 20]} block={[true, true, false]} />
    </>
  )
})
