import * as React from 'react'
import {
  Button,
  Box,
  Flex,
  Heading,
  Spacer,
  Menu,
} from '@chakra-ui/react'

const Header = ({ mode, current }) => { 
  return (
      <Flex h='10vh'>
        <Box p='4'>
          <Heading as='h1' fontSize='20px'>Wave Portal</Heading>
        </Box>
        <Spacer />
        <Box p='4'>
          <Menu>
            <Button onClick={mode}>
            I prefer the&nbsp;<strong>{current}</strong>
            </Button>
          </Menu>
        </Box>
      </Flex>
  )
}

export default Header