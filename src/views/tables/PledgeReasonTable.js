import * as React from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

import { Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import PledgeReasonTableList from 'src/components/apps/ecommerce/ProductTableList/PledgeReasonTableList';

const BCrumb = [
  {
    to: '/',
    title: 'Nyumbani',
  },
  {
    title: 'Mita Zilizofungwa Kwa Wateja',
  },
];

const PledgeReasonTable = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch data from API
    axios.get('http://172.20.10.8:2004/users/checkauth',{
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
    <PageContainer title="Search Table" description="this is Search Table page">
      {/* breadcrumb */}
      <Breadcrumb title="Search Table" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <PledgeReasonTableList />
      </Box>
    </PageContainer>
  );
};

export default PledgeReasonTable;
