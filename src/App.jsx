import React from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import ScrollToTop from './components/shared/ScrollToTop';
import Router from './routes/Router';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { useNavigate } from 'react-router';
import axios from 'axios';

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);

  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch data from API
    axios.get('/users/checkauth',{
      headers: {
        'access-token' : localStorage.getItem("token")
      }
    })
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        if(response.data == "Authenticated") {
          // setLoggedInUser(response.data);
        } else {
          navigate('/auth/login2');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={customizer.activeDir}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
      </RTL>
    </ThemeProvider>
  );
}

export default App
