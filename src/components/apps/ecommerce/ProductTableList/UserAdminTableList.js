// UserAdminTableList.js
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Button,
  Tooltip,
  FormControlLabel,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  CircularProgress,
  MenuItem
} from '@mui/material';

import CustomSelect from '../../../forms/theme-elements/CustomSelect';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';

import { withStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { visuallyHidden } from '@mui/utils';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserAdmin } from 'src/store/apps/eCommerce/UserAdminSlice';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';

// Use uploaded file path from session (developer instruction)
const UPLOADED_FILE_PATH = '/mnt/data/1da62e6d-f191-40b5-b168-ee27a508d705.png';

const styles = theme => ({
  table: {
    minWidth: 650,
    overflowX: 'auto',
  },
});

const headCells = [
  { id: 'fname', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lname', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'username', numeric: false, disablePadding: false, label: 'UserName' },
  { id: 'mobile', numeric: false, disablePadding: false, label: 'Mobile' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'createdby', numeric: false, disablePadding: false, label: 'Created By' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Created Date' },
  { id: 'updatedby', numeric: false, disablePadding: false, label: 'Updated By' },
  { id: 'datee', numeric: false, disablePadding: false, label: 'Updated Date' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
];

// comparator utilities: only used when user requests sorting. If orderBy is falsy, return original order.
function descendingComparator(a, b, orderBy) {
  const aa = (a[orderBy] ?? '').toString();
  const bb = (b[orderBy] ?? '').toString();
  if (bb < aa) return -1;
  if (bb > aa) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  if (!orderBy) return () => 0;
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
// stableSort: if comparator returns 0 for all items (e.g., no orderBy) we keep original order
function stableSort(array, comparator) {
  if (!Array.isArray(array)) return [];
  // If comparator is identity (no ordering), return original array copy
  const allZero = array.every((_, i, arr) => {
    // quick check: compare first two different elements
    if (arr.length < 2) return true;
    return comparator(arr[0], arr[1]) === 0;
  });
  if (allZero) return array.slice();

  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map(el => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all rows' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={Boolean(orderBy === headCell.id)}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const exportToPDF = () => {
  const input = document.getElementById('table-to-export');
  if (!input) return;
  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('table.pdf');
    })
    .catch((err) => {
      console.error('Export PDF error', err);
    });
};

const EnhancedTableToolbar = ({ numSelected, handleSearch, search }) => (
  <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      ...(numSelected > 0 && {
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      }),
    }}
  >
    {numSelected > 0 ? (
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2">
        {numSelected} selected
      </Typography>
    ) : (
      <Box sx={{ flex: '1 1 100%' }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            ),
          }}
          placeholder="Search User"
          size="small"
          onChange={handleSearch}
          value={search}
        />
      </Box>
    )}

    {numSelected > 0 ? (
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2">
        {numSelected} selected
      </Typography>
    ) : (
      <Tooltip title="Export to PDF">
        <Box onClick={exportToPDF}>
          <Button variant="contained" color="primary">Export to PDF</Button>
        </Box>
      </Tooltip>
    )}

    {numSelected > 0 ? (
      <Tooltip title="Delete"><IconButton><IconTrash width="18" /></IconButton></Tooltip>
    ) : (
      <Tooltip title="Filter list"><IconButton><IconFilter size="1.2rem" /></IconButton></Tooltip>
    )}
  </Toolbar>
);

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleSearch: PropTypes.func,
  search: PropTypes.string,
};

const MIN_PASSWORD_LENGTH = 6;

