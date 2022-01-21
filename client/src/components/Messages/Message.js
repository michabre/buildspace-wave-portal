import React from 'react';

import {
  Box, 
  UnorderedList,
  ListItem } from '@chakra-ui/react'

const Message = ({ obj }) => {
  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' p='5' spacing='3'>
      <UnorderedList m='0' listStyleType='none'>
        <ListItem>Address: {obj.address}</ListItem>
        <ListItem>Time: {obj.timestamp.toString()}</ListItem>
        <ListItem>Message: {obj.message}</ListItem>
      </UnorderedList>
    </Box>
  )
}

export default Message