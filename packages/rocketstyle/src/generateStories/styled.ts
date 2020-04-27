import { config } from '@vitus-labs/core'

export const InfoTable = config.styled(config.component)`
  padding: 20px;
  font-family: Roboto;
`

export const CodeExample = config.styled(config.component)`
  font-family: monospace;
  padding: 16px;
  border-radius: 4px;
  background-color: #F0FBFF;
  border: 1px solid #86DFFF;
  color: #0D5975;
`

export const OptionBlock = config.styled(config.component)`
  margin-bottom: 12px;
`

export const Title = config.styled(config.textComponent)`
  font-size: 36px;
`

export const H1 = config.styled(config.textComponent)`
  font-size: 28px;
  font-weight: medium;
`

export const H2 = config.styled(config.textComponent)`
  margin-bottom: 12px;
  font-size: 20px;
`

export const Text = config.styled(config.textComponent)`
  font-size: 12px;
`

export const NoAvailableOptions = config.styled(config.component)`
  display: inline-flex;
  font-size: 12px;
`

export const BadgeBox = config.styled(config.component)`
  padding: 8px 0;
  margin-bottom: 12px;
`

export const Badge = config.styled(config.component)`
  display: inline-flex;
  padding: 4px;
  margin-right: 4px;
  border-radius: 2px;
  font-size: 12px;
  color: #515151;
  background-color: #F4F4F4;
`
