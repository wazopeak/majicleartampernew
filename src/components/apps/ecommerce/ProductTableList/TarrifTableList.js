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
  DialogActions,
  Grid,
  MenuItem,
  Checkbox,
  Modal,
  CircularProgress
} from '@mui/material';
import Slide from '@mui/material/Slide';

import CustomFormLabel from '../../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../forms/theme-elements/CustomSelect';
// import CustomCheckbox from "../../../forms/theme-elements/CustomCheckbox";

import { withStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { visuallyHidden } from '@mui/utils';

import { useSelector, useDispatch } from 'react-redux';
// import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import { fetchTarrif } from 'src/store/apps/eCommerce/TarrifSlice';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'AINA',
  },

  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'BEI',
  },

  {
    id: 'vat',
    numeric: false,
    disablePadding: false,
    label: 'VAT',
  },

  {
    id: 'createdby',
    numeric: false,
    disablePadding: false,
    label: 'MSAJIRI',
  },

  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'TAREHE',
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
        <Box sx={{ flex: '1 1 10%' }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Tafuta Tarrif"
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
        <Box variant="contained" color="primary" onClick={exportToPDF}>
          <Button>Export to PDF</Button>
        </Box>
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

const TarrifTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editSelectedPrice, setEditSelectedPrice] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [lastPriceId, setLastPriceId] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const notifyPriceRegisterError = () => toast("Imeshindikana Kusajili Tarrif",{
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

  const notifyPriceRegisterSuccess = () => toast("Umefanikiwa Kusajili Tarrif",{
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

  const notifyPriceUpdateError = () => toast("Imeshindikana Kusajili Tarrif",{
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

  const notifyPriceUpdateSuccess = () => toast("Umefanikiwa Kusajili Tarrif",{
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
    axios.get('/users/lastpriceid')
      .then(response => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        setLastPriceId(response.data.message);
        // setLastPriceId("CTS-00054");
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const [formData, setFormData] = React.useState({
    CompanyName: 'WazoPeak',
    UserName: 'Admin027',
    PassWord: '123456',
    PRICE_ID: '',
    Categories: '',
    PRICE: '',
    VAT_RATE: '',
    PRICE_UNIT: 'TSH',
    REMARK: 'API',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const [formUpdateData, setFormUpdateData] = React.useState({
    CompanyName: 'WazoPeak',
    UserName: 'Admin027',
    PassWord: '123456',
    PRICE_ID: editSelectedPrice?.PriceId || ' ',
    Categories: editSelectedPrice?.Category || ' ',
    PRICE: editSelectedPrice?.Amount || ' ',
    VAT_RATE: editSelectedPrice?.VAT || ' ',
    PRICE_UNIT: 'TSH',
    REMARK: 'API',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
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
    setLoading(true);
    try {
      const response = await axios.post('/users/createPrice', formData);
      const response1 = await axios.post('/api/NewPrice', formData);
      if(response.data.code == 200 && response1){

        setLoading(false);

        notifyPriceRegisterSuccess();

        setFormData({ 
          CompanyName: 'WazoPeak',
          UserName: 'Admin027',
          PassWord: '123456',
          PRICE_ID: "",
          Categories: "",
          PRICE: "",
          VAT_RATE: "",
          PRICE_UNIT: 'TSH',
          REMARK: 'API',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        setLoading(false);
        notifyPriceRegisterError();
      }
      
    } catch (error) {
      console.error('Error creating Price:', error);
      setLoading(false);
      notifyPriceRegisterError();
    }
    setModal(!modal);
  };

  const dispatch = useDispatch();
  //Fetch Products
  React.useEffect(() => {
    // dispatch(fetchProducts());
    dispatch(fetchTarrif());
  }, [dispatch]);

  const getProducts = useSelector((state) => state.ecommerceReducer.products);

  const [rows, setRows] = React.useState(getProducts);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    setRows(getProducts);
  }, [getProducts]);

  const handleSearch = (event) => {
    const filteredRows = getProducts.filter((row) => {
      return ( (row.Category.toLowerCase().includes(event.target.value)) || (row.Amount.toLowerCase().includes(event.target.value)) || (row.CreatedBy.toLowerCase().includes(event.target.value)) );
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
  const handleRowEditClick = (price) => {
    setOpenDialog(true);
    setEditSelectedPrice(price);
    setFormUpdateData({ 
      CompanyName: 'WazoPeak',
      UserName: 'Admin027',
      PassWord: '123456',
      PRICE_ID: price?.PriceId,
      Categories: price?.Category,
      PRICE: price?.Amount,
      VAT_RATE: price?.VAT,
      PRICE_UNIT: 'TSH',
      REMARK: 'API',
      AuthLevel: localStorage.getItem('datauserauthlevel'),
      AuthID: localStorage.getItem('datauserauthid'),
      CreatedBy: localStorage.getItem('datauserid'),
      UpdatedBy: localStorage.getItem('datauserid'),
   });
  };

  // console.log("editSelectedPrice");
  // console.log(setEditSelectedPrice);

  //Closing Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  console.log(formUpdateData);

  const handleUpdateData = async (e) => {
    // Update user logic here
    // console.log(editSelectedPrice);
    console.log("editSelectedPrice.MeterNo");
    console.log(editSelectedPrice.MeterNo);
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put('/users/updateprice/'+editSelectedPrice.PriceId, formUpdateData);
      const response1 = await axios.put('/api/UpdatePrice/', formUpdateData);

      if(response.data.code == 200 && response1){

        notifyPriceUpdateSuccess();

        setFormUpdateData({ 
          CompanyName: 'WazoPeak',
          UserName: 'Admin027',
          PassWord: '123456',
          PRICE_ID: "",
          Categories: "",
          PRICE: "",
          VAT_RATE: "",
          PRICE_UNIT: 'TSH',
          REMARK: 'API',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
       });
      }
      else{
        setLoading(false);
        notifyPriceUpdateError();
      }
      
    } catch (error) {
      console.error('Error creating price:', error);
      setLoading(false);
      notifyPriceUpdateError();
    }
    // setModal(!modal);
    handleCloseDialog();
  };

  // Use useEffect to update formData when lastCusId changes
  React.useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      PRICE_ID: lastPriceId
    }));
  }, [lastPriceId]);

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
            <Button title="Sajili Tarrif Mpya" variant="contained" color="primary" onClick={toggle}>+ Tarrif</Button>
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
                                {row.Category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.Amount}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">
                                {row.VAT}
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
                          <Tooltip id={row.Id} title="Update Tarrif" onClick={() => handleRowEditClick(row)}>
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
      <Dialog
        open={modal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {'Sajili Tarrif'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ingiza Taarifa za Tarrif.
            <br /> Kisha Bonyeza Kitufe Cha Sajili.
          </DialogContentText>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid spacing={3} container>
              <Grid item xs={12} lg={12}>
                  <FormLabel>Jina La Tarrif</FormLabel>
                  <TextField
                    id="Categories"
                    name='Categories'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.Categories}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Bei/Uniti</FormLabel>
                  <TextField
                    id="price"
                    name='PRICE'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.PRICE}
                    onChange={handleChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>VAT (%)</FormLabel>
                  <TextField
                    id="vat_rate"
                    name='VAT_RATE'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.VAT_RATE}
                    onChange={handleChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  {
                    loading ? 
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress color="primary" />
                    </Box> 
                    : 
                    <Button 
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      type="submit"
                      disabled={ formData.Categories.length === 0 || formData.PRICE.length === 0 || formData.VAT_RATE.length === 0}
                    >
                      SAJILI
                    </Button>
                  }
                  <Button variant="contained" color="error" onClick={toggle}>
                    HAIRISHA
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
          {'BADILI TAARIFA ZA MITA'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Badili taarifa za Mita na kisha.
            <br /> Bofya kitufe cha BADILI.
          </DialogContentText>
          <Box mt={3}>
            {/* <form> */}
              <Grid spacing={3} container>
                <Grid item xs={12} lg={12}>
                  <FormLabel>Jina la Tarrif</FormLabel>
                  <TextField
                    id="Categories"
                    name='Categories'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.Categories}
                    onChange={handleUpdateChange}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Bei/Uniti</FormLabel>
                  <TextField
                    id="price"
                    name='PRICE'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.PRICE}
                    onChange={handleUpdateChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>VAT (%)</FormLabel>
                  <TextField
                    id="vat_rate"
                    name='VAT_RATE'
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formUpdateData.VAT_RATE}
                    onChange={handleUpdateChange}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  {
                    loading ? 
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress color="primary" />
                    </Box> 
                    : 
                    <Button 
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      type="submit"
                      disabled={editSelectedPrice?.Category.length === 0 || editSelectedPrice?.Amount.length === 0 || editSelectedPrice?.VAT.length === 0}
                      onClick={handleUpdateData}
                    >
                      BADILI
                    </Button>
                  }
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

export default withStyles(styles) (TarrifTableList);
