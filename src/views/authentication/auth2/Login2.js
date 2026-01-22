import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';

// components
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

// ----- Uploaded file path you asked to receive (transform to usable URL on your side) -----
const UPLOADED_FILE_URL = 'sandbox:/mnt/data/a9139ed6-bcbf-4957-a822-3f5421f4bfef.png';
// alternate: 'sandbox:/mnt/data/1da62e6d-f191-40b5-b168-ee27a508d705.png'
// -----------------------------------------------------------------------------------------

const Login2 = () => {
  const [UserName, setUserName] = useState('');
  const [PassWord, setPassWord] = useState('');
  const [loading, setLoading] = useState(false); // loading state for button

  const navigate = useNavigate();

  const notifyLoginError = () =>
    toast('Error while Login', {
      position: 'top-right',
      type: 'error',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: { fontSize: 12 }
    });

  const notifyLoginSuccess = () =>
    toast('LoggedIn successfully', {
      position: 'top-right',
      type: 'success',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      style: { fontSize: 12 }
    });

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Make API request to login
      const response = await axios.post('/users/logins', { UserName, PassWord });
      // const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}users/logins`, { UserName, PassWord });
      const data = response?.data ?? {};

      if (data.Login) {
        // set local storage and navigate
        localStorage.setItem('token', data.token);
        localStorage.setItem('datausername', data.data.UserName);
        localStorage.setItem('datauserid', data.data.Id);
        localStorage.setItem('datauserauthlevel', data.data.GroupID);
        localStorage.setItem('datauserauthid', data.data.AuthorityID);
        localStorage.setItem('dataemail', data.data.Email);

        notifyLoginSuccess();
        navigate('/');
      } else {
        notifyLoginError();
      }
    } catch (error) {
      console.error('Login error:', error);
      notifyLoginError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3'
          }
        }}
      >
        <ToastContainer style={{ fontSize: '10', fontFamily: 'serif' }} />
        <form onSubmit={handleLogin}>
          <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
            <Grid
              item
              xs={12}
              sm={12}
              lg={5}
              xl={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                  {/* If your Logo component accepts a src prop, you can pass UPLOADED_FILE_URL.
                      Otherwise keep using the Logo as-is. */}
                  <Logo src={UPLOADED_FILE_URL} />
                </Box>

                <Stack spacing={2}>
                  <Box>
                    <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
                    <CustomTextField
                      id="username"
                      label="Username"
                      value={UserName}
                      onChange={(e) => setUserName(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Box>

                  <Box>
                    <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                    <CustomTextField
                      id="password"
                      label="Password"
                      type="password"
                      value={PassWord}
                      onChange={(e) => setPassWord(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  </Box>

                  <Stack justifyContent="space-between" direction="row" alignItems="center" my={1}>
                    <FormGroup>
                      <FormControlLabel control={<CustomCheckbox defaultChecked />} label="Remeber this Device" />
                    </FormGroup>

                    <Typography
                      component={Link}
                      to="/auth/forgot-password"
                      fontWeight="500"
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main'
                      }}
                    >
                      Forgot Password ?
                    </Typography>
                  </Stack>
                </Stack>

                <Box mt={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <CircularProgress size={18} color="inherit" />
                        Signing In...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Box>

                {/* Optionally display link to register or other content */}
                {/* <AuthLogin subtitle={...} /> */}
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </PageContainer>
  );
};

export default Login2;
