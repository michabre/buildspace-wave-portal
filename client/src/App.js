import * as React from "react"
import { 
  ColorModeScript, 
  useColorMode, 
  Box, 
  Button, 
  Container, 
  Flex, 
  VStack, 
  Heading, 
  Text } from '@chakra-ui/react'
import { ethers } from "ethers"
import theme from './theme'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import './App.css'

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode()

  const wave = () => {
    console.log('wave')
  }
  
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header mode={toggleColorMode} current={colorMode} />
      <Container maxW='container.md' h='60vh'>
        <Flex h='100%' align='center'>
          <Box>
            <VStack h='100%'>
          
              <Heading as='h2'>👋 Hey there!</Heading>

              <Box padding='4'>
                <Text fontSize='lg' align='center'>
                  My name is Michael and this my first Buildspace project. Connect your Ethereum wallet and wave at me!
                </Text>
              </Box>

              <Button onClick={wave}>
                Wave at Me
              </Button>

            </VStack>
          </Box>
        </Flex>
      </Container>
      <Footer />
    </>
  )
}
