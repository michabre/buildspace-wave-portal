import React, { useEffect, useState } from "react"
import { 
  ColorModeScript, 
  useColorMode, 
  Box, 
  Button, 
  Container, 
  Flex, 
  VStack, 
  Heading, 
  Text,
  Textarea } from '@chakra-ui/react'
import { ethers } from "ethers"
import theme from './theme'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Message from "./components/Messages/Message"
import './App.css'

import abi from "./utils/WavePortal.json"

export default function App() {
  let provider;
  let signer;
  let wavePortalContract;

  const { colorMode, toggleColorMode } = useColorMode()
  const [currentAccount, setCurrentAccount] = useState("")
  const [waveCount, setWaveCount] = useState(0)
  const [status, setStatus] = useState("No active transaction")
  const [message, setMessage] = useState("")
  const [allWaves, setAllWaves] = useState([])

  const contractAddress = "0xf086a2c48982c47dB3292157bb104fF0bF913f01"
  const contractABI = abi.abi

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  })

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = provider.getSigner();
        wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber());
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {        
        let count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        setStatus('Mining in Progress...')

        await waveTxn.wait();
        setStatus('Mined')

        count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());
        setStatus('Completed')
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllWaves = async () => {
    const { ethereum } = window;
  
    try {
      if (ethereum) {
        const waves = await wavePortalContract.getAllWaves();
  
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });
  
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  /**
   * Listen in for emitter events!
   */
  useEffect(() => {  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const updateMessage = (event) => {
    let text = event.target.value
    setMessage(text)
  }
  
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header mode={toggleColorMode} current={colorMode} account={currentAccount} connect={connectWallet} />
      <Container maxW='container.md'>
        <Flex h='100%' align='center'>
          <Box>
            <VStack h='100%'>
          
              <Heading as='h2'>Hey there!</Heading>

              <Box padding='4'>
                <Text fontSize='lg' align='center'>
                  My name is Michael and this my first Buildspace project. Connect your Ethereum wallet and wave at me!
                </Text>
              </Box>

              <Box padding='4'>
              <Text mb='8px'>Add a message</Text>
              <Textarea
                value={message}
                onChange={updateMessage}
                placeholder='Here is a sample placeholder'
                size='lg'
              />
              </Box>

              <Button onClick={wave}>
                Wave at Me
              </Button>

            </VStack>
          </Box>
        </Flex>
      </Container>
      <Container maxW='container.md' align='center'>
        <VStack h='100%'>
          <Heading as='h3' size='lg'>Waves</Heading>
          {allWaves.map((wave, index) => {
            return (
              <Message obj={wave} key={index} /> 
              )
          })}
        </VStack>
      </Container>
      <Footer status={status} waves={waveCount} />
    </>
  )
}
