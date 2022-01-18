import * as React from 'react'
import {
  Button,
  ButtonGroup,
  Box,
  Flex,
  Heading,
  Spacer
} from '@chakra-ui/react'

import { MoonIcon, SunIcon, StarIcon} from '@chakra-ui/icons'

const Header = ({ mode, current, account, connect }) => { 
  let icon = current === 'light' ? <SunIcon /> : <MoonIcon />
  return (
      <Flex h='10vh'>
        <Box p='4'>
          <Heading as='h1' fontSize='20px'>Wave Portal</Heading>
        </Box>
        <Spacer />
        <Box p='4'>
        <ButtonGroup variant='outline' spacing='2'>
          {!account && (
          <Button leftIcon={<StarIcon />} onClick={connect}>
            Connect
          </Button>
        )}
            <Button leftIcon={icon} onClick={mode}>
            I prefer the&nbsp;<strong>{current}</strong>
            </Button>
          </ButtonGroup>
        </Box>
      </Flex>
  )
}

export default Header