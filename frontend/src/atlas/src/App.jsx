import { useState } from 'react'
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Navbar from './navbar.jsx'
import '../public/logo.png'
import Calculator from './Calcul.jsx';

function App() {
  return (
    <>
      <Navbar />
      <h1>Bienvenue sur Atlas !</h1>
      <Calculator/>
      <div className="container">
        <a href="/solo" className="box">Solo</a>
        <a href="/multijoueur" className="box">Multijoueur</a>
      </div>
    </>
  )
}

export default App
