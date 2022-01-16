import * as React from 'react'
import { Box, Flex, UnorderedList, ListItem } from '@chakra-ui/react'

const Footer = ({status, waves}) => { 
  return (
    <Flex h='30vh'>
      <Box w='100%' p={4}>
        <UnorderedList>
          <ListItem>Wave Count: {waves}</ListItem>
          <ListItem>Transaction Status: {status}</ListItem>
        </UnorderedList>
      </Box>
    </Flex>
  )
}

export default Footer