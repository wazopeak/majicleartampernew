import * as React from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import { Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import TokenSearchTableList from 'src/components/apps/ecommerce/ProductTableList/TokenSearchTableList';

const BCrumb = [
  {
    to: '/',
    title: 'Nyumbani',
  },
  {
    title: 'Angalia Tokeni Zako',
  },
];

const TokenSearchTable = () => {
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
    <PageContainer title="Tafuta Tokeni" description="this is Tafuta Tokeni page">
      {/* breadcrumb */}
      <Breadcrumb title="Tafuta Tokeni" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <TokenSearchTableList />
      </Box>
    </PageContainer>
  );
};

export default TokenSearchTable;
