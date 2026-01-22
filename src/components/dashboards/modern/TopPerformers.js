import React from 'react';
import axios from 'axios';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
} from '@mui/material';
import TopPerformerData from './TopPerformerData';

const performers = TopPerformerData;

const TopPerformers = () => {
  // for select
  const [month, setMonth] = React.useState('1');
  const [recentTrans, setRecentTrans] = React.useState([]);

  React.useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    // read IDs from localStorage and convert to number when appropriate
    const rawAuthority = localStorage.getItem('datauserauthid');
    const rawGroup = localStorage.getItem('datauserauthlevel');

    const AuthorityID = rawAuthority !== null && !Number.isNaN(Number(rawAuthority)) ? Number(rawAuthority) : rawAuthority;
    const GroupID = rawGroup !== null && !Number.isNaN(Number(rawGroup)) ? Number(rawGroup) : rawGroup;

    const payload = { AuthorityID, GroupID };

    (async () => {
      try {
        const response = await axios.post('/users/recentclearedtampertoken', payload, { signal: controller.signal });
        if (!mounted) return;
        const data = response?.data?.message ?? response?.data ?? [];
        // ensure it's an array and limit to 5 records
        setRecentTrans(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.message === 'canceled') {
          // request aborted — ignore
        } else {
          console.error('Error fetching cleared tamper tokens:', err);
          if (mounted) setRecentTrans([]);
        }
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <DashboardCard
      title="Taarifa za Hivi Karibuni"
      subtitle="Taarifa"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small"
          value={month}
          onChange={handleChange}
        >
          <MenuItem value={1}>5 Ya Hivi Karibuni</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Mita</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Token</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Aliyeitoa</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Muda</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentTrans.map((basic) => (
              <TableRow key={basic.Id}>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Avatar src={basic.imgsrc} alt={basic.imgsrc} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                        {basic.MeterNo}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {basic.ClearedToken}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {basic.GeneratedBy}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                     {basic.GeneratedAt ? basic.GeneratedAt.replace('T', ' ').replace('.000Z', '') : 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopPerformers;
