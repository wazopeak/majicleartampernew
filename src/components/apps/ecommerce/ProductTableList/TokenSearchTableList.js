import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './index.css';
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

import CustomFormLabel from '../../../forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../forms/theme-elements/CustomSelect';

import { withStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { visuallyHidden } from '@mui/utils';

import { useSelector, useDispatch } from 'react-redux';
// import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import { fetchSpiritualItem } from 'src/store/apps/eCommerce/SpiritualItemSlice';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';

import printJS from 'print-js';

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
    id: 'nambayamita',
    numeric: false,
    disablePadding: false,
    label: 'NAMBA YA MITA',
  },
  {
    id: 'mteja',
    numeric: false,
    disablePadding: false,
    label: 'MTEJA',
  },
  {
    id: 'unitI',
    numeric: false,
    disablePadding: false,
    label: 'UNITI',
  },
  {
    id: 'token',
    numeric: false,
    disablePadding: false,
    label: 'TOKENI',
  },
  {
    id: 'gharama',
    numeric: false,
    disablePadding: false,
    label: 'GHARAMA',
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
            placeholder="Andika Namba ya Mita"
            size="small"
            onChange={handleSearch}
            value={search}
          />
        </Box>
      )}

      {/* {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 290%' }}>
          <Box variant="contained" color="primary" >
              <Button variant="contained" color="primary">Tafuta</Button>
          </Box>
        </Box>
      )} */}

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

const SpiritualItemTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const ref = React.useRef(null);
  const [apiKey, setApiKey] = React.useState("ea362f523db8abd5");
  const [secretKey, setSecretKey] = React.useState("N2RiZDMzZjQ3MThlMTViMmNhMzA4MzZmYWFjMTUwZjI3YjRlODYzZGY4YTU3MWE4NDIyMWFmMmE0ZWUzYzkyMA==");
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editSelectedUser, setEditSelectedUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [customerDetails, setCustomerDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [postcpno, setPostCpno] = React.useState({
    cpno: "",
  });

  const notifyTokenSearchError = () => toast("Imeshindikana",{
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

  const notifyTokenSearchSuccess = () => toast("Umefanikiwa",{
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

  const notifyTokenSearchUpdateError = () => toast("Imeshindikana",{
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

  const notifyTokenSearchUpdateSuccess = () => toast("Umefanikiwa",{
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

  const toggle = () => {
    setModal(!modal);
  };

  const handleResendClose = () => { 
    setLoading(true);

    const isValidForm = formData.CPNo
    // console.log("isValidForm");
    // console.log(isValidForm);
    if (isValidForm) {
      console.log("postcpno");
      console.log(postcpno);
      var mob = isValidForm;
      console.log(mob);
      var firstChar = mob[0];
      if(firstChar == 0){
        mob = mob.replace(firstChar, '255');
      }

      // const meterNo = (document.getElementById('meter').innerText).split(" ",2)[1];
      const meterNo = (document.getElementById('meter').innerText);
      // const tariff = (document.getElementById('tariff').innerText).split(" ",2)[1];
      const tariff = (document.getElementById('tariff').innerText);
      // const unit = ((document.getElementById('unit').innerText).split("/",2)[1]).replace(" ",2)[0];
      // const unitt = (document.getElementById('unit').innerText).split("/",2)[1];
      // const unit = unitt.split(" ",2)[0];
      const risiti = (document.getElementById('risiti').innerText);
      const controlN = (document.getElementById('control').innerText);
      const unit = (document.getElementById('unit').innerText);
      const token = document.getElementById('myToken').innerText;
      // const costs = (document.getElementById('total').innerText).split(": ",2)[1];
      // const cost = costs.split(" ",2)[1];
      const cost = (document.getElementById('total').innerText);
      console.log("unit: "+cost)
      // const vat = (document.getElementById('vat').innerText).split(" ",2)[1];
      const vat = (document.getElementById('vat').innerText);
      // const totals = ((document.getElementById('total').innerText).split(": ",2)[1]);
      // const total = totals.split(" ",2)[1];
      const total = (document.getElementById('total').innerText); 
    //   }, []);



      //   console.log("post.Tariff: "+postt.Tariff);
      // var messg = authority +"\n"+ meterId + "\n"+ totalUnits + " m3" + "\n \n" + token + "\n \n" + "TOTAL " + totalPaid;
      var messg = tariff +"\n"+ meterNo + "\n"+ unit + " m3" + "\n" + risiti + "\n" + controlN + "\n \n" + token + "\n \n" + cost + "\n" + vat + "\n" + total;
      // var messg = "WPT-HOME" +"\n"+ "58760009123" + "\n"+ "25" + " m3" + "\n \n" + "0000 0000 0000 0000 0000" + "\n \n" + "TOTAL " + "50000";
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
          notifySmsSent();
          setLoading(false);
          setOpenDialog(false)
          console.log(response, apiKey + ":" + secretKey)
        }
        else{
          setLoading(false);
          notifySmsError();
          console.log(response, apiKey + ":" + secretKey)
        }
      })
      .catch((error) => {
        setLoading(false);
        notifySmsError();
        console.error(error.response.data)
      })
    }
    else{
      // setShowError(true);
      setLoading(false);
      document.querySelector(".mobile-error").innerHTML = "Weka namba ya simu utakayotumiwa tokeni";
      document.querySelector(".mobile-error").style.display = "block";
      console.log('Check your input field:', post);
    }
    
  };

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

    //Receipt Print
    const handlePrint = (editSelectedUser) => {

      // console.log("customerDetails below: ");
      // console.log(customerDetails);
  
      const content = `
      <style>
      #invoice-POS{
        box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
        padding:2mm;
        margin: 0 auto;
        width: 65mm;
        background: #FFF;
        
    }
      ::selection {background: #f31544; color: #FFF;}
      ::moz-selection {background: #f31544; color: #FFF;}
      h1{
        font-size: 1.5em;
        color: #222;
      }
      h2{font-size: .9em;}
      h3{
        font-size: 1.2em;
        font-weight: 300;
        line-height: 2em;
      }
      p{
        font-size: .7em;
        color: #666;
        line-height: 1.2em;
      }
      hr{
        /* background-color:#222; */
        border-top: 3px dotted rgb(0, 0, 0);
        /* height: 3px;
        width: 50%; */
       }
       #pno{
        border: none;
        border-bottom: 2px solid rgb(2, 2, 2);
      }
      #pno:focus{
        border: none;
        border-bottom: 2px solid rgb(2, 2, 2);
      }
       
      /* #top, #mid, #bot{ Targets all id with 'col-'
        border-bottom: 1px solid #EEE;
      } */
      
      #top{
        min-height: 40px;
        /* margin-bottom: 5%; */
      }
      #mid{
        min-height: 60px;
        margin-top: 5%;
        /* margin-bottom: 5%; */
        text-align: center;
        color: black;
        font-size: larger;
      } 
      #midd{
        min-height: 10px;
        margin-top: 5%;
        margin-bottom: 5%;
        text-align: left;
        color: black;
        font-size: small;
      } 
      #date{
        min-height: 10px;
        margin-top: 5%;
        margin-bottom: 5%;
        text-align: center;
        color: black;
        font-size: small;
      } 
      #bot{ 
        min-height: 30px;
        text-align: center;
      }
      
      #top .logo{
        /* float: left; */
          height: 60px;
          width: 60px;
          background: url("http://michaeltruong.ca/images/logo1.png") no-repeat;
          background-size: 60px 60px;
      }
      .clientlogo{
        float: left;
          height: 60px;
          width: 60px;
          background: url("http://michaeltruong.ca/images/client.jpg") no-repeat;
          background-size: 60px 60px;
        border-radius: 50px;
      }
      .info{
        display: block;
        /* //float:left; */
        margin-left: 0;
      }
      .title{
        float: right;
      }
      .title p{text-align: right;} 
      table{
        width: 100%;
        border-collapse: collapse;
      }
      /* td{ */
        /* //padding: 5px 0 5px 15px;
        //border: 1px solid #EEE */
      /* } */
      .tabletitle{
        /* //padding: 5px; */
        font-size: .5em;
        background: #EEE;
      }
      .service{border-bottom: 1px solid #EEE;}
      .item{width: 24mm;}
      .itemtext{font-size: .5em;}
      
      #legalcopy{
        margin-top: 5mm;
        font-style: italic;
        font-size: larger;
      }
      </style>
      <div id="invoice-POS">
                      
          <center id="top">
              <div class="logo"></div>
              <div class="info"> 
                  <h2 style={{color: "black", fontSize: "0.7em" }}>RISITI HALALI YA MAUZO YA MAJI</h2>
                  <h2>`+customerDetails.Auth+`</h2>
                  <p> 
                      <span>`+customerDetails.AuthBox+`</span><br/>
                      <span>`+customerDetails.AuthPNo+`</span><br/>
                      <span>`+customerDetails.AuthEmail+`</span>
                  </p>
              </div>
          </center><br/>
          
          <div id="mid">
              <div class="info">
                  <!-- {/* <h2>7896 4523 6543 9878 5123</h2> */} -->
                  <h2><span ref={ref} id="myToken">`+editSelectedUser?.Token+`</span></h2>
                  <!-- {/* 7896 4523 6543 9878 5123 */} -->
                  <!-- {/* {console.log(tokenSearchedData)} */} -->
              </div>
          </div>
  
          <hr/>
          <div id="midd">
              <div class="info">
                  <span>JINA:     `+editSelectedUser?.CusName+`</span><br/>
                  <!-- {/* {console.log((row.AMOUNT).split('/')[1])} */} -->
                  <span>NAMBA:    `+editSelectedUser?.CusNo+`</span><br/>
                  <span>TIN:      `+editSelectedUser?.TIN+`</span><br/>
                  <span>VRN:      `+editSelectedUser?.VRN+`</span><br/>
                  <span ref={ref} id="tariff">TARRIF:   `+editSelectedUser?.Tarrif+`</span><br/>
                  <span ref={ref} id="risiti">RISITI Na:   `+editSelectedUser?.TransNo+`</span><br/>
                  <span ref={ref} id="control">CONTROL Na:   `+editSelectedUser?.ControlNo+`</span><br/>
              </div>
          </div>
          <hr/>
  
          <div id="midd">
              <div class="info">
                  <span ref={ref} id="meter">MITA:     `+editSelectedUser?.MeterNo+`</span><br/>
                  <span ref={ref} id="unit">UNITI:     `+editSelectedUser?.Unit+ `</span><br/>
                  <!-- {/* <>KIASI:    {row.NET_VALUE}</><br/> */} -->
                  <!-- {/* <span>{row.AMOUNT}</span><br/> */} -->
                  <span ref={ref} id="vat">VAT:      `+editSelectedUser?.VAT+`</span><br/> 
                  <span ref={ref} id="total">JUMLA:    TZS`+ editSelectedUser?.Total+`</span><br/>
              </div>
          </div>
          <hr/>
  
          <div id="date">
              <div class="info">
                  <span>DATE:     `+editSelectedUser?.GenTime+`</span>
              </div>
          </div>
          
          <div id="bot">
              <div id="legalcopy">
                  <p class="legal"><strong>Maji Bombani!!!</strong>  
                  </p>
              </div>
  
          </div> 
      </div>
  
      `;
  
  
      printJS({
        printable: content,
        type: 'raw-html',
      });
  
      // setTimeout(() => {
      //   document.body.removeChild(iframe);
      // }, 1000);
      
    };
  
    const handleClickk = () => {
      // Call the first function
      handleResendClose();
  
      // Call the second function
      handlePrint(editSelectedUser);
    };

  const handleDialogClose = () => { 
    setLoading(false);
    setOpenDialog(false);
  };

  const [formData, setFormData] = React.useState({
    MeterNo: '',
    CPNo: '',
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const [formUpdateData, setFormUpdateData] = React.useState({
    MeterNo: editSelectedUser?.MeterNo || ' ',
    CPNo: editSelectedUser?.CusNo || ' ',
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  // form validation
  const validationRules = {
    cpno: !!postcpno.cpno,
  };
  const validate = field => {
    return postcpno[field]
        ? 'error'
        : undefined
  }

  const mobileInput = (event) => {
    setPostCpno(
      {
        ...postcpno,
        cpno:event.target.value
      }
    );
  }

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
      const response = await axios.get('/users/getallreceipt/'+formData.MeterNo, formData);
      if(response.data.code == 200){

        setLoading(false);
        setRows(response.data.message);

        // querying wpt api
        axios.get('/users/customername/'+formData.MeterNo, formData)
        .then((response) => {
            if(response.data.code == 200){
              setCustomerDetails(response.data.message[0]);
              
              // notifyTokenSearchSuccess();

              // setFormData({ 
              //   MeterNo: '',
              //   CreatedBy: localStorage.getItem('datauserid'),
              //   UpdatedBy: localStorage.getItem('datauserid'),
              // });
            }
            else{
            console.log(response)
            }
        })
        .catch((error) => {
            console.error(error.response.data)
        })
      }
      else{
        setLoading(false);
        notifyTokenSearchError();
      }
      
    } catch (error) {
      console.error('Error while getting all transactions:', error);
      setLoading(false);
      notifyTokenSearchError();
    }
    // setModal(!modal);
  };


  // const dispatch = useDispatch();
  //Fetch Products
  // React.useEffect(() => {
    // dispatch(fetchProducts());
  //   dispatch(fetchSpiritualItem());
  // }, [dispatch]);

  // const getProducts = useSelector((state) => state.ecommerceReducer.products);
  console.log("rows");
  console.log(rows);
  const [search, setSearch] = React.useState('');

  // React.useEffect(() => {
    // setRows(getProducts);
  // }, [getProducts]);

  const handleSearch = (event) => {
    const filteredRows = rows.filter((row) => {
      return ( (row.Total.toLowerCase().includes(event.target.value)) || (row.GenTime.toLowerCase().includes(event.target.value)) );
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
  const handleRowEditClick = (spitem) => {
    setOpenDialog(true);
    setEditSelectedUser(spitem);
    setFormUpdateData({ 
      MeterNo: spitem?.MeterNo,
      CreatedBy: localStorage.getItem('datauserid'),
      UpdatedBy: localStorage.getItem('datauserid'),
   });
  };

  // const handleUpdateData = async (e) => {
  //   // Update user logic here
  //   console.log(formUpdateData);
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put('http://172.20.10.8:2004/users/updatespiritualitem/'+editSelectedUser.Id, formUpdateData);
  //     if(response.data.code == 200){

  //       notifyTokenSearchUpdateSuccess();

  //       setFormUpdateData({ 
  //         MeterNo: '',
  //         CreatedBy: localStorage.getItem('datauserid'),
  //         UpdatedBy: localStorage.getItem('datauserid'),
  //      });
  //     }
  //     else{
  //       notifyTokenSearchUpdateError();
  //     }
      
  //   } catch (error) {
  //     console.error('Error creating spiritual item:', error);
  //     notifyTokenSearchUpdateError();
  //   }
  //   // setModal(!modal);
  //   handleDialogClose();
  // };

  //Closing Dialog
  // const handleDialogClose = () => {
  //   setOpenDialog(false);
  // };

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
        <Box sx={{ flex: '1 1 100%' }}>
            <ToastContainer 
              style={{ fontSize: "10", fontFamily: "serif" }}
            />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Andika Namba ya Mita"
            id="meterno"
            name='MeterNo'
            size="small"
            value={formData.MeterNo}
            onChange={handleChange}
          />
          {
              loading ? 
              <Box sx={{ display: 'flex' }} center>
                  <CircularProgress color="primary" />
              </Box> 
              :
              <Button title="tafuta tokeni" variant="contained" color="primary" onClick={handleSubmit}>Tafuta</Button>
          }
        </Box>
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
                            {/* <Avatar
                              src={row.photo}
                              alt={row.photo}
                              variant="rounded"
                              sx={{ width: 56, height: 56, borderRadius: '100%' }}
                            /> */}
                            <Box
                              sx={{
                                ml: 2,
                              }}
                            >
                              {/* <Typography variant="h6" fontWeight="600">
                                {row.Name}
                              </Typography> */}
                              <Typography color="textSecondary" variant="subtitle2">
                                {row.MeterNo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {/* <Typography>{format(new Date(row.created), 'E, MMM d yyyy')}</Typography> */}
                          <Typography color="textSecondary" variant="subtitle2">
                                {row.CusName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* <Typography>{format(new Date(row.created), 'E, MMM d yyyy')}</Typography> */}
                          <Typography color="textSecondary" variant="subtitle2">
                                {row.Unit}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* <Typography>{format(new Date(row.created), 'E, MMM d yyyy')}</Typography> */}
                          <Typography color="textSecondary" variant="subtitle2">
                                {row.Token}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* <Typography>{format(new Date(row.created), 'E, MMM d yyyy')}</Typography> */}
                          <Typography color="textSecondary" variant="subtitle2">
                                {row.Price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* <Typography>{format(new Date(row.created), 'E, MMM d yyyy')}</Typography> */}
                          <Typography color="textSecondary" variant="subtitle2">
                                {row.VAT}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="subtitle2">
                            {((row.GenTime).replace('T', ' ').replace('.000Z', ''))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="subtitle2">
                            {((row.GenTime).replace('T', ' ').replace('.000Z', ''))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip id={row.Id} title="View Receipt" onClick={() => handleRowEditClick(row)}>
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
        open={openDialog} 
        onClose={handleDialogClose}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {/* <MDBox mb={2}>
              <MDInput type="text" onChange={mobileInput} label="Bonyeza hapa kuweka Namba Ya Simu" name="cpno" variant="standard" fullWidth required className={validate('cpno')} />
              <p class="error mobile-error"></p>
          </MDBox>  */}
          <Grid item xs={12} lg={12}>
            <TextField
              id="cpno"
              name='CPNo'
              // className={validate('cpno')}
              size="small"
              variant="outlined"
              placeholder="Bonyeza hapa kuweka Namba Ya Simu"
              fullWidth
              value={formData.CPNo}
              onChange={handleChange}
            />
          </Grid> 
          <div id="invoice-POS">
                      
            <center id="top">
                <div class="logo"></div>
                <div class="info"> 
                    <h2 style={{color: "black", fontSize: "0.7em" }}>RISITI HALALI YA MAUZO YA MAJI</h2>
                    <h2>{customerDetails.Auth}</h2>
                    <p> 
                        <span>{customerDetails.AuthBox}</span><br/>
                        <span>{customerDetails.AuthPNo}</span><br/>
                        <span>{customerDetails.AuthEmail}</span>
                    </p>
                </div>
            </center><br/>
            
            <div id="mid">
                <div class="info">
                    {/* <h2>7896 4523 6543 9878 5123</h2> */}
                    <h2><span ref={ref} id="myToken">{editSelectedUser?.Token}</span></h2>
                    {/* 7896 4523 6543 9878 5123 */}
                    {/* {console.log(tokenSearchedData)} */}
                </div>
            </div>

            <hr/>
            <div id="midd">
                <div class="info">
                    <span>JINA:     {editSelectedUser?.CusName}</span><br/>
                    {/* {console.log((row.AMOUNT).split('/')[1])} */}
                    <span>NAMBA:    {editSelectedUser?.CusNo}</span><br/>
                    <span>TIN:      {editSelectedUser?.TIN}</span><br/>
                    <span>VRN:      {editSelectedUser?.VRN}</span><br/>
                    <span ref={ref} id="tariff">TARRIF:   {editSelectedUser?.Tarrif}</span><br/>
                    <span ref={ref} id="risiti">RISITI Na:   {editSelectedUser?.TransNo}</span><br/>
                    <span ref={ref} id="control">CONTROL Na:   {editSelectedUser?.ControlNo}</span><br/>
                </div>
            </div>
            <hr/>

            <div id="midd">
                <div class="info">
                    <span ref={ref} id="meter">MITA:     {editSelectedUser?.MeterNo}</span><br/>
                    <span ref={ref} id="unit">UNITI:     {editSelectedUser?.Unit}</span><br/>
                    {/* <>KIASI:    {row.NET_VALUE}</><br/> */}
                    {/* <span>{row.AMOUNT}</span><br/> */}
                    <span ref={ref} id="vat">VAT:      {editSelectedUser?.VAT}</span><br/>
                    <span ref={ref} id="total">JUMLA:    TZS {editSelectedUser?.Total}</span><br/>
                </div>
            </div>
            <hr/>

            <div id="date">
                <div class="info">
                    <span>DATE:     {editSelectedUser?.GenTime}</span>
                </div>
            </div>
            
            <div id="bot">
                <div id="legalcopy">
                    <p class="legal"><strong>Maji Bombani!!!</strong>  
                    </p>
                </div>

            </div> 
          </div>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose}>Rudi Nyuma</Button>
            {
                loading ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress color="primary" />
                </Box> 
                :
                <Box>
                    <Button onClick={handleClickk} autoFocus>
                        Meseji na Risiti
                    </Button>
                    <Button onClick={handleResendClose} autoFocus>
                        Meseji Pekee
                    </Button>
                </Box> 
            }
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withStyles(styles) (SpiritualItemTableList);
