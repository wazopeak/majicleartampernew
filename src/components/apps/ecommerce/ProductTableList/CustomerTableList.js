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
  Autocomplete,
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
import { fetchCustomer } from 'src/store/apps/eCommerce/CustomerSlice';
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
    id: 'fname',
    numeric: false,
    disablePadding: false,
    label: 'FIRST NAME',
  },
  {
    id: 'lname',
    numeric: false,
    disablePadding: false,
    label: 'LAST NAME',
  },
  {
    id: 'mobile',
    numeric: false,
    disablePadding: false,
    label: 'MOBILE',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'EMAIL',
  },

  {
    id: 'createdby',
    numeric: false,
    disablePadding: false,
    label: 'CREATED BY',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'CREATION DATE',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'ACTION',
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
            placeholder="Tafuta"
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

const CustomerTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editSelectedUser, setEditSelectedUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [priceOptions, setPriceOptions] = React.useState([]);
  const [lastCusId, setLastCusId] = React.useState([]);
  const [modal, setModal] = React.useState(false);

  const [authOptions, setAuthOptions] = React.useState({
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
  });

  const notifyCustomerRegisterError = () => toast("Imeshindikana Kumsajili Mteja",{
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

  const notifyCustomerRegisterSuccess = () => toast("Umefanikiwa kumsajili Mteja",{
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

  const notifyCustomerUpdateError = () => toast("Imeshindikana Kubadili taarifa za Mteja",{
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

  const notifyCustomerUpdateSuccess = () => toast("Umefanikiwa kubadili taarifa za Mteja",{
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
    // Itabidi nipass AuthLevel na AuthID kama parameter za kureturn Tarrif
    axios.post('/users/allprices', authOptions)
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setPriceOptions(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  React.useEffect(() => {
    // Fetch data from API
    axios.get('/users/lastcusid')
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setLastCusId(response.data.message);
        // setLastCusId("CTS-00054");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // console.log("lastCusId");
  // console.log(lastCusId);

  const toggle = () => {
    setModal(!modal);
  };

  const [formData, setFormData] = React.useState({
    CompanyName: "WazoPeak",
    UserName: "Admin027",
    PassWord: "123456",
    CustomerID: '',
    CustomerName: '',
    CustomerAddress: '',
    CustomerPhone: '',
    CustomerEmail: '',
    TIN: '',
    VRN: '',
    Lat: '',
    Long: '',
    Sehemu: '',
    Tarrif: '',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const [formUpdateData, setFormUpdateData] = React.useState({
    CompanyName: "WazoPeak",
    UserName: "Admin027",
    PassWord: "123456",
    CustomerID: editSelectedUser?.CusId || ' ',
    CustomerName: editSelectedUser?.Name || ' ',
    CustomerAddress: editSelectedUser?.Box || ' ',
    CustomerPhone: editSelectedUser?.PNo || ' ',
    CustomerEmail: editSelectedUser?.Email || ' ',
    TIN: editSelectedUser?.TIN || ' ',
    VRN: editSelectedUser?.VRN || ' ',
    Lat: editSelectedUser?.Lat || ' ',
    Long: editSelectedUser?.Longt || ' ',
    Sehemu: editSelectedUser?.LocName || ' ',
    Tarrif: editSelectedUser?.PriceID || ' ',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  // Handle Autocomplete change event
const handleAutocompletePriceChange = (event, newValue) => {
  // Update formData with the selected option
  setFormData({
      ...formData,
      Tarrif: newValue?.Id || ''
  });
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value  });
  };

  // console.log(formData);

  const handleUpdateChange = (e) => {
    setFormUpdateData({ ...formUpdateData, [e.target.name]: e.target.value  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/createCustomer', formData);
      const response1 = await axios.post('/api/NewCustomer', formData);
      if(response.data.code == 200 && response1){

        notifyCustomerRegisterSuccess();

        setFormData({ 
          CompanyName: "WazoPeak",
          UserName: "Admin027",
          PassWord: "123456",
          CustomerID: '',
          CustomerName: '',
          CustomerAddress: '',
          CustomerPhone: '',
          CustomerEmail: '',
          TIN: '',
          VRN: '',
          Lat: '',
          Long: '',
          Sehemu: '',
          Tarrif: '',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        notifyCustomerRegisterError();
      }
      
    } catch (error) {
      console.error('Error creating Mteja:', error);
      notifyCustomerRegisterError();
    }
    setModal(!modal);
  };

  const dispatch = useDispatch();
  //Fetch Products
  React.useEffect(() => {
    // dispatch(fetchProducts());
    dispatch(fetchCustomer());
  }, [dispatch]);

  const getProducts = useSelector((state) => state.ecommerceReducer.products);

  const [rows, setRows] = React.useState(getProducts);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setRows(getProducts);
  }, [getProducts]);

  const handleSearch = (event) => {
    const filteredRows = getProducts.filter((row) => {
      return ( (row.Name.toLowerCase().includes(event.target.value)) || (row.CreatedBy.toLowerCase().includes(event.target.value)) );
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
  const handleRowEditClick = (customer) => {
    setOpenDialog(true);
    setEditSelectedUser(customer);
    setFormUpdateData({ 
      CompanyName: "WazoPeak",
      UserName: "Admin027",
      PassWord: "123456",
      CustomerID: customer.CusId,
      CustomerName: customer?.Name,
      CustomerAddress: customer?.Box,
      CustomerPhone: customer?.PNo,
      CustomerEmail: customer?.Email,
      TIN: customer?.TIN,
      VRN: customer?.VRN,
      Lat: customer?.Lat,
      Long: customer?.Longt,
      Sehemu: customer?.LocName,
      Tarrif: customer?.PriceID,
      AuthLevel: localStorage.getItem('datauserauthlevel'),
      AuthID: localStorage.getItem('datauserauthid'),
      CreatedBy: localStorage.getItem('datauserid'),
      UpdatedBy: localStorage.getItem('datauserid'),
   });
  };

  console.log("editSelectedUser");
  console.log(editSelectedUser);
  //Closing Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateData = async (e) => {
    // Update user logic here
    e.preventDefault();
    try {
      const response = await axios.put('/users/updatecustomer/'+editSelectedUser.CusId, formUpdateData);
      const response1 = await axios.post('/api/UpdateCustomer/', formUpdateData);
      if(response.data.code == 200 && response1 ){

        notifyCustomerUpdateSuccess();

        setFormUpdateData({ 
          CompanyName: "WazoPeak",
          UserName: "Admin027",
          PassWord: "123456",
          CustomerID: '',
          CustomerName: '',
          CustomerAddress: '',
          CustomerPhone: '',
          CustomerEmail: '',
          TIN: '',
          VRN: '',
          Lat: '',
          Long: '',
          Sehemu: '',
          Tarrif: '',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        notifyCustomerUpdateError();
      }
      
    } catch (error) {
      console.error('Error creating zone:', error);
      notifyCustomerUpdateError();
    }
    // setModal(!modal);
    handleCloseDialog();
  };

  // Use useEffect to update formData when lastCusId changes
  React.useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      CustomerID: lastCusId
    }));
  }, [lastCusId]);

  console.log("formUpdateData");
  console.log(formUpdateData);

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
            <Button title="Sajili Mteja Mpya" variant="contained" color="primary" onClick={toggle}>+ Mteja</Button>
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
                                {row.Name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Box}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.PNo}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Email}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.TIN}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.VRN}
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
                            {/* {((row.CreatedAt).replace('T', ' ').replace('.000Z', ''))} */}
                            {row.CreatedAt ? row.CreatedAt.replace('T', ' ').replace('.000Z', '') : 'N/A'}
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
          {'USAJILI WA MTEJA KATIKA MFUMO'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sajili Mteja kwa kujaza Sehemu zilizo wazi, Kisha.
            <br /> Bofya kitufe cha SAJILI.
          </DialogContentText>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Jina La Mteja*</FormLabel>
                  <TextField
                    id="customername"
                    name='CustomerName'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.CustomerName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Anuani</FormLabel>
                  <TextField
                    id="customerAaddress"
                    name='CustomerAddress'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.CustomerAddress}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Namba Ya Simu*</FormLabel>
                  <TextField
                    id="customerphone"
                    name='CustomerPhone'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.CustomerPhone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Barua Pepe</FormLabel>
                  <TextField
                    id="customeremail"
                    name='CustomerEmail'
                    type="email"
                    required
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.CustomerEmail}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>TIN</FormLabel>
                  <TextField
                    id="tin"
                    name='TIN'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.TIN}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>VRN</FormLabel>
                  <TextField
                    id="vrn"
                    name='VRN'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.VRN}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Latitude</FormLabel>
                  <TextField
                    id="lat"
                    name='Lat'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.Lat}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Longitude</FormLabel>
                  <TextField
                    id="long"
                    name='Long'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.Long}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Jina La Sehemu</FormLabel>
                  <TextField
                    id="sehemu"
                    name='Sehemu'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.Sehemu}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Tarrif*</FormLabel>
                  <Autocomplete
                    options={priceOptions}
                    getOptionLabel={(option) => {
                      
                      if (option && option.Category) {
                        return (option.Category + " - (" + option.Amount+ " / " + "Unit)");
                      }
                      
                      return "";
                    }} 
                    value={options.find((opt) => {
                      opt.Id
                    })}
                    // value={formData.RId}
                    onChange={handleAutocompletePriceChange} 
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose role"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={formData.CustomerName.length === 0 || formData.CustomerPhone.length === 0 || formData.Tarrif.length === 0}
                  >
                    SAJILI
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle}>
                    AHIRISHA
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
          {'KUBADILI TAARIFA ZA MTEJA KATIKA MFUMO'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Badili taarifa za mteja na kisha.
            <br /> Bofya kitufe cha BADILI.
          </DialogContentText>
          <Box mt={3}>
            {/* <form> */}
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Jina la Mteja</FormLabel>
                  <TextField
                    id="customername"
                    name='CustomerName'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.CustomerName}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Anuani</FormLabel>
                  <TextField
                    id="customeraddress"
                    name='CustomerAddress'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.CustomerAddress}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Namba Ya Simu*</FormLabel>
                  <TextField
                    id="customerphone"
                    name='CustomerPhone'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.CustomerPhone}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Barua Pepe</FormLabel>
                  <TextField
                    id="customeremail"
                    name='CustomerEmail'
                    type="email"
                    required
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.CustomerEmail}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>TIN</FormLabel>
                  <TextField
                    id="tin"
                    name='TIN'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.TIN}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>VRN</FormLabel>
                  <TextField
                    id="vrn"
                    name='VRN'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.VRN}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Latitude</FormLabel>
                  <TextField
                    id="lat"
                    name='Lat'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.Lat}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Longitude</FormLabel>
                  <TextField
                    id="long"
                    name='Long'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.Long}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Jina La Sehemu</FormLabel>
                  <TextField
                    id="sehemu"
                    name='Sehemu'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.Sehemu}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Tarrif*</FormLabel>
                  <Autocomplete
                    options={priceOptions}
                    getOptionLabel={(option) => {
                      
                      if (option && option.Category) {
                        return (option.Category + " - (" + option.Amount+ " / " + "Unit)");
                      }
                      
                      return "";
                    }} 
                    value={options.find((opt) => {
                      opt.Id
                    })}
                    // value={formData.RId}
                    onChange={handleAutocompletePriceChange} 
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose role"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={editSelectedUser?.Name.length === 0 || editSelectedUser?.PNo.length === 0 }
                    onClick={handleUpdateData}
                  >
                    BADILI
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCloseDialog}>
                    AHIRISHA
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

export default withStyles(styles) (CustomerTableList);
