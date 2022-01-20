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
  UnorderedList,
  ListItem,
  Text,
  Textarea } from '@chakra-ui/react'
import { ethers } from "ethers"
import theme from './theme'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

import './App.css'

import abi from "./utils/WavePortal.json"

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [currentAccount, setCurrentAccount] = useState("")
  const [waveCount, setWaveCount] = useState(0)
  const [status, setStatus] = useState("No active transaction")
  const [message, setMessage] = useState("")
 
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0xBbB76b5A5E04Aa7552Cbd1a5B41B357E2bc216A7"
  const contractABI = abi.abi

    /*
  * This runs our function when the page loads.
  */
    useEffect(() => {
      checkIfWalletIsConnected();
      getAllWaves();
    }, [])

    useEffect(() => {
      console.log('runs after every component update', waveCount)
    }, [waveCount])

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

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
        console.log("Found an authorized account:", account);
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

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }



  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);
        setStatus('Mining in Progress...')

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setStatus('Mined')

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber());
        setStatus('Completed')
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

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
              <Box borderWidth='1px' borderRadius='lg' overflow='hidden' key={index} p='5' spacing='3'>
                <UnorderedList m='0' listStyleType='none'>
                  <ListItem>Address: {wave.address}</ListItem>
                  <ListItem>Time: {wave.timestamp.toString()}</ListItem>
                  <ListItem>Message: {wave.message}</ListItem>
                </UnorderedList>
              </Box>)
          })}
        </VStack>
      </Container>
      <Footer status={status} waves={waveCount} />
    </>
  )
}
