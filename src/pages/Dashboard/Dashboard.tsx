import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(!token){
            navigate("/login")
        } 
    }, [navigate]);
  
    return (
    <div>
      Pagina principal
    </div>
  )
}

export default Dashboard
