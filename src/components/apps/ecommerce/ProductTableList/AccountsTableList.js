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
  Autocomplete,
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
  Modal,
  CircularProgress
} from '@mui/material';

import CustomFormLabel from '../../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../forms/theme-elements/CustomSelect';
// import CustomCheckbox from "../../../forms/theme-elements/CustomCheckbox";

import { withStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { visuallyHidden } from '@mui/utils';

import { useSelector, useDispatch } from 'react-redux';
// import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import { fetchAccounts } from 'src/store/apps/eCommerce/AccountsSlice';
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

// const countryToFlag = (isoCode) =>
//   typeof String.fromCodePoint !== 'undefined'
//     ? isoCode
//         .toUpperCase()
//         .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
//     : isoCode;

const headCells = [

  {
    id: 'meterid',
    numeric: false,
    disablePadding: false,
    label: 'NAMBA YA MITA',
  },

  {
    id: 'customerid',
    numeric: false,
    disablePadding: false,
    label: 'MTEJA',
  },

  {
    id: 'tarrifid',
    numeric: false,
    disablePadding: false,
    label: 'TARRIF',
  },

  {
    id: 'costid',
    numeric: false,
    disablePadding: false,
    label: 'GHARAMA/UNITI',
  },

  {
    id: 'statusid',
    numeric: false,
    disablePadding: false,
    label: 'HALI YA USAJILI',
  },

  {
    id: 'createdby',
    numeric: false,
    disablePadding: false,
    label: 'MSAJILI',
  },

  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'TAREHE YA USAJILI',
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
        <Box sx={{ flex: '1 1 10%' }}>
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

      {/* {numSelected > 0 ? (
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
      )} */}

    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const AccountsTableList = () => {
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
  const [customerOptions, setCustomerOptions] = React.useState([]);
  const [priceOptions, setPriceOptions] = React.useState([]);
  const [lastAccId, setLastAccId] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [autoValue, setAutoValue] = React.useState(null);

  const [authOptions, setAuthOptions] = React.useState({
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
  });
  // const [selectedValue, setSelectedValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');
  const [isChecked, setIsChecked] = React.useState(false);
  // const [isSysValue, setIsSysValue] = React.useState(0);
  
  const notifyMeterCustomerBindError = () => toast("Mita Imeshindikana Kusajiliwa Kwa Mteja",{
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

  const notifyMeterCustomerBindSuccess = () => toast("Mita Imefanikiwa Kusajiliwa Kwa Mteja",{
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

  const notifyMeterCustomerBindUpdateError = () => toast("Imeshindikana Kubadili taarifa za mita  kwa mteja",{
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

  const notifyMeterCustomerBindUpdateSuccess = () => toast("Umefanikiwa kubadili taarifa za mita kwa mteja",{
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
    axios.post('/users/allmeters', authOptions)
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
    axios.post('/users/allcustomers', authOptions)
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setCustomerOptions(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  React.useEffect(() => {
    // Fetch data from API
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
    axios.get('/users/lastaccid')
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setLastAccId(response.data.message);
        // setLastAccId("AC-00059");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const [formData, setFormData] = React.useState({
    CompanyName: "WazoPeak",
    UserName: "Admin027",
    PassWord: "123456",
    Account_ID: '',
    CUST_ID: '',
    CusId: '',
    METER_ID: '',
    MeterId: '',
    SStation_ID: 'Sta-00001',
    Categories: '',
    TarrifId: '',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    BindedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const [formUpdateData, setFormUpdateData] = React.useState({
    CompanyName: "WazoPeak",
    UserName: "Admin027",
    PassWord: "123456",
    Account_ID: editSelectedUser?.Account_ID || ' ',
    CUST_ID: editSelectedUser?.CusId || ' ',
    CusId: editSelectedUser?.Id || ' ',
    METER_ID: editSelectedUser?.MeterNo || ' ',
    MeterId: editSelectedUser?.MeterId || ' ',
    SStation_ID: 'Sta-00001',
    Categories: editSelectedUser?.PriceCategory || ' ',
    TarrifId: editSelectedUser?.TarrifId || ' ',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    BindedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });



// Use useEffect to update formData when lastCusId changes
React.useEffect(() => {
  setFormData(prevFormData => ({
    ...prevFormData,
    Account_ID: lastAccId
  }));
}, [lastAccId]);

// Handle Autocomplete change event
const handleAutocompleteCustomerChange = (event, newValue) => {
  // Update formData with the selected option
  setFormData({
      ...formData,
      CusId: newValue?.Id || '',
      CUST_ID: newValue?.CusId || ''
  });
};

// Handle Autocomplete change event
const handleAutocompleteMeterChange = (event, newValue) => {
  // Update formData with the selected option
  setFormData({
      ...formData,
      MeterId: newValue?.Id || '',
      METER_ID: newValue?.MeterNo || ''
  });
};

// Handle Autocomplete change event
const handleAutocompleteTarrifChange = (event, newValue) => {
  // Update formData with the selected option
  setFormData({
      ...formData,
      TarrifId: newValue?.Id || '',
      Categories: newValue?.Category || ''
  });
};

// Handle Autocomplete change event
const handleAutocompleteUpdateSourceChange = (event, newValue) => {
  // Update formData with the selected option
  setFormUpdateData({
      ...formUpdateData,
      // HearSourceId: newValue?.Id || '',
  });
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value  });
  };

  const handleUpdateChange = (e) => {
    // const { TariffId, Categories } = e.target.value;
    setFormUpdateData({ ...formUpdateData, [e.target.name]: e.target.value  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/users/bindMeter2Customer', formData);
      const response1 = await axios.post('/api/NewAccount', formData);
      // if(response.data.code == 200 && response1){
        if(response.data.code == 200 && response1){

          setLoading(false);
          notifyMeterCustomerBindSuccess();

        setFormData({ 
          CompanyName: "WazoPeak",
          UserName: "Admin027",
          PassWord: "123456",
          Account_ID: '',
          CUST_ID: '',
          CusId: '',
          METER_ID: '',
          MeterId: '',
          SStation_ID: 'Sta-00001',
          Categories: '',
          TarrifId: '',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          BindedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        setLoading(false);
        notifyMeterCustomerBindError();
      }
      
    } catch (error) {
      setLoading(false);
      console.error('Error creating user:', error);
      notifyMeterCustomerBindError();
    }
    setModal(!modal);
  };

  const dispatch = useDispatch();
  //Fetch Products
  React.useEffect(() => {
    // dispatch(fetchProducts());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const getProducts = useSelector((state) => state.ecommerceReducer.products);

  const [rows, setRows] = React.useState(getProducts);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setRows(getProducts);
  }, [getProducts]);

  const handleSearch = (event) => {
    const filteredRows = getProducts.filter((row) => {
      return ( (row.FName.toLowerCase().includes(event.target.value)) || (row.MName.toLowerCase().includes(event.target.value)) || (row.LName.toLowerCase().includes(event.target.value)) || (row.Country.toLowerCase().includes(event.target.value)) || (row.CCode.toLowerCase().includes(event.target.value)) || (row.PNo.toLowerCase().includes(event.target.value)) || (row.Email.toLowerCase().includes(event.target.value)) || (row.HearSource.toLowerCase().includes(event.target.value)) || (row.ZName.toLowerCase().includes(event.target.value)) );
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
    setAutoValue(rows.find((opt) => {
      opt.Id === user.Id
    })); // Set the Autocomplete value to the selected option
    setFormUpdateData({ 
      CompanyName: "WazoPeak",
      UserName: "Admin027",
      PassWord: "123456",
      Account_ID: user?.Account_ID,
      CUST_ID: user?.CusId,
      CusId: user?.CId,
      METER_ID: user?.MeterNo,
      MeterId: user?.MeterId,
      SStation_ID: 'Sta-00001',
      Categories: user?.PriceCategory,
      TarrifId: user?.TarrifId,
      AuthLevel: localStorage.getItem('datauserauthlevel'),
      AuthID: localStorage.getItem('datauserauthid'),
      BindedBy: localStorage.getItem('datauserid'),
      UpdatedBy: localStorage.getItem('datauserid'),
   });
  };

  // console.log("formUpdateData");
  // console.log(formUpdateData);

  //Closing Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    console.log("formUpdateData");
    console.log(formUpdateData);
    // Update user logic here
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
            <Button title="SAJILI" variant="contained" color="primary" onClick={toggle}>+ SAJILI</Button>
          </Box>
        </Tooltip>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          handleSearch={(event) => handleSearch(event)}
        />
        <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
          <TableContainer component={Paper} id="table-to-export">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              // className={classes.table}
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
                                {row.MeterNo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Customer}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.PriceCategory}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Price}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {
                              row.Status==1 ? 
                              <Typography color="textSecondary" variant="subtitle2">
                                Inatumika
                              </Typography>
                              :
                              <Typography color="textSecondary" variant="subtitle2">
                                Haitumiki
                              </Typography>
                            }
                            
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.BindedBy}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography color="textSecondary" variant="subtitle2">
                            {/* {((row.BindedAt).replace('T', ' ').replace('.000Z', ''))} */}
                            {row.BindedAt ? row.BindedAt.replace('T', ' ').replace('.000Z', '') : 'N/A'}
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
          {'FOMU YA KUSAJILI MITA KWA MTEJA KATIKA MFUMO'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            SAJILI
          </DialogContentText>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={12}>
                  <FormLabel>MITA</FormLabel>
                  <Autocomplete
                    options={options}
                    getOptionLabel={(option) => {
                      
                      if (option && option.MeterNo) {
                        return option.MeterNo;
                      }
                      
                      return "";
                    }} 
                    value={options.find((opt) => {
                      opt.Id,
                      opt.MeterNo
                    })}
                    // value={formData.RId}
                    onChange={handleAutocompleteMeterChange} 
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose zone"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>MTEJA</FormLabel>
                  <Autocomplete
                    options={customerOptions}
                    getOptionLabel={(option) => {
                      
                      if (option && option.Name) {
                        return option.Name;
                      }
                      
                      return "";
                    }} 
                    value={options.find((opt) => {
                      opt.Id,
                      opt.CusId
                    })}
                    // value={formData.RId}
                    onChange={handleAutocompleteCustomerChange} 
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
                  <FormLabel>Tarrif</FormLabel>
                  <Autocomplete
                    options={priceOptions}
                    getOptionLabel={(option) => {
                      
                      if (option && option.Category) {
                        return (option.Category + " - (" + option.Amount+ " / " + "Unit)");
                      }
                      
                      return "";
                    }} 
                    value={options.find((opt) => {
                      opt.Id,
                      opt.Category
                    })}
                    onChange={handleAutocompleteTarrifChange} 
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Choose source"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  {
                    loading ? 
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress color="primary" />
                    </Box> 
                    : 
                    <Button variant="contained" color="primary" sx={{ mr: 1 }} type="submit">
                      SAJILI
                    </Button>
                  }
                  
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
          {'BADILI TAARIFA ZA MITA KWA MTEJA KWENYE MFUMO'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            BADILI
          </DialogContentText>
          <Box mt={3}>
            {/* <form> */}
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>MITA</FormLabel>
                  <CustomSelect
                        labelId="meterId-select"
                        id="meterId"
                        name='MeterId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        // value={selectedValue}
                        value={formUpdateData.MeterId}
                        onChange={handleUpdateChange}
                        disabled={true}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {options
                          .filter(option => option.MeterNo.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.MeterNo}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>MTEJA</FormLabel>
                  <CustomSelect
                        labelId="cusId-select"
                        id="cusId"
                        name='CusId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        // value={selectedValue}
                        value={formUpdateData.CusId}
                        onChange={handleUpdateChange}
                        disabled={true}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {customerOptions
                          .filter(option => option.Name.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.Name}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>TARRIF* (Badili hii peke yake)</FormLabel>
                  <CustomSelect
                        labelId="tarrifId-select"
                        id="tarrifId"
                        name='TarrifId'
                        size="small"
                        variant="outlined"
                        fullWidth
                        // value={selectedValue}
                        value={formUpdateData.TarrifId}
                        onChange={handleUpdateChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {priceOptions
                          .filter(option => option.Category.toLowerCase().includes(searchValue.toLowerCase()))
                          .map(option => (
                          <MenuItem key={option.Id} value={option.Id}>{option.Category + " - (" + option.Amount+ " / " + "Unit)"}</MenuItem>
                        ))}
                  </CustomSelect>
                </Grid>
                {/* <Grid item xs={12} lg={12}>
                  <FormLabel>MITA</FormLabel>
                  <Autocomplete
                    options={options}
                    // getOptionLabel={(option) => {
                      
                    //   if (option && option.MeterNo) {
                    //     return option.MeterNo;
                    //   }
                      
                    //   return "";
                    // }} 
                    getOptionLabel={(option) => option.MeterNo}
                    value={autoValue}
                    // value={formData.RId}
                    // onChange={handleAutocompleteMeterChange} 
                    onChange={(event, newValue) => {
                      setAutoValue(newValue);  // Allow the user to pick another option
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chagua Mita"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>MTEJA</FormLabel>
                  <Autocomplete
                    options={customerOptions}
                    // getOptionLabel={(option) => {
                      
                    //   if (option && option.MeterNo) {
                    //     return option.MeterNo;
                    //   }
                      
                    //   return "";
                    // }} 
                    getOptionLabel={(option) => option.Name}
                    value={autoValue}
                    // value={formData.RId}
                    // onChange={handleAutocompleteMeterChange} 
                    onChange={(event, newValue) => {
                      setAutoValue(newValue);  // Allow the user to pick another option
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chagua Mita"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>TARRIF</FormLabel>
                  <Autocomplete
                    options={priceOptions}
                    // getOptionLabel={(option) => {
                      
                    //   if (option && option.MeterNo) {
                    //     return option.MeterNo;
                    //   }
                      
                    //   return "";
                    // }} 
                    getOptionLabel={(option) => (option.Category + " - (" + option.Amount+ " / " + "Unit)")}
                    id="tarrifId"
                    name='TarrifId'
                    value={autoValue}
                    // value={formData.RId}
                    // onChange={handleAutocompleteMeterChange} 
                    onChange={(event, newValue) => {
                      setAutoValue(newValue);  // Allow the user to pick another option
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chagua Mita"
                            variant="outlined"
                        />
                    )}
                  />
                </Grid> */}
                
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    // disabled={formUpdateData.FName.length === 0 || formUpdateData.LName.length === 0}
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

export default withStyles(styles) (AccountsTableList);
