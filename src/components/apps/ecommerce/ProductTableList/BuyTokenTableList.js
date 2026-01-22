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
  DialogActions,
  DialogContentText,
  Grid,
  MenuItem,
  Checkbox,
  Modal,
  CircularProgress
} from '@mui/material';

import CustomFormLabel from '../../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../forms/theme-elements/CustomSelect';

import { withStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { visuallyHidden } from '@mui/utils';

import { useSelector, useDispatch } from 'react-redux';
// import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import { fetchConsultation } from 'src/store/apps/eCommerce/EcommerceSlice';
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
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'mobile',
    numeric: false,
    disablePadding: false,
    label: 'Mobile',
  },

  {
    id: 'query',
    numeric: false,
    disablePadding: false,
    label: 'Query',
  },
  {
    id: 'spiritualitem',
    numeric: false,
    disablePadding: false,
    label: 'Spiritual Item',
  },
  {
    id: 'spiritualnote',
    numeric: false,
    disablePadding: false,
    label: 'Spiritual Note',
  },
  {
    id: 'generalnote',
    numeric: false,
    disablePadding: false,
    label: 'General Note',
  },
  {
    id: 'servedby',
    numeric: false,
    disablePadding: false,
    label: 'Served By',
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
            placeholder="Tafuta Mita"
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

const BuyTokenTableList = () => {
  const [unit, setShowUnit] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState([]);
  const [customerName, setCustomerName] = React.useState("");
  const [apiKey, setApiKey] = React.useState("ea362f523db8abd5");
  const [secretKey, setSecretKey] = React.useState("N2RiZDMzZjQ3MThlMTViMmNhMzA4MzZmYWFjMTUwZjI3YjRlODYzZGY4YTU3MWE4NDIyMWFmMmE0ZWUzYzkyMA==");
  const [receiptDetails, setReceiptDetails] = React.useState([]);

  const notifyToken = () => toast("Umefanikiwa kununua Tokeni",{
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

  const notifySmsSent = () => toast("Tokeni Imefanikiwa Kutumwa",{
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

  const notifyRechargeDirectOk = () => toast("Tokeni Imefanikiwa Kuingia Kwenye Mita",{
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

  const notifyTokenError = () => toast("Imeshindikana kununua Tokeni",{
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
  const notifySmsError = () => toast("Imeshindikana kutuma Tokeni",{
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


  const handleSendClose = () => {
    setLoading(true);
    const isValidForm = formData.CPNo
    console.log("isValidForm");
    console.log(isValidForm);
    var mob = isValidForm;
    var firstChar = mob[0];
    if(firstChar == 0){
      mob = mob.replace(firstChar, '255');
    }
    //http://www.server-newv.stronpower.com/api/VendingMeter
    axios.post('/api/VendingMeter', 
    {
      // postStringfied
      // posts
        "CompanyName": "WazoPeak",
        "UserName": "Admin027",
        "PassWord": "123456",
        "MeterID": formData.MeterID,
        "is_vend_by_unit": "false",
        "Amount": formData.Amount
    })
    .then(response => {
      // setOpen(false);
      if( response.data[0] !="" && typeof response.data[0] != 'undefined'){
        // console.log(response.data[0]);
        // console.log(setReceiptDetails(response.data));
        setReceiptDetails(response.data[0]);
        notifyToken(); 

        var dataForReceipt = response.data[0];

        var meterId = response.data[0].Meter_id;
        console.log(meterId);
        var totalUnits = response.data[0].Total_unit;
        var token = response.data[0].Token;
        console.log(token);
        var totalPaid = response.data[0].Total_paid;
        var authority = response.data[0].Price_Categories;
        var unitMeasure = response.data[0].Unit;
        var ratee = response.data[0].Rate;
        var rate = ratee/100;
        var vat = rate * totalPaid;
        // console.log("vat "+vat);
        var cost = totalPaid-vat;
        var tarrf = response.data[0].Price_Categories +" - "+response.data[0].Price;

        console.log("customerDetails.Customerrrr: "+customerDetails.Customer)

        // console.log("receiptDetails.Customer_phone "+customerDetails.CusPNo); 
        // console.log("customerDetails.CusTIN "+customerDetails.CusTIN);
        //writting to our own db
        axios.post('/users/createtransact', 
        {
            // posts
            "Token": token,
            "MeterNo": meterId, 
            "CusName": customerDetails.Customer,
            "CusNo": customerDetails.CusPNo,
            "TIN": customerDetails.CusTIN, 
            "VRN": customerDetails.CusVRN,
            "Tarrif": tarrf,
            "Price": cost,
            "Unit": totalUnits,
            "Rate": ratee,
            "VAT": vat,
            "Total": totalPaid
        })
        .then(response => {
          if( response.data.code == 200 ){
            
            var risiti = response.data.myData[0].receiptNum;
            var controlN = response.data.myData[0].controlNum;

            // console.log("imewezekana");
            // console.log("rissiti: "+risiti);
            console.log(dataForReceipt);

            var messg = tarrf +"\n"+ meterId + "\n"+risiti+"\n"+controlN+"\n"+ totalUnits + " m3" + "\n \n" + token + "\n \n" + "Cost "+ ((cost).toFixed(2)).toLocaleString() + "\n" + "VAT "+rate+ "% " + (vat).toFixed(2) + "\n" + "TOTAL " + (parseInt(totalPaid).toFixed(2)).toLocaleString(); 
              // console.log(messg);
              axios
              .post(
                "/v1/send",
                {
                  source_addr: "TPDS",
                  schedule_time: "",
                  encoding: 0,
                  // MORUWASA \n $val->Meter_id \n $val->Total_unit m3  \n \n $val->Token \n \n TOTAL $Amount
                  message: messg,
                  recipients: [
                    {
                      recipient_id: 1,
                      dest_addr: mob,
                    }
                  ],
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + btoa(apiKey + ":" + secretKey),
                  },
                  // httpsAgent: new https.Agent({
                  //   rejectUnauthorized: false,
                  // }),
                }
              )
              .then((response) => {
                if(response.data.code == 100){
                  setLoading(false);
                  handleCloseDialog();
                  notifySmsSent();
                  console.log(response, apiKey + ":" + secretKey)
                }
                else{
                  notifySmsError();
                  console.log(response, apiKey + ":" + secretKey)
                }
              })
              .catch((error) => {
                notifySmsError();
                console.error(error.response)
              })

            

              // handlePrint(response.data.myData[0], customerDetails);
              // .finally(_ => {
              //   setLoading(false);
              //   setOpen(false);
              // });
              // setLoading(false);
              // setOpen(false);
            }
          })
          .catch((error) => {
            notifySmsError();
            // console.error(error.response.data)
          })


      }
      else{
        notifyTokenError();
      }
      // console.log(response.data[0])
    })
    .catch(err => console.log(err))
  };

  const toggle = () => {
    setModal(!modal);
  };

  const [formData, setFormData] = React.useState({
    CompanyName: 'WazoPeak',
    UserName: 'Admin027',
    PassWord: '123456',
    MeterID: '',
    Amount: '',
    Units: '',
    is_vend_by_unit: 'false',
    CPNo: '',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value  });
  };


  const AmountInput = (event) => {
    var newAmount = event.target.value;
    // var newAmount = (newAmount1).toLocaleString();
    // console.log("newAmount "+newAmount);

    try{
      axios.post('/users/allpricebymeter',
      {
        "AuthLevel": formData.AuthLevel,
        "AuthID": formData.AuthID,
        "MeterNo": formData.MeterID,
      }) 
      // console.log(response); 
      .then((response) => {
        // console.log(response); 
      if(response.data.code == 200){ 
        console.log("response.data.message[0].Amount"); 
          console.log(newAmount); 
          // setOption(response.data.message);
          var unitValue = response.data.message[0].Amount;
          var vat = response.data.message[0].VAT;
          var costB4vat = newAmount-((vat/100)*newAmount);
          var totalUnit = (costB4vat/unitValue).toLocaleString();
          // var totalUnit = (newAmount/unitValue).toLocaleString();
          // console.log(totalUnit);
          setShowUnit(true);
          setFormData({
            ...formData,
            Amount: newAmount,
            Units:totalUnit
          });
      }
      else{
          console.log(response.data)
      }
    })
    .catch((error) => {
      // notifySmsError();
      // console.error(error.response.data)
    })
    }catch(err){
      console.log(err);
    }
    
  }

  // console.log("response.data.message[0].Amount"); 
  // console.log(formData.Amount); 

  const Units = () => (
    <Grid item xs={12} lg={6}>
      <FormLabel>Uniti</FormLabel>
      <TextField
        id="unit"
        name='Unit'
        size="small"
        variant="outlined"
        fullWidth
        value={formData.Units}
        onChange={handleChange}
      />
    </Grid>
  );

  const handleSubmit = async (e) => {
    event.preventDefault();
    setLoading(true);

    const isValidForm = formData.CPNo

    if (isValidForm) {
      setOpenDialog(true);
      axios.get('/users/customername/'+formData.MeterID)
      .then((response) => {
        if(response.data.code == 200){
          setLoading(false);
          // customerName = response.data.message[0].Customer
          setCustomerName(response.data.message[0].Customer);
          setCustomerDetails(response.data.message[0]);
          // console.log("cust")
          console.log(response.data.message[0]);  

        }
        else{
          console.log(response);
          // console.log("cust");
        }
      })
      .catch((error) => {
        console.error(error.response.data)
      })
    }
    else{
      // setShowError(true);
      document.querySelector(".form-error").innerHTML = "Jaza nafasi zote zilizo wazi";
      document.querySelector(".form-error").style.display = "block";
      console.log('Check your input field:', post);
    }
  };


  //Closing Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box>
        <Tooltip >
            <ToastContainer 
              style={{ fontSize: "10", fontFamily: "serif" }}
            />
          <Box variant="contained" color="primary">
            <Button title="Nunua Tokeni" variant="contained" color="primary" onClick={toggle}>+ Nunua Tokeni</Button>
          </Box>
        </Tooltip>
        
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
          {'Sehemu ya Ununuzi wa Tokeni'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Nunua Tokeni
            <br /> 
          </DialogContentText>
          <Box mt={3}>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={6}>
                <FormLabel>Namba Ya Mita*</FormLabel>
                <TextField
                  id="meterid"
                  name='MeterID'
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={formData.MeterID}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel>Kiasi*</FormLabel>
                <TextField
                  id="amount"
                  name='Amount'
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={formData.Amount}
                  onChange={AmountInput}
                  type='number'
                />
              </Grid>
              { unit ? <Units /> : null }
              <Grid item xs={12} lg={6}>
                <FormLabel>Namba Ya Simu</FormLabel>
                <TextField
                  id="cpno"
                  name='CPNo'
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={formData.CPNo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                  type="submit"
                  disabled={formData.MeterID.length === 0 || formData.Amount.length === 0 || formData.CPNo.length === 0}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button variant="contained" color="error" onClick={toggle}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
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
          {'Angalia na Thibitisha'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {/* <span style={{fontWeight: "bold"}}>Jina la Mnunuzi:</span> {user.SubAuthID > 1 ? user.SubAuthority : user.Authority} */}
            <span>Jina la Mnunuzi: </span> <span style={{fontWeight: "bold", color: "black"}}>{customerName}</span>
          {/* customerName */}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <span>Kiasi: </span><span style={{fontWeight: "bold", color: "black"}}>{formData.Amount}</span>
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <span>Uniti: </span><span style={{fontWeight: "bold", color: "black"}}>{formData.Units}</span>
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <span>Simu: </span><span style={{fontWeight: "bold", color: "black"}}>{formData.CPNo}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Rudi Nyuma</Button>
              {
                loading ? 
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress color="primary" />
                </Box> 
                : 
                <Button onClick={handleSendClose} autoFocus>
                  Thibitisha
                </Button>
              }
          {/* {loading && <CircularProgress />}
          <Button onClick={handleSendClose} autoFocus>
            Thibitisha
          </Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withStyles(styles) (BuyTokenTableList);
