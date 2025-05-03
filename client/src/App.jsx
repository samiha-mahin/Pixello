import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'

const App = () => {
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/signup" element={<Signup />} /> 
   </Routes>
   </BrowserRouter>
   </>
  )
}

export default App