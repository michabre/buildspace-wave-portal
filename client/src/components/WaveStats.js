import React from 'react'

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'

const WaveStats = ({ count, reward, status }) => {
  return (
<StatGroup>
  <Stat>
    <StatLabel>Number of Waves</StatLabel>
    <StatNumber>{count}</StatNumber>
  </Stat>

  <Stat>
    <StatLabel>Rewarded</StatLabel>
    <StatNumber>{reward} ETH</StatNumber>
  </Stat>

  <Stat>
    <StatLabel>Status</StatLabel>
    <StatNumber>{status}</StatNumber>
  </Stat>
</StatGroup>
  )
}

export default WaveStats