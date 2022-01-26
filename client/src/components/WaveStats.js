import React from 'react'

import {
  Stat,
  StatLabel,
  StatNumber,
  StatGroup
} from '@chakra-ui/react'

const WaveStats = ({ count, winners, status }) => {
  return (
<StatGroup>
  <Stat>
    <StatLabel>Number of Waves</StatLabel>
    <StatNumber>{count}</StatNumber>
  </Stat>

  <Stat>
    <StatLabel>Number of Winners</StatLabel>
    <StatNumber>{winners}</StatNumber>
  </Stat>

  <Stat>
    <StatLabel>Status</StatLabel>
    <StatNumber>{status}</StatNumber>
  </Stat>
</StatGroup>
  )
}

export default WaveStats