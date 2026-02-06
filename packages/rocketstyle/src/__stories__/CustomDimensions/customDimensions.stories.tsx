import Button from './component'

export default {
  component: Button,
  title: 'Custom dimensions',
}

export const customDimensions = () => (
  <>
    <Button secondary primary />
    <Button secondary />
    <Button color="primary" />
    <Button color="secondary" />
  </>
)
