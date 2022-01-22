import * as React from 'react'
import { Box, Flex, UnorderedList, ListItem } from '@chakra-ui/react'

const Footer = () => { 
  return (
    <Flex h='30vh'>
      <Box w='100%' p={4}>
        <UnorderedList>
          <ListItem>Footer Link 1</ListItem>
          <ListItem>Footer Link 2</ListItem>
          <ListItem>Footer Link 3</ListItem>
        </UnorderedList>
      </Box>
    </Flex>
  )
}

export default Footer