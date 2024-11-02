import { Button } from '@mui/material';
import React from 'react'

const Login = () => {


  return (
    <div>
      <Button onClick={() => localStorage.setItem("token", "ahreloco")} variant="contained">Logear usuario</Button> 
    </div>
  )
}

export default Login
