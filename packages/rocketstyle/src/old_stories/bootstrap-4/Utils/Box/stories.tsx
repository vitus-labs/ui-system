import React from 'react'
import Box from './'

export default {
  component: Box,
  title: 'BoxUtils',
}

export const examples = () => (
  <>
    <Box bgPrimary p2 m3 borderPrimary roundedTop>
      <div>Widn padding2 and margin3</div>
    </Box>

    <Box p2 m3 clearfix>
      <div>Widn padding2 and margin3</div>
    </Box>
  </>
)
