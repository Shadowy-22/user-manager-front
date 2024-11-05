// src/loginService.ts (or wherever you're using it)
import axios from 'axios';

const loginUser = async (username: string, password: string) => {
  try {
    const loginUrl = `${process.env.REACT_APP_CUENTAS_API_URL}login`;
    const response = await axios.post(loginUrl, { username, password });

    if (response.status === 201) {
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('expiresIn', response.data.expiresIn);
      localStorage.setItem('userId', response.data.userId);
      console.log('Login successful:', response.data);
    } else {
      // Handle error
      console.error('Unexpected error:', response);
    }
  } catch (error: any) {
    console.error('Error during login:', error);
  }
};

export default loginUser;
