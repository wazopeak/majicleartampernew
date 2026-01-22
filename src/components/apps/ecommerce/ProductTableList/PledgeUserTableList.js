import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
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
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  FormLabel,
  DialogContent,
  DialogContentText,
  Grid,
  MenuItem,
  Checkbox,
  Modal
} from '@mui/material';

import CustomFormLabel from '../../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../forms/theme-elements/CustomSelect';

import { withStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { visuallyHidden } from '@mui/utils';

import { useSelector, useDispatch } from 'react-redux';
// import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import { fetchPledgeUser } from 'src/store/apps/eCommerce/PledgeUserSlice';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  // {
  //   id: 'id',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Id',
    
  // },
  {
    id: 'prname',
    numeric: false,
    disablePadding: false,
    label: 'Pledge For',
  },

  {
    id: 'tittle',
    numeric: false,
    disablePadding: false,
    label: 'Tittle',
  },

  {
    id: 'pledger',
    numeric: false,
    disablePadding: false,
    label: 'Pledger',
  },

  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },

  {
    id: 'pledgee',
    numeric: false,
    disablePadding: false,
    label: 'Pledgee',
  },


  {
    id: 'apledged',
    numeric: false,
    disablePadding: false,
    label: 'Amount Pledged',
  },

  {
    id: 'pamount',
    numeric: false,
    disablePadding: false,
    label: 'Paid Amount',
  },

  {
    id: 'ramount',
    numeric: false,
    disablePadding: false,
    label: 'Remained Amount',
  },

  {
    id: 'createdby',
    numeric: false,
    disablePadding: false,
    label: 'Created By',
  },

  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];

const styles = theme => ({
  table: {
    minWidth: 650,
    overflowX: 'auto',
  },
});

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
            inputprops={{
              'aria-label': 'select all desserts',
            }}
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
              active={orderBy === headCell.id}
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
  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('table.pdf');
    });
};


