import * as React from "react";
import { ColorModeScript, useColorMode } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { ethers } from "ethers";
import theme from './theme'
import Header from "./components/layout/Header";

import './App.css';

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  const wave = () => {
    
  }
  
  return (
    <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Header mode={toggleColorMode} current={colorMode} />
    <Container maxW='container.xl'>
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </Container>
    </>
  );
}
