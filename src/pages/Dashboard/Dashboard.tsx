import React from 'react'
import useRedirectLogin from '../../utils/useRedirectLogin'

const Dashboard = () => {
  useRedirectLogin();

  return (
    <div>
      Hola Dashboard, esta es tu home!
    </div>
  )
}

export default Dashboard
