import React from "react"
import useAuthRedirect from "../../utils/useRedirect"

const Dashboard = () => {
    // Verificamos que el usuario esté logeado
    useAuthRedirect();
    
    return (
    <div>
      Pagina principal
    </div>
  )
}

export default Dashboard
