import type { VFC } from 'react'

type Props = {
  label: string
}

const component: VFC<Props> = ({ label }) => <div>{label}</div>

component.displayName = 'NormalComponent'

export default component
