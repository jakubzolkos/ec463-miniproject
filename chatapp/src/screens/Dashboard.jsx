import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'

import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

export default function Dashboard({ navigation }) {
  /*
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      
      <Paragraph>
        Login successful
      </Paragraph>

      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
  */
  
  
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat />
      </div>
      
    </div>
  )
  
}
