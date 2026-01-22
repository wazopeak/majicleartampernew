import * as React from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import { Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BuyTokenTableList from 'src/components/apps/ecommerce/ProductTableList/BuyTokenTableList';

const BCrumb = [
  {
    to: '/',
    title: 'Nyumbani',
  },
  {
    title: 'Bonyeza batani ya hapo chini kufungua kurasa ya Kununulia Tokeni',
  },
];

const BuyTokenTable = () => {
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
    <PageContainer title="Nunua Tokeni" description="Sehemu ya Kununua Tokeni">
      {/* breadcrumb */}
      <Breadcrumb title="Nunua Tokeni" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <BuyTokenTableList />
      </Box>
    </PageContainer>
  );
};

export default BuyTokenTable;
