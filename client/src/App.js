import React, { useEffect, useState } from "react"
import { 
  ColorModeScript, 
  useColorMode, 
  Box, 
  Button, 
  Center,
  Container, 
  Flex, 
  HStack,
  VStack, 
  Heading, 
  Text,
  Textarea } from '@chakra-ui/react'
import { ethers } from "ethers"
import theme from './theme'
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Message from "./components/Messages/Message"
import Notification from "./components/Notification/Notification"
import './App.css'

import abi from "./utils/WavePortal.json"
import WaveStats from "./components/WaveStats"

export default function App() {
  let provider;
  let signer;
  let wavePortalContract;

  const { colorMode, toggleColorMode } = useColorMode()
  const [currentAccount, setCurrentAccount] = useState("")
  const [waveCount, setWaveCount] = useState(0)
  const [winners, setWinners] = useState(0)
  const [status, setStatus] = useState("No active transaction")
  const [message, setMessage] = useState("")
  const [allWaves, setAllWaves] = useState([])
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationLevel, setNotificationLevel] = useState("")

  const contractAddress = "0x2fAeAbf1d75Ba9ede445D833aAB1bdbc76E06F23"
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
        return;
      } else {        
        provider = new ethers.providers.Web3Provider(ethereum);
        signer = provider.getSigner();
        wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        let numberOfWinners = await wavePortalContract.getNumberOfWinners();
        setWaveCount(count.toNumber());
        setWinners(numberOfWinners.toNumber());
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account)
      } else {
        setNotificationMessage("No authorized account found")
        setNotificationLevel("warning")
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
        setNotificationMessage("No wallet found. Get MetaMask!")
        setNotificationLevel("warning")
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
        let numberOfWinners = await wavePortalContract.getNumberOfWinners();

        if (waveTxn.events === true) {
          let prizeAwarded = waveTxn.events.PrizeAwarded;
          let values = prizeAwarded.returnValues;
          console.log(values);
        }

        setWinners(numberOfWinners.toNumber());
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
      <Container maxW='container.md' pt='10'>
        <Flex h='100%' align='center'>
          <Box>
            <VStack h='100%'>
              {notificationMessage && <Notification level={notificationLevel} message={notificationMessage} />}
              <Heading as='h2' fontSize='5xl'>Hello</Heading>
              <Box padding='4'>
                <Text fontSize='lg' align='center'>
                  My name is Michael and this my first Buildspace project. Connect your Ethereum wallet and wave at me!
                </Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>

      <Container maxW='container.md' py='10'>
        <Flex h='100%' align='center'>
          <Box w='100%'>
            <HStack spacing='24px'>
              <Box w='70%'>
                <Textarea
                  value={message}
                  onChange={updateMessage}
                  placeholder='Write a message and send a wave.'
                  size='lg'
                />
              </Box>
              <Box>
              <Button onClick={wave}>
                  Send
                </Button>
              </Box>
            </HStack>
          </Box>
        </Flex>
      </Container>

      <Container maxW='container.md' py='5' borderTopWidth='1px' borderBottomWidth='1px' borderColor='gray.400'>
        <Box w='100%'>
          <WaveStats count={waveCount} winners={winners} status={status} />
        </Box>
      </Container>

      <Container maxW='container.md' py='10'>
        <Box>
          <Heading as='h3' size='lg' align='center'>List of Waves</Heading>
          {allWaves.map((wave, index) => {
            return (
              <Center>
                <Message obj={wave} key={index} />
              </Center>   
            )
          })}
        </Box>  
      </Container>

      <Footer />
    </>
  )
}