const UserAdminTableList = (props) => {
  const { classes } = props;
  // table + UI state
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(''); // empty => no server order change
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // form / dialog state
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  // form fields
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [groupData, setGroupData] = React.useState([]);
  const [groupId, setGroupId] = React.useState('');
  const [userData, setUserData] = React.useState({ username: '', password: '' });
  const [confirmPass, setConfirmPass] = React.useState({ ConfirmPassword: '' });
  const [passwordError, setPasswordError] = React.useState('');
  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  // server data
  const [rowData, setRowData] = React.useState([]); // canonical server order
  const [rows, setRows] = React.useState([]); // currently visible (filtered) rows

  // redux + initial fetch (kept if you rely on redux slice)
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchUserAdmin()); // optional, keep in sync with your store
  }, [dispatch]);

  // helper: fetch all users and set both rowData and rows (keeps server order)
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    const rawAuthorityId = localStorage.getItem('datauserauthid');
    const rawGroupId = localStorage.getItem('datauserauthlevel');

    const formData = {
      AuthorityID: rawAuthorityId !== null ? (isNaN(Number(rawAuthorityId)) ? rawAuthorityId : Number(rawAuthorityId)) : null,
      GroupID: rawGroupId !== null ? (isNaN(Number(rawGroupId)) ? rawGroupId : Number(rawGroupId)) : null
    };

    try {
      const response = await axios.post('/users/allusers', formData);
      if (response?.data?.code === '200' || response?.data?.code === 200) {
        const payload = Array.isArray(response.data.message) ? response.data.message : [];
        setRowData(payload);
        // if a search is active, filter server result; otherwise show as-is preserving server ordering
        if (!search) setRows(payload);
        else {
          const q = search.toLowerCase();
          const filtered = payload.filter(r => (
            (r.FName || '').toLowerCase().includes(q) ||
            (r.LName || '').toLowerCase().includes(q) ||
            (r.UserName || '').toLowerCase().includes(q) ||
            (r.CCode || '').toLowerCase().includes(q) ||
            (r.PNo || '').toLowerCase().includes(q) ||
            (r.Email || '').toLowerCase().includes(q) ||
            (r.CreatedBy || '').toLowerCase().includes(q) ||
            (r.UpdatedBy || '').toLowerCase().includes(q)
          ));
          setRows(filtered);
        }
      } else {
        setRowData([]);
        setRows([]);
      }
    } catch (err) {
      console.error('Failed loading users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    fetchUsers();
    fetchRoleGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch role/group options
  const fetchRoleGroups = async () => {
    try {
      const rawGroupId = localStorage.getItem('datauserauthlevel');
      const payload = { GroupID: rawGroupId !== null ? (isNaN(Number(rawGroupId)) ? rawGroupId : Number(rawGroupId)) : null };
      const resp = await axios.post('/users/allrolegroup', payload);
      if (resp?.data?.code === '200' || resp?.data?.code === 200) {
        setGroupData(Array.isArray(resp.data.message) ? resp.data.message.map(g => ({ label: g.Name, value: g.Id })) : []);
      }
    } catch (err) {
      console.error('Failed to fetch role groups', err);
    }
  };

  // search: filter against server-supplied rowData so ordering still comes from server
  const handleSearch = (event) => {
    const q = (event.target.value || '').toLowerCase();
    setSearch(event.target.value);
    const source = Array.isArray(rowData) ? rowData : [];
    if (!q) {
      setRows(source);
      return;
    }
    const filteredRows = source.filter((row) => {
      return (
        (row.FName || '').toLowerCase().includes(q) ||
        (row.LName || '').toLowerCase().includes(q) ||
        (row.UserName || '').toLowerCase().includes(q) ||
        (row.CCode || '').toLowerCase().includes(q) ||
        (row.PNo || '').toLowerCase().includes(q) ||
        (row.Email || '').toLowerCase().includes(q) ||
        (row.CreatedBy || '').toLowerCase().includes(q) ||
        (row.UpdatedBy || '').toLowerCase().includes(q)
      );
    });
    setRows(filteredRows);
  };

  // selection handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.Id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleRequestSort = (event, property) => {
    // toggle ordering and set orderBy; when orderBy is '', enable sorting
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // dialog open/close for add/edit
  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFirstName('');
    setLastName('');
    setMobile('');
    setEmail('');
    setGroupId('');
    setUserData({ username: '', password: '' });
    setConfirmPass({ ConfirmPassword: '' });
    setPasswordError('');
    setIsPasswordValid(false);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // prepare edit
  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingId(user.Id);
    setFirstName(user.FName || '');
    setLastName(user.LName || '');
    setMobile(user.PNo || '');
    setEmail(user.Email || '');
    setGroupId(user.GroupID || '');
    setUserData({ username: user.UserName || '', password: '' });
    setConfirmPass({ ConfirmPassword: '' });
    setPasswordError('');
    setIsPasswordValid(true); // editing doesn't require password validation
    setOpen(true);
  };

  // password handlers
  const onPasswordChange = (pwd) => {
    const confirm = confirmPass.ConfirmPassword || '';
    setUserData({ ...userData, password: pwd });
    const validLength = pwd.length >= MIN_PASSWORD_LENGTH;
    const matches = pwd === confirm;
    setIsPasswordValid(validLength && matches);
    if (passwordError) setPasswordError('');
  };
  const onConfirmChange = (confirmValue) => {
    const pwd = userData.password || '';
    setConfirmPass({ ConfirmPassword: confirmValue });
    const validLength = pwd.length >= MIN_PASSWORD_LENGTH;
    const matches = pwd === confirmValue;
    setIsPasswordValid(validLength && matches);
    if (passwordError) setPasswordError('');
  };

  // submit new user or update
  const AuthorityID = localStorage.getItem('datauserauthid');
  const CreatedBy = localStorage.getItem('datauserid');
  const UpdatedBy = localStorage.getItem('datauserid');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      if (!userData.password || !confirmPass.ConfirmPassword) {
        setPasswordError('Password and Confirm Password are required');
        return;
      }
      if (userData.password.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
        return;
      }
      if (userData.password !== confirmPass.ConfirmPassword) {
        setPasswordError('Password and Confirm Password do not match');
        return;
      }
    }

    const payload = {
      FName: firstName,
      LName: lastName,
      Email: email,
      PNo: mobile,
      UserName: userData.username,
      GroupID: groupId,
      AuthorityID,
      CreatedBy,
      UpdatedBy
    };
    if (!isEditing) payload.Password = userData.password;

    try {
      setSubmitLoading(true);

      if (isEditing) {
        await axios.put(`/users/updateuser/${editingId}`, payload);
        toast.success('User updated successfully');
      } else {
        await axios.post('/users/create', payload);
        toast.success('User added successfully');
      }

      // clear and close dialog
      setPasswordError('');
      setConfirmPass({ ConfirmPassword: '' });
      setUserData({ username: '', password: '' });
      handleClose();

      // REFRESH table from server so ordering and returned fields match server
      await fetchUsers();

    } catch (err) {
      console.error('Failed to save user', err);
      toast.error('Failed to save user');
    } finally {
      setSubmitLoading(false);
    }
  };

  // table helpers
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows.length);
  const tableColSpan = headCells.length + 1;

  return (
    <Box>
      <ToastContainer style={{ fontSize: 10, fontFamily: 'serif' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Button variant="contained" color="primary" onClick={openAdd}>+ New User</Button>
        <EnhancedTableToolbar numSelected={selected.length} handleSearch={handleSearch} search={search} />
      </Box>

      <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
        <TableContainer id="table-to-export">
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.Id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.Id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.Id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <CustomCheckbox color="primary" checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{row.FName || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{row.LName || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{row.UserName || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{(row.CCode || '') + (row.PNo || '')}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{row.Email || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{row.CreatedBy || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{(row.CreatedAt || '').replace?.('T', ' ').replace?.('.000Z', '') || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{row.UpdatedBy || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2" color="textSecondary">{(row.UpdatedAt || '').replace?.('T', ' ').replace?.('.000Z', '') || ''}</Typography>
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
                            <IconDotsVertical size="1.1rem" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={tableColSpan} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
        />
      </Paper>

      <Box ml={2} mt={1}>
        <FormControlLabel control={<CustomSwitch checked={dense} onChange={(e) => setDense(e.target.checked)} />} label="Dense padding" />
      </Box>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Username" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} required />
              </Grid>

              {!isEditing && (
                <>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Password" type="password" value={userData.password} onChange={(e) => onPasswordChange(e.target.value)} required error={passwordError !== ''} helperText={passwordError && userData.password.length < MIN_PASSWORD_LENGTH ? `Min ${MIN_PASSWORD_LENGTH} chars` : ''} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Confirm Password" type="password" value={confirmPass.ConfirmPassword} onChange={(e) => onConfirmChange(e.target.value)} required error={!isPasswordValid && confirmPass.ConfirmPassword !== ''} helperText={!isPasswordValid && confirmPass.ConfirmPassword !== '' ? (userData.password.length < MIN_PASSWORD_LENGTH ? `Min ${MIN_PASSWORD_LENGTH} chars` : 'Passwords do not match') : ''} />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <CustomSelect label="Select User Group" id="group-select" name="GroupID" size="small" fullWidth value={groupId} onChange={(e) => setGroupId(e.target.value)} required>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {Array.isArray(groupData) && groupData.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                </CustomSelect>
              </Grid>

              <Grid item xs={12} textAlign="right">
                <Button type="submit" variant="contained" disabled={submitLoading || (!isEditing && !isPasswordValid)} startIcon={submitLoading ? <CircularProgress size={20} /> : null}>
                  {submitLoading ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update' : 'Submit')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

UserAdminTableList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserAdminTableList);
