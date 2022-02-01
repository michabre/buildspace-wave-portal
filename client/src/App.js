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
  Input, 
  Text,
  Textarea } from '@chakra-ui/react'
import { ethers } from "ethers"
import { getDaySent, getTimeSent } from "./helpers/timestampConverters"

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
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [allWaves, setAllWaves] = useState([])
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationLevel, setNotificationLevel] = useState("")

  const contractAddress = "0xB3313C525869b88B995aC6435DC6c2874C09e3d0"
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

        const waveTxn = await wavePortalContract.wave(username, message);
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

        console.log(waveTxn);

        setWinners(numberOfWinners.toNumber());
        setStatus('Completed')
        setUsername("")
        setMessage("")

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
      if (!ethereum) {
        return;
      } else {
        const waves = await wavePortalContract.getAllWaves();
        const wavesCleaned = waves.map(wave => {
          return {
            username: wave.username,
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });
  
        setAllWaves(wavesCleaned);
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

    const onPrizeAwarded = (name, user, time, note) => {
      setNotificationMessage(`Winner Winner Chicken Dinner! Congratulations ${name}! You won a prize!`)
      setNotificationLevel("success")
    }
  
    if (window.ethereum) {
      wavePortalContract.on("NewWave", onNewWave)
      wavePortalContract.on("PrizeAwarded", onPrizeAwarded)
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave)
        wavePortalContract.off("PrizeAwarded", onPrizeAwarded)
      }
    };
  }, [wavePortalContract]);

  const updateMessage = (event) => {
    let text = event.target.value
    setMessage(text)
  }

  const updateUsername = (event) => {
    let text = event.target.value
    setUsername(text)
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
        <Flex h='100%' align='center' justify='center'>
       
          <Box w='70%'>
            <HStack spacing='24px'>
              
              <Box>
                <Input 
                  value={username}
                  onChange={updateUsername}
                  placeholder='Enter your name' 
                  size='lg' 
                  mb={5} 
                />
                <Textarea
                  value={message}
                  onChange={updateMessage}
                  placeholder='Write a message and send a wave.'
                  size='lg'
                  mb={5}
                />
                {currentAccount && username && message && <Button onClick={wave}>Send</Button>}
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

      {currentAccount && <Container maxW='container.md' py='10'>
        <Box>
          <Heading as='h3' size='lg' align='center'>List of Waves</Heading>
          {allWaves.map((wave, index) => {
            return (
              <Center key={index}>
                <Message obj={wave} />
              </Center>   
            )
          })}
        </Box>  
      </Container>}

      <Footer />
    </>
  )
}
