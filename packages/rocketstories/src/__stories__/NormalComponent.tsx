import type { FC } from 'react'

type Props = {
  label: string
}

const component: FC<Props> = ({ label }) => <div>{label}</div>

component.displayName = 'NormalComponent'

export default component
