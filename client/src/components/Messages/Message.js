import React from 'react';

import {
  Box, 
  UnorderedList,
  ListItem } from '@chakra-ui/react'

const Message = ({ obj }) => {
  return (
    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' p='5' my='5' spacing='3' w='80%'>
      <UnorderedList m='0' listStyleType='none'>
        <ListItem><strong>Address:</strong> {obj.address}</ListItem>
        <ListItem><strong>Time:</strong> {obj.timestamp.toString()}</ListItem>
        <ListItem><strong>Message:</strong> {obj.message}</ListItem>
      </UnorderedList>
    </Box>
  )
}

export default Message