const EnhancedTableToolbar = (props) => {
  const { numSelected, handleSearch, search } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
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
            placeholder="Search Product"
            size="small"
            onChange={handleSearch}
            value={search}
          />
        </Box>
      )}

      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Tooltip title="Export to PDF">
          <Box variant="contained" color="primary" onClick={exportToPDF}>
            <Button variant="contained" color="primary">Export to PDF</Button>
          </Box>
        </Tooltip>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <IconFilter size="1.2rem" icon="filter" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const PledgeUserTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editSelectedUser, setEditSelectedUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [userOptions, setUserOptions] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');

  const notifyUserPledgeRegisterError = () => toast("Error while Registering User pledge",{
    position: "top-right",
    type: "error",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {fontSize: 12}
  });

  const notifyUserPledgeRegisterSuccess = () => toast("User pledge Registered successfully",{
    position: "top-right",
    type: "success",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {fontSize: 12}
  });

  const notifyUserPledgeUpdateError = () => toast("Error while Registering User pledge",{
    position: "top-right",
    type: "error",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {fontSize: 12}
  });

  const notifyUserPledgeUpdateSuccess = () => toast("User pledge Registered successfully",{
    position: "top-right",
    type: "success",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: {fontSize: 12}
  });

  React.useEffect(() => {
    // Fetch data from API
    axios.get('http://172.20.10.8:2004/users/allpledge')
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setOptions(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  React.useEffect(() => {
    // Fetch data from API
    axios.get('http://172.20.10.8:2004/users/alluserswithroles')
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setUserOptions(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const [formData, setFormData] = React.useState({
    PledgeId: '',
    UserId: '',
    AmountPledged: '',
    PaidAmount: '',
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const [formUpdateData, setFormUpdateData] = React.useState({
    PledgeId: editSelectedUser?.PledgeId || ' ',
    UserId: editSelectedUser?.UserRoleId || ' ',
    AmountPledged: editSelectedUser?.AmountPledged || ' ',
    PaidAmount: editSelectedUser?.PaidAmount || ' ',
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value  });
  };

  const handleUpdateChange = (e) => {
    setFormUpdateData({ ...formUpdateData, [e.target.name]: e.target.value  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://172.20.10.8:2004/users/createuserpledge', formData);
      if(response.data.code == 200){

        notifyUserPledgeRegisterSuccess();

        setFormData({ 
          PledgeId: '',
          UserId: '',
          AmountPledged: '',
          PaidAmount: '',
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        notifyUserPledgeRegisterError();
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      notifyUserPledgeRegisterError();
    }
    setModal(!modal);
  };

  const dispatch = useDispatch();
  //Fetch Products
  React.useEffect(() => {
    // dispatch(fetchProducts());
    dispatch(fetchPledgeUser());
  }, [dispatch]);

  const getProducts = useSelector((state) => state.ecommerceReducer.products);

  const [rows, setRows] = React.useState(getProducts);
  const [search, setSearch] = React.useState('');

  // Calculate total sum
  const totalPledged = rows.reduce((acc, curr) => acc + curr.AmountPledged, 0);
  const totalPaid = rows.reduce((acc, curr) => acc + curr.PaidAmount, 0);
  const totalRemained = totalPledged-totalPaid;

  React.useEffect(() => {
    setRows(getProducts);
  }, [getProducts]);

  const handleSearch = (event) => {
    const filteredRows = getProducts.filter((row) => {
      return ( (row.PRName.toLowerCase().includes(event.target.value)) || (row.Tittle.toLowerCase().includes(event.target.value)) || (row.Pledgee.toLowerCase().includes(event.target.value)) || (row.RName.toLowerCase().includes(event.target.value)) || (row.Pledger.toLowerCase().includes(event.target.value)) );
    });
    setSearch(event.target.value);
    setRows(filteredRows);
  };

  // This is for the sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.Id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // This is for the single row sleect
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
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  //Edit Selected User On Click event
  const handleRowEditClick = (user) => {
    setOpenDialog(true);
    setEditSelectedUser(user);
    setFormUpdateData({ 
      PledgeId: user?.PledgeId,
      UserId: user?.UserRoleId,
      AmountPledged: user?.AmountPledged,
      PaidAmount: user?.PaidAmount,
      CreatedBy: localStorage.getItem('datauserid'),
      UpdatedBy: localStorage.getItem('datauserid'),
   });
  };

  //Closing Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // console.log(formUpdateData);

  const handleUpdateData = async (e) => {
    // Update user logic here
    e.preventDefault();
    try {
      const response = await axios.put('http://172.20.10.8:2004/users/updateuserpledge/'+editSelectedUser.Id, formUpdateData);
      if(response.data.code == 200){

        notifyUserPledgeUpdateSuccess();

        setFormUpdateData({ 
          PledgeId: '',
          UserId: '',
          AmountPledged: '',
          PaidAmount: '',
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        notifyUserPledgeUpdateError();
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      notifyUserPledgeUpdateError();
    }
    // setModal(!modal);
    handleCloseDialog();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box>
      <Box>
        <Tooltip >
            <ToastContainer 
              style={{ fontSize: "10", fontFamily: "serif" }}
            />
          <Box variant="contained" color="primary">
            <Button title="Add User Pledge" variant="contained" color="primary" onClick={toggle}>+ User Pledge</Button>
          </Box>
        </Tooltip>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          handleSearch={(event) => handleSearch(event)}
        />
        <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
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
                          <CustomCheckbox
                            color="primary"
                            checked={isItemSelected}
                            inputprops={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                ml: 2,
                              }}
                            >
                              <Typography color="textSecondary" variant="subtitle2">
                                {row.PRName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Tittle}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Pledger}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.RName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Pledgee}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.AmountPledged.toLocaleString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.PaidAmount.toLocaleString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {(row.AmountPledged - row.PaidAmount).toLocaleString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.CreatedBy}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography color="textSecondary" variant="subtitle2">
                            {((row.CreatedAt).replace('T', ' ').replace('.000Z', ''))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip id={row.Id} title="Edit" onClick={() => handleRowEditClick(row)}>
                            <IconButton size="small">
                              <IconDotsVertical size="1.1rem" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography fontWeight="500" variant="h6">
                      Total Pledged: {totalPledged.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="500" variant="h6">
                      Total Paid: {totalPaid.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3} align="right">
                    <Typography fontWeight="500" variant="h6">
                      Remained: {totalRemained.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Box ml={2}>
          <FormControlLabel
            control={<CustomSwitch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      </Box>
      {/* Dialog popup */}
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {'Add User Pledge'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Add user pledge. fill all fields and
            <br /> click on submit button.
          </DialogContentText>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Pledgee</FormLabel>
                  <CustomSelect
                        labelId="pledgeid-select"
                        id="pledgeid"
                        name='PledgeId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={formData.PledgeId}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {options
                          .filter(option => option.PRName.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.PRName} ({option.Pledgee}) - {option.Tittle}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Pledger</FormLabel>
                  <CustomSelect
                        labelId="user-select"
                        id="user"
                        name='UserId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        // value={selectedValue}
                        value={formData.UserId}
                        onChange={handleChange}
                        // input={<TextField />}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {userOptions
                          .filter(option => option.FName.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.FName} {option.MName} {option.LName} - {option.Roles}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Amount Pledged</FormLabel>
                  <TextField
                    id="amountpledged"
                    name='AmountPledged'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.AmountPledged}
                    onChange={handleChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Paid Amount</FormLabel>
                  <TextField
                    id="paidamount"
                    name='PaidAmount'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.PaidAmount}
                    onChange={handleChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={formData.AmountPledged.length === 0 || formData.PaidAmount.length === 0}
                  >
                    Submit
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog popup */}
      <Dialog
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {'Update Member'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Update Member. fill all fields and
            <br /> click on Update button.
          </DialogContentText>
          <Box mt={3}>
            {/* <form> */}
              <Grid spacing={3} container>
              <Grid item xs={12} lg={6}>
                  <FormLabel>Pledgee</FormLabel>
                  <CustomSelect
                        labelId="pledgeId-select"
                        id="pledgeId"
                        name='PledgeId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        // value={selectedValue}
                        value={formUpdateData.PledgeId}
                        onChange={handleUpdateChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {options
                          .filter(option => option.PRName.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.PRName} ({option.Pledgee}) - {option.Tittle}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Pledger</FormLabel>
                  <CustomSelect
                        labelId="userid-select"
                        id="userid"
                        name='UserId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        // value={selectedValue}
                        value={formUpdateData.UserId}
                        onChange={handleUpdateChange}
                        // input={<TextField />}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {userOptions
                          .filter(option => option.FName.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.FName} {option.MName} {option.LName} - {option.Roles}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Amount Pledged</FormLabel>
                  <TextField
                    id="amountpledged"
                    name='AmountPledged'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.AmountPledged}
                    onChange={handleUpdateChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Paid Amount</FormLabel>
                  <TextField
                    id="paidamount"
                    name='PaidAmount'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.PaidAmount}
                    onChange={handleUpdateChange}
                    type='number'
                  />
                </Grid>
                
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={editSelectedUser?.PRName.length === 0}
                    onClick={handleUpdateData}
                  >
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            {/* </form> */}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default withStyles(styles) (PledgeUserTableList);
