import React from 'react';
import axios from 'axios';
import { Box, CardContent, Grid, Typography } from '@mui/material';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';

const TopCards = () => {
  const [options, setOptions] = React.useState(null);

  React.useEffect(() => {
    // Fetch data from API
    axios.get('/users/totalcount')
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setOptions(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const topcards = [
    {
      icon: icon2,
      title: 'Wateja',
      digits: options?.TotalWateja ? new Intl.NumberFormat().format(options.TotalWateja) : 'N/A',
      bgcolor: 'primary',
    },
    {
      icon: icon3,
      title: 'Mita',
      digits: options?.TotalMita ? new Intl.NumberFormat().format(options.TotalMita) : 'N/A',
      bgcolor: 'warning',
    },
    {
      icon: icon4,
      title: 'Tarrif',
      digits: options?.TotalTarrif ? new Intl.NumberFormat().format(options.TotalTarrif) : 'N/A',
      bgcolor: 'secondary',
    },
    {
      icon: icon5,
      title: 'Mapato',
      digits: options?.TotalRevenue ? new Intl.NumberFormat().format(options.TotalRevenue) : 'N/A',
      bgcolor: 'error',
    },
    {
      icon: icon6,
      title: 'Mita Active',
      digits: options?.TotalActiveMeter ? new Intl.NumberFormat().format(options.TotalActiveMeter) : 'N/A',
      bgcolor: 'success',
    },
    {
      icon: icon1,
      title: 'Watumiaji',
      digits: options?.TotalAdmin ? new Intl.NumberFormat().format(options.TotalAdmin) : 'N/A',
      bgcolor: 'info',
    },
  ];
  
  return (
    <Grid container spacing={3} mt={3}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
            <CardContent>
              <img src={topcard.icon} alt={topcard.icon} width="50" />
              <Typography
                color={topcard.bgcolor + '.main'}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
