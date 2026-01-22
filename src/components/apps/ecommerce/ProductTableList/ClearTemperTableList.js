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
import { fetchClearToken } from 'src/store/apps/eCommerce/ClearTokenSlice';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';

// --- NEW: uploaded file path (from your session) ---
const UPLOADED_FILE_URL = '/mnt/data/1da62e6d-f191-40b5-b168-ee27a508d705.png';
// ----------------------------------------------------------------

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
  const stabilizedThis = (array || []).map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'meterno', numeric: false, disablePadding: false, label: 'NAMBA YA MITA' },
  { id: 'cleartoken', numeric: false, disablePadding: false, label: 'TOKEN' },
  { id: 'generatedby', numeric: false, disablePadding: false, label: 'IMETOLEWA NA' },
  { id: 'generatedat', numeric: false, disablePadding: false, label: 'TAREHE ILIYOTOLEWA' },
  { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
];

const styles = theme => ({
  table: { minWidth: 650, overflowX: 'auto' },
});

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => { onRequestSort(event, property); };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{ 'aria-label': 'select all desserts' }} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
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
  html2canvas(input).then((canvas) => {
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
    <Toolbar sx={{
      pl: { sm: 2 }, pr: { xs: 1, sm: 1 },
      ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }),
    }}>
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2">{numSelected} selected</Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%' }}>
          <TextField InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            ),
          }}
            placeholder="search" size="small" onChange={handleSearch} value={search} />
        </Box>
      )}
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2">{numSelected} selected</Typography>
      ) : (
        <Tooltip title="Export to PDF">
          <Box variant="contained" color="primary" onClick={exportToPDF}><Button variant="contained" color="primary">Export to PDF</Button></Box>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = { numSelected: PropTypes.number.isRequired };

const BuyTokenTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [unit, setShowUnit] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editSelectedMeter, setEditSelectedMeter] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [customerDetails, setCustomerDetails] = React.useState([]);
  const [customerName, setCustomerName] = React.useState("");
  const [apiKey] = React.useState("ea362f523db8abd5");
  const [secretKey] = React.useState("N2RiZDMzZjQ3MThlMTViMmNhMzA4MzZmYWFjMTUwZjI3YjRlODYzZGY4YTU3MWE4NDIyMWFmMmE0ZWUzYzkyMA==");

  // redux
  const dispatch = useDispatch();
  const getProducts = useSelector((state) => state.ecommerceReducer.products || []);

  // local rows state mirrors redux data (used for search & table)
  const [rows, setRows] = React.useState(getProducts);
  const [search, setSearch] = React.useState('');

  // keep an initial form object to reset later
  const initialForm = {
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
  };

  const [formData, setFormData] = React.useState(initialForm);

  // push redux data to local rows whenever it changes
  React.useEffect(() => { setRows(getProducts || []); }, [getProducts]);

  // notifications
  const notifyToken = () => toast("Umefanikiwa kegenerate token ya clear Tamper", { position: "top-right", type: "success", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark", style: { fontSize: 12 } });
  const notifyTokenError = () => toast("Imeshindikana kupata token ya clear Tamper", { position: "top-right", type: "error", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark", style: { fontSize: 12 } });
  const notifySmsError = () => toast("Imeshindikana kutuma Tokeni", { position: "top-right", type: "error", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark", style: { fontSize: 12 } });

  // handle save (no SMS). After a successful save we dispatch fetchClearToken() to refresh table.
  const handleSaveOnly = async () => {
    try {
      setLoading(true);

      // Build payload for meter check
      const authorityIdRaw = localStorage.getItem('datauserauthid');
      const groupIdRaw = localStorage.getItem('datauserauthlevel');

      const authorityId = authorityIdRaw !== null && !Number.isNaN(Number(authorityIdRaw)) ? Number(authorityIdRaw) : authorityIdRaw;
      const groupId = groupIdRaw !== null && !Number.isNaN(Number(groupIdRaw)) ? Number(groupIdRaw) : groupIdRaw;

      const meterPayload = { MeterNo: formData.MeterID, AuthorityID: authorityId, GroupID: groupId };

      // verify meter existence / access
      const verifyResp = await axios.post('/users/singlemetersfrmcustomer', meterPayload);
      const verifyCode = verifyResp?.data?.code ?? verifyResp?.data?.message ?? null;
      if (Number(verifyCode) !== 200) {
        toast.error(`Meter ${formData.MeterID} not found or access denied`);
        setLoading(false);
        return;
      }

      // call ClearTamper
      const clearResp = await axios.post('/api/ClearTamper', {
        CompanyName: 'WazoPeak', UserName: 'Admin027', PassWord: '123456', CustomerId: '0001', METER_ID: formData.MeterID
      });

      const clearData = clearResp?.data;
      const rawTokenString = Array.isArray(clearData) ? String(clearData[0]) : String(clearData);
      const hasToken = rawTokenString && rawTokenString.trim() !== '' && rawTokenString.includes(',');
      if (!hasToken) {
        setLoading(false);
        notifyTokenError();
        return;
      }

      notifyToken();

      const [tokenPartRaw, timePartRaw] = rawTokenString.split(',');
      const tokenPart = tokenPartRaw ? tokenPartRaw.trim() : '';
      const timePart = timePartRaw ? timePartRaw.trim() : '';

      const normalizeTime = (t) => {
        if (!t) return null;
        const parts = t.split(' ');
        const datePart = (parts[0] || '').replace(/\//g, '-');
        const timePartInner = parts[1] || '00:00:00';
        const timeSegments = timePartInner.split(':').map((seg) => seg.padStart(2, '0'));
        return `${datePart} ${timeSegments.join(':')}`;
      };

      const generatedAt = normalizeTime(timePart);
      const generatedBy = localStorage.getItem('datauserid') || null;
      const authorId = localStorage.getItem('datauserauthid') || null;

      const savePayload = {
        MeterNo: formData.MeterID,
        ClearedToken: tokenPart,
        AuthorityID: authorId,
        GeneratedAt: generatedAt,
        GeneratedBy: generatedBy,
        AttachmentUrl: UPLOADED_FILE_URL
      };

      // Save the cleared token record
      let saveSuccess = false;
      try {
        const saveResult = await axios.post('/users/clearedtampertoken', savePayload);
        if (saveResult?.data?.code === '200' || saveResult?.data?.code === 200) {
          saveSuccess = true;
          toast.success(saveResult?.data?.message || 'Token record saved');
        } else {
          if (saveResult?.data) {
            saveSuccess = true;
            toast.success('Token record saved');
          } else {
            throw new Error('Unexpected save response');
          }
        }
      } catch (saveErr) {
        console.error('Failed saving cleared token:', saveErr?.response ?? saveErr);
        toast.error('Failed to save cleared token (server error).');
      }

      // If saved successfully, refresh tokens list from server via redux thunk
      if (saveSuccess) {
        try {
          // dispatch the thunk and wait for completion so UI updates quickly
          await dispatch(fetchClearToken());

          // --- NEW: clear form, selected rows and close dialogs on success ---
          setFormData(initialForm);     // reset the input fields
          setSelected([]);             // clear selections
          setModal(false);             // close the "generate" modal
          setOpenDialog(false);        // close the "confirm" dialog
          // --------------------------------------------------------
        } catch (fetchErr) {
          console.error('Error refreshing cleared token list:', fetchErr);
        }
      }

      // SMS sending block intentionally disabled (left commented)
      /*
      const messg = `Mita: ${formData.MeterID}\n\n${tokenPart}\n\nSababu: kufuta Temper`;
      // send SMS here if you re-enable
      */

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error in handleSaveOnly:', err?.response ?? err);
      toast.error('An error occurred. Please try again.');
    }
  };

  const toggle = () => { setModal(!modal); };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidForm = formData.MeterID;
    if (isValidForm) {
      setOpenDialog(true);
    } else {
      const el = document.querySelector(".form-error");
      if (el) { el.innerHTML = "Jaza nafasi zote zilizo wazi"; el.style.display = "block"; }
      console.log('Check your input field:', formData);
    }
  };

  // fetch initial list on mount
  React.useEffect(() => { dispatch(fetchClearToken()); }, [dispatch]);

  // search handler
  const handleSearch = (event) => {
    const q = (event.target.value || '').toLowerCase();
    const filteredRows = (getProducts || []).filter((row) => {
      return ((row.MeterNo || '').toLowerCase().includes(q)) ||
        ((row.ClearedToken || '').toLowerCase().includes(q)) ||
        ((row.GeneratedBy || '').toLowerCase().includes(q));
    });
    setSearch(event.target.value);
    setRows(filteredRows);
  };

  // sort/select handlers
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) { const newSelecteds = (rows || []).map((n) => n.Id); setSelected(newSelecteds); return; }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id); let newSelected = [];
    if (selectedIndex === -1) { newSelected = newSelected.concat(selected, id); }
    else if (selectedIndex === 0) { newSelected = newSelected.concat(selected.slice(1)); }
    else if (selectedIndex === selected.length - 1) { newSelected = newSelected.concat(selected.slice(0, -1)); }
    else if (selectedIndex > 0) { newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1)); }
    setSelected(newSelected);
  };

  const handleRowEditClick = (meter) => { setOpenDialog(true); setEditSelectedMeter(meter); };
  const handleCloseDialog = () => { setOpenDialog(false); };
  const handleChangePage = (event, newPage) => { setPage(newPage); };
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
  const handleChangeDense = (event) => { setDense(event.target.checked); };
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rows || []).length) : 0;

  return (
    <Box>
      <Box>
        <Tooltip>
          <ToastContainer style={{ fontSize: "10", fontFamily: "serif" }} />
          <Box variant="contained" color="primary">
            <Button title="Futa Temper" variant="contained" color="primary" onClick={toggle}>+ Clear Tamper</Button>
          </Box>
        </Tooltip>

        <EnhancedTableToolbar numSelected={selected.length} search={search} handleSearch={(event) => handleSearch(event)} />

        <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead numSelected={selected.length} order={order} orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={(rows || []).length} />
              <TableBody>
                {stableSort(rows || [], getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.Id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.Id} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <CustomCheckbox color="primary" checked={isItemSelected} inputprops={{ 'aria-labelledby': labelId }} />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box sx={{ ml: 2 }}>
                              <Typography color="textSecondary" variant="subtitle2">{row.MeterNo}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">{row.ClearedToken}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography color="textSecondary" variant="subtitle2">{row.GeneratedBy}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="subtitle2">{row.GeneratedAt ? row.GeneratedAt.replace('T', ' ').replace('.000Z', '') : 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip id={row.Id} title="Not Yet Active">
                            <IconButton size="small"><IconDotsVertical size="1.1rem" /></IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={(rows || []).length}
            rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
        </Paper>

        <Box ml={2}>
          <FormControlLabel control={<CustomSwitch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
        </Box>
      </Box>

      {/* Dialog popup */}
      <Dialog open={modal} onClose={toggle} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" variant="h5">{'Sehemu ya Kutengeneza Token ya Clear Tamper'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Clear Tamper<br /></DialogContentText>
          <Box mt={3}>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={12}>
                <FormLabel>Namba Ya Mita*</FormLabel>
                <TextField id="meterid" name='MeterID' size="small" variant="outlined" fullWidth value={formData.MeterID} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <Button variant="contained" color="primary" sx={{ mr: 1 }} type="submit"
                  disabled={!formData.MeterID} onClick={handleSubmit}>Generate Token</Button>
                <Button variant="contained" color="error" onClick={toggle}>Hairisha</Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog popup confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" variant="h5">{'Angalia na Thibitisha'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" />
          <DialogContentText id="alert-dialog-description"><span>Mita: </span><span style={{ fontWeight: "bold", color: "black" }}>{formData.MeterID}</span></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Rudi Nyuma</Button>
          {
            loading ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size={18} style={{ marginRight: 8 }} />
                GENERATING...
              </Box>
            ) : (
              <Button onClick={handleSaveOnly} autoFocus>Thibitisha U-Generate Tokeni</Button>
            )
          }
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withStyles(styles)(BuyTokenTableList);
