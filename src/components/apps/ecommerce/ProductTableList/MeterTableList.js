// MeterTableList.js (updated)
// --- important: this file renders rows in server response order (no re-ordering) ---

import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Stack,
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
import { fetchMeter } from 'src/store/apps/eCommerce/MeterSlice';
import CustomCheckbox from '../../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';

// Uploaded file path (local) — tooling will convert this to a proper URL when needed:
const UPLOADED_FILE_PATH = '/mnt/data/1da62e6d-f191-40b5-b168-ee27a508d705.png';

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
  { id: 'meterno', numeric: false, disablePadding: false, label: 'NAMBA YA MITA' },
  { id: 'model', numeric: false, disablePadding: false, label: 'MODELI' },
  { id: 'type', numeric: false, disablePadding: false, label: 'AINA YA MITA' },
  { id: 'createdby', numeric: false, disablePadding: false, label: 'MSAJILI' },
  { id: 'date', numeric: false, disablePadding: false, label: 'TAREHE YA USAJILI' },
  { id: 'action', numeric: false, disablePadding: false, label: 'ACTION' },
];

const styles = theme => ({
  table: {
    minWidth: 650,
    overflowX: 'auto',
  },
});

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => { onRequestSort(event, property); };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{ 'aria-label': 'select all' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* Keep label UI, but rendering will follow server order (see table body) */}
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
  if (!input) return;
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
    </Toolbar>
  );
};
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const MeterTableList = () => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editSelectedMeter, setEditSelectedMeter] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  // IMPORT-specific state
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [progressPct, setProgressPct] = React.useState(0);

  // New loading states for Add / Edit
  const [submitLoadingAdd, setSubmitLoadingAdd] = React.useState(false);
  const [submitLoadingEdit, setSubmitLoadingEdit] = React.useState(false);

  const notifyMeterRegisterError = () => toast("Imeshindikana Kusajili Mita", { position: "top-right", type: "error", autoClose: 5000, theme: "dark", style: {fontSize: 12}});
  const notifyMeterRegisterSuccess = () => toast("Umefanikiwa Kusajili Mita", { position: "top-right", type: "success", autoClose: 5000, theme: "dark", style: {fontSize: 12}});
  const notifyMeterUpdateError = () => toast("Imeshindikana Kubadili Taarifa za Mita", { position: "top-right", type: "error", autoClose: 5000, theme: "dark", style: {fontSize: 12}});
  const notifyMeterUpdateSuccess = () => toast("Umefanikiwa Kubadili Taarifa za Mita", { position: "top-right", type: "success", autoClose: 5000, theme: "dark", style: {fontSize: 12}});

  const toggle = () => {
    setModal(!modal);
  };

  const [formData, setFormData] = React.useState({
    CompanyName: 'WazoPeak',
    UserName: 'Admin027',
    PassWord: '123456',
    MeterID: '',
    Model: '',
    MeterType: '1',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const [formUpdateData, setFormUpdateData] = React.useState({
    CompanyName: 'WazoPeak',
    UserName: 'Admin027',
    PassWord: '123456',
    MeterID: editSelectedMeter?.MeterID || ' ',
    Model: editSelectedMeter?.Model || ' ',
    MeterType: '1',
    AuthLevel: localStorage.getItem('datauserauthlevel'),
    AuthID: localStorage.getItem('datauserauthid'),
    CreatedBy: localStorage.getItem('datauserid'),
    UpdatedBy: localStorage.getItem('datauserid'),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUpdateChange = (e) => {
    setFormUpdateData({ ...formUpdateData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchMeter());
  }, [dispatch]);

  const getProducts = useSelector((state) => state.ecommerceReducer.products || []);

  // rows mirrors server order; we keep server order intact here
  const [rows, setRows] = React.useState(getProducts);
  const [search, setSearch] = React.useState('');

  // whenever server data changes, re-sync rows and re-apply search filter (if any)
  React.useEffect(() => {
    const source = Array.isArray(getProducts) ? getProducts : [];
    if (!search) {
      setRows(source);
    } else {
      const q = (search || '').toLowerCase();
      setRows(source.filter((row) => {
        const meterNo = (row.MeterNo || '').toString().toLowerCase();
        const model = (row.Model || '').toString().toLowerCase();
        const createdBy = (row.CreatedBy || '').toString().toLowerCase();
        return meterNo.includes(q) || model.includes(q) || createdBy.includes(q);
      }));
    }
  }, [getProducts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoadingAdd(true);
    try {
      const response = await axios.post('/users/createMeter', formData);
      if (response.data.code == 200) {
        notifyMeterRegisterSuccess();
        setFormData({
          CompanyName: 'WazoPeak',
          UserName: 'Admin027',
          PassWord: '123456',
          MeterID: '',
          Model: '',
          MeterType: '1',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
        });
        // refresh server data so table renders with the new row in server order
        await dispatch(fetchMeter());
      } else {
        notifyMeterRegisterError();
      }
    } catch (error) {
      console.error('Error creating meter:', error);
      notifyMeterRegisterError();
    } finally {
      setSubmitLoadingAdd(false);
      setModal(false);
    }
  };

  const handleUpdateData = async (e) => {
    e.preventDefault();
    setSubmitLoadingEdit(true);
    try {
      const response = await axios.put('/users/updatemeter/' + editSelectedMeter?.MeterNo, formUpdateData);
      if (response.data.code == 200) {
        notifyMeterUpdateSuccess();
        setFormUpdateData({
          CompanyName: 'WazoPeak',
          UserName: 'Admin027',
          PassWord: '123456',
          MeterID: '',
          Model: '',
          MeterType: '1',
          AuthLevel: localStorage.getItem('datauserauthlevel'),
          AuthID: localStorage.getItem('datauserauthid'),
          CreatedBy: localStorage.getItem('datauserid'),
          UpdatedBy: localStorage.getItem('datauserid'),
        });
        // refresh server data so table renders with updated row (server order preserved)
        await dispatch(fetchMeter());
      } else {
        notifyMeterUpdateError();
      }
    } catch (error) {
      console.error('Error updating meter:', error);
      notifyMeterUpdateError();
    } finally {
      setSubmitLoadingEdit(false);
      setOpenDialog(false);
    }
  };

  // IMPORT helpers (unchanged) - dispatch(fetchMeter()) already called after import success
  const handleImportClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = ['.xlsx', '.xls', '.csv'];
    const ext = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
    if (!allowed.includes(`.${ext}`)) {
      toast.error('Unsupported file type. Use .xlsx, .xls or .csv');
      event.target.value = '';
      return;
    }
    if (!window.confirm(`Upload ${file.name}?`)) { event.target.value = ''; return; }

    const meta = {
      AuthLevel: localStorage.getItem('datauserauthlevel'),
      AuthID: localStorage.getItem('datauserauthid'),
      username: localStorage.getItem('datauserid'),
    };
    if (!meta.AuthLevel || !meta.AuthID || !meta.username) {
      toast.error('Missing auth information. Please login.');
      event.target.value = '';
      return;
    }

    const formDataLocal = new FormData();
    formDataLocal.append('file', file);
    formDataLocal.append('meta', JSON.stringify(meta));

    setUploading(true);
    setProgressPct(0);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {};

      const response = await axios.post('/users/import', formDataLocal, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.lengthComputable) return;
          setProgressPct(Math.round((evt.loaded * 100) / evt.total));
        },
        timeout: 5 * 60 * 1000
      });

      const resData = response.data;
      if (resData && (resData.code === '200' || resData.code === 200)) {
        toast.success(resData.message || 'Imported successfully');
        // refresh server data so table renders with imported rows in server order
        await dispatch(fetchMeter());
      } else {
        toast.error(resData.message || 'Import failed');
      }
    } catch (err) {
      console.error('Import error:', err);
      const serverMessage = err?.response?.data?.message || err.message || 'Upload failed';
      toast.error(`Import failed: ${serverMessage}`);
    } finally {
      setUploading(false);
      setProgressPct(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSearch = (event) => {
    const q = (event.target.value || '').toLowerCase();
    setSearch(q);
    const source = Array.isArray(getProducts) ? getProducts : [];
    if (!q) {
      setRows(source);
      return;
    }
    setRows(source.filter((row) => {
      const meterNo = (row.MeterNo || '').toString().toLowerCase();
      const model = (row.Model || '').toString().toLowerCase();
      const createdBy = (row.CreatedBy || '').toString().toLowerCase();
      return meterNo.includes(q) || model.includes(q) || createdBy.includes(q);
    }));
  };

  // sorting handlers are left in place but not applied when rendering rows
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = (rows || []).map((n) => n.Id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Row click selects only the clicked one
  const handleClick = (event, id) => {
    event.stopPropagation && event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    if (selectedIndex === -1) {
      setSelected([id]); // only the clicked one
    } else {
      setSelected([]); // toggle off
    }
  };

  const handleRowEditClick = (meter) => {
    setOpenDialog(true);
    setEditSelectedMeter(meter);
    setFormUpdateData({
      CompanyName: 'WazoPeak',
      UserName: 'Admin027',
      PassWord: '123456',
      MeterID: meter?.MeterNo,
      Model: meter?.Model,
      MeterType: meter?.MeterType,
      AuthLevel: localStorage.getItem('datauserauthlevel'),
      AuthID: localStorage.getItem('datauserauthid'),
      CreatedBy: localStorage.getItem('datauserid'),
      UpdatedBy: localStorage.getItem('datauserid'),
    });
  };

  const handleCloseDialog = () => { setOpenDialog(false); };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
  const handleChangeDense = (event) => setDense(event.target.checked);
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rows || []).length) : 0;

  return (
    <Box>
      <Box>
        <ToastContainer style={{ fontSize: "10", fontFamily: "serif" }} />

        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileChange} />

        <Tooltip>
          <Stack direction="row" spacing={2}>
            <Button title="Sajili Mita Mpya" variant="contained" color="primary" onClick={toggle} disabled={uploading}>+ Mita</Button>

            <Button title="Import Mita" variant="contained" color="primary" onClick={handleImportClick} disabled={uploading}>
              {uploading ? (<><CircularProgress size={18} style={{ marginRight: 8 }} />Importing {progressPct}%</>) : ('+ Import')}
            </Button>
          </Stack>
        </Tooltip>

        <EnhancedTableToolbar numSelected={selected.length} search={search} handleSearch={(event) => handleSearch(event)} />
        <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={(rows || []).length}
              />
              <TableBody>
                {/* IMPORTANT CHANGE: render rows in server response order (rows already mirrors getProducts) */}
                { (rows || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleClick(e, row.Id)}
                          inputprops={{ 'aria-labelledby': labelId }}
                        />
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
                          <Typography color="textSecondary" variant="subtitle2">{row.Model}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography color="textSecondary" variant="subtitle2">{row.Type}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography color="textSecondary" variant="subtitle2">{row.RegisteredBy}</Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography color="textSecondary" variant="subtitle2">{row.CreatedAt ? row.CreatedAt.replace('T', ' ').replace('.000Z', '') : 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip id={row.Id} title="Edit">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRowEditClick(row); }}>
                            <IconDotsVertical size="1.1rem" />
                          </IconButton>
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

      {/* Register dialog */}
      <Dialog open={modal} onClose={toggle} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" variant="h5">{'Sajili Mita'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Ingiza Taarifa za Mita. <br/> Kisha Bonyeza Kitufe Cha Sajili.</DialogContentText>
          <Box mt={3}>
            <form onSubmit={handleSubmit}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Namba Ya Mita</FormLabel>
                  <TextField id="meterid" name='MeterID' size="small" variant="outlined" fullWidth value={formData.MeterID} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Modeli Ya Mita</FormLabel>
                  <TextField id="model" name='Model' size="small" variant="outlined" fullWidth value={formData.Model} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button variant="contained" color="primary" sx={{ mr: 1 }} type="submit" disabled={formData.MeterID.length === 0 || submitLoadingAdd}>
                    {submitLoadingAdd ? (<><CircularProgress size={18} style={{ marginRight: 8 }} />SAJILI...</>) : ('SAJILI')}
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle} disabled={submitLoadingAdd}>HAIRISHA</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" variant="h5">{'BADILI TAARIFA ZA MITA'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Badili taarifa za Mita na kisha. <br/> Bofya kitufe cha BADILI.</DialogContentText>
          <Box mt={3}>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={6}>
                <FormLabel>Namba Ya Mita</FormLabel>
                <TextField id="meterid" name='MeterID' size="small" variant="outlined" fullWidth value={formUpdateData.MeterID} onChange={handleUpdateChange} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel>Model</FormLabel>
                <TextField id="model" name='Model' size="small" variant="outlined" fullWidth value={formUpdateData.Model} onChange={handleUpdateChange} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <Button variant="contained" color="primary" sx={{ mr: 1 }} type="submit" disabled={!editSelectedMeter?.MeterNo || submitLoadingEdit} onClick={handleUpdateData}>
                  {submitLoadingEdit ? (<><CircularProgress size={18} style={{ marginRight: 8 }} />BADILI...</>) : ('BADILI')}
                </Button>
                <Button variant="contained" color="error" onClick={handleCloseDialog} disabled={submitLoadingEdit}>AHIRISHA</Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default withStyles(styles)(MeterTableList);
