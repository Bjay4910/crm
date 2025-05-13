import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Link,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateClickArg, EventClickArg, EventInput } from '@fullcalendar/core';

// Type definitions
interface Customer {
  id: number;
  name: string;
}

interface Interaction {
  id: number;
  customer_id: number;
  user_id: number;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  date: string;
  user_name: string;
  notes?: string;
  duration?: number;
  location?: string;
}

interface CalendarEvent extends EventInput {
  id: string | number;
  title: string;
  start: string;
  end: string;
  extendedProps: Interaction & {
    customer: string;
  };
  backgroundColor: string;
  borderColor: string;
}

interface FormData {
  customer_id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  date: string;
  notes: string;
  duration: number;
  location: string;
}

// Mock customer data
const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Acme Inc.' },
  { id: 2, name: 'Beta Corp' },
  { id: 3, name: 'Gamma LLC' }
];

// Mock interactions data with scheduled dates
const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: 1,
    customer_id: 1,
    user_id: 1,
    type: 'call',
    description: 'Follow-up call about new proposal',
    date: '2025-05-14T10:30:00',
    user_name: 'John Doe',
    notes: 'Need to discuss pricing options.',
    duration: 30
  },
  {
    id: 2,
    customer_id: 2,
    user_id: 1,
    type: 'meeting',
    description: 'Product demo with executive team',
    date: '2025-05-15T14:00:00',
    user_name: 'John Doe',
    notes: 'Prepare the latest version demo.',
    duration: 60,
    location: 'Client Office'
  },
  {
    id: 3,
    customer_id: 3,
    type: 'meeting',
    user_id: 2,
    description: 'Contract negotiation',
    date: '2025-05-13T11:00:00',
    user_name: 'Jane Smith',
    notes: 'Prepare the contract draft before the meeting.',
    duration: 90,
    location: 'Virtual'
  },
  {
    id: 4,
    customer_id: 1,
    user_id: 1,
    type: 'call',
    description: 'Quarterly business review',
    date: '2025-05-20T09:00:00',
    user_name: 'John Doe',
    notes: 'Prepare the Q1 report and metrics.',
    duration: 45
  }
];

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    customer_id: '',
    type: 'call',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    notes: '',
    duration: 30,
    location: ''
  });
  const [viewEventDialogOpen, setViewEventDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  useEffect(() => {
    // Simulate loading customers
    setCustomers(MOCK_CUSTOMERS);
    
    // Simulate loading interaction data
    setTimeout(() => {
      const calendarEvents: CalendarEvent[] = MOCK_INTERACTIONS.map(interaction => ({
        id: interaction.id,
        title: interaction.description,
        start: interaction.date,
        end: calculateEndTime(interaction.date, interaction.duration || 30),
        extendedProps: {
          ...interaction,
          customer: MOCK_CUSTOMERS.find(c => c.id === interaction.customer_id)?.name || 'Unknown'
        },
        backgroundColor: getEventColor(interaction.type),
        borderColor: getEventColor(interaction.type)
      }));
      
      setEvents(calendarEvents);
      setLoading(false);
    }, 1000);
  }, []);
  
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const end = new Date(new Date(startTime).getTime() + durationMinutes * 60000);
    return end.toISOString();
  };
  
  const getEventColor = (type: string): string => {
    switch (type) {
      case 'call':
        return '#1976d2'; // blue
      case 'meeting':
        return '#2e7d32'; // green
      case 'email':
        return '#0288d1'; // light blue
      case 'note':
        return '#757575'; // gray
      default:
        return '#1976d2'; // default blue
    }
  };
  
  const handleDateClick = (arg: DateClickArg): void => {
    // Pre-fill form with selected date
    setFormData({
      ...formData,
      date: arg.dateStr.includes('T') 
        ? arg.dateStr.slice(0, 16) 
        : `${arg.dateStr}T09:00`
    });
    setCreateDialogOpen(true);
  };
  
  const handleEventClick = (arg: EventClickArg): void => {
    setSelectedEvent(arg.event);
    setViewEventDialogOpen(true);
  };
  
  const handleCreateDialogOpen = (): void => {
    setFormData({
      customer_id: '',
      type: 'call',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      notes: '',
      duration: 30,
      location: ''
    });
    setCreateDialogOpen(true);
  };
  
  const handleEditDialogOpen = (): void => {
    if (!selectedEvent) return;
    
    setFormData({
      customer_id: selectedEvent.extendedProps.customer_id.toString(),
      type: selectedEvent.extendedProps.type,
      description: selectedEvent.title,
      date: new Date(selectedEvent.start).toISOString().slice(0, 16),
      notes: selectedEvent.extendedProps.notes || '',
      duration: selectedEvent.extendedProps.duration || 30,
      location: selectedEvent.extendedProps.location || ''
    });
    
    setViewEventDialogOpen(false);
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (): void => {
    if (!selectedEvent) return;
    setViewEventDialogOpen(false);
    setDeleteDialogOpen(true);
  };
  
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateSubmit = (): void => {
    // Simulate creating a new interaction and adding it to the calendar
    const newId = Math.max(...events.map(e => parseInt(e.id.toString()))) + 1;
    
    const newEvent: CalendarEvent = {
      id: newId,
      title: formData.description,
      start: formData.date,
      end: calculateEndTime(formData.date, formData.duration),
      extendedProps: {
        ...formData,
        id: newId,
        user_id: 1, // Default to current user
        user_name: 'John Doe', // Default to current user
        customer: customers.find(c => c.id === parseInt(formData.customer_id))?.name || 'Unknown',
        customer_id: parseInt(formData.customer_id)
      },
      backgroundColor: getEventColor(formData.type),
      borderColor: getEventColor(formData.type)
    };
    
    setEvents([...events, newEvent]);
    setCreateDialogOpen(false);
  };
  
  const handleEditSubmit = (): void => {
    // Simulate updating an interaction
    if (!selectedEvent) return;
    
    const updatedEvents = events.map(event => {
      if (event.id.toString() === selectedEvent.id.toString()) {
        return {
          ...event,
          title: formData.description,
          start: formData.date,
          end: calculateEndTime(formData.date, formData.duration),
          extendedProps: {
            ...event.extendedProps,
            ...formData,
            customer: customers.find(c => c.id === parseInt(formData.customer_id))?.name || 'Unknown',
            customer_id: parseInt(formData.customer_id)
          },
          backgroundColor: getEventColor(formData.type),
          borderColor: getEventColor(formData.type)
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    setEditDialogOpen(false);
  };
  
  const handleDeleteConfirm = (): void => {
    // Simulate deleting an interaction
    if (!selectedEvent) return;
    
    const updatedEvents = events.filter(event => event.id.toString() !== selectedEvent.id.toString());
    setEvents(updatedEvents);
    setDeleteDialogOpen(false);
  };
  
  const handleToday = (): void => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };
  
  const handlePrev = (): void => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };
  
  const handleNext = (): void => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };
  
  const handleViewChange = (view: string): void => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };
  
  const handleFilterCustomerChange = (e: SelectChangeEvent): void => {
    setFilterCustomer(e.target.value);
  };
  
  const handleFilterTypeChange = (e: SelectChangeEvent): void => {
    setFilterType(e.target.value);
  };
  
  // Filter events based on customer and type
  const filteredEvents = events.filter(event => {
    const passesCustomerFilter = filterCustomer === 'all' || 
      event.extendedProps.customer_id.toString() === filterCustomer;
    
    const passesTypeFilter = filterType === 'all' || 
      event.extendedProps.type === filterType;
    
    return passesCustomerFilter && passesTypeFilter;
  });
  
  const navigateToCustomer = (customerId: number): void => {
    if (customerId) {
      navigate(`/customers/${customerId}`);
      setViewEventDialogOpen(false);
    }
  };
  
  const navigateToInteractions = (customerId: number): void => {
    if (customerId) {
      navigate(`/interactions/${customerId}`);
      setViewEventDialogOpen(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Interaction Calendar
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            onClick={handleToday}
          >
            Today
          </Button>
          <IconButton onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNext}>
            <ChevronRightIcon />
          </IconButton>
          <Button
            variant="outlined"
            onClick={() => handleViewChange('dayGridMonth')}
          >
            Month
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleViewChange('timeGridWeek')}
          >
            Week
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleViewChange('timeGridDay')}
          >
            Day
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
          >
            New Interaction
          </Button>
        </Box>
      </Box>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Customer</InputLabel>
          <Select
            value={filterCustomer}
            onChange={handleFilterCustomerChange}
            label="Customer"
            size="small"
          >
            <MenuItem value="all">All Customers</MenuItem>
            {customers.map(customer => (
              <MenuItem key={customer.id} value={customer.id.toString()}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            onChange={handleFilterTypeChange}
            label="Type"
            size="small"
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="call">Calls</MenuItem>
            <MenuItem value="meeting">Meetings</MenuItem>
            <MenuItem value="email">Emails</MenuItem>
            <MenuItem value="note">Notes</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false} // Using custom header
          events={filteredEvents}
          height="auto"
          aspectRatio={1.5}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          weekends={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: '08:00',
            endTime: '18:00',
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={(arg) => (
            <Tooltip title={
              <Box>
                <Typography variant="subtitle2">{arg.event.title}</Typography>
                <Typography variant="body2">
                  {arg.event.extendedProps.customer}
                </Typography>
                <Typography variant="body2">
                  {new Date(arg.event.start!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                  {new Date(arg.event.end!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Typography>
                <Typography variant="body2">
                  {arg.event.extendedProps.type.toUpperCase()}
                </Typography>
              </Box>
            }>
              <Box 
                sx={{ 
                  overflow: 'hidden', 
                  whiteSpace: 'nowrap', 
                  textOverflow: 'ellipsis',
                  fontSize: '0.85em',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  p: '2px 4px'
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {arg.timeText && `${arg.timeText} | `}{arg.event.title}
                </Typography>
                {arg.view.type !== 'dayGridMonth' && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {arg.event.extendedProps.customer}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          )}
        />
      </Paper>
      
      {/* Create Interaction Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule New Interaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  label="Customer"
                  required
                >
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            
            {formData.type === 'meeting' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateSubmit} 
            variant="contained"
            disabled={!formData.description || !formData.customer_id || !formData.date}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Interaction Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Edit Scheduled Interaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  label="Customer"
                  required
                >
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type"
                >
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Date and Time"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            
            {formData.type === 'meeting' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={!formData.description || !formData.customer_id || !formData.date}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* View Event Dialog */}
      {selectedEvent && (
        <Dialog 
          open={viewEventDialogOpen} 
          onClose={() => setViewEventDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Interaction Details</Typography>
              <Chip 
                label={selectedEvent.extendedProps.type}
                color={
                  selectedEvent.extendedProps.type === 'call' ? 'primary' :
                  selectedEvent.extendedProps.type === 'meeting' ? 'success' :
                  selectedEvent.extendedProps.type === 'email' ? 'info' : 'default'
                }
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ my: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedEvent.title}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Link 
                    component="button"
                    variant="body1"
                    onClick={() => navigateToCustomer(selectedEvent.extendedProps.customer_id)}
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    {selectedEvent.extendedProps.customer}
                    <PersonIcon fontSize="small" />
                  </Link>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Assigned To</Typography>
                  <Typography variant="body1">{selectedEvent.extendedProps.user_name}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1">
                    {new Date(selectedEvent.start).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1">
                    {selectedEvent.extendedProps.duration || 30} minutes
                  </Typography>
                </Grid>
                
                {selectedEvent.extendedProps.location && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                    <Typography variant="body1">{selectedEvent.extendedProps.location}</Typography>
                  </Grid>
                )}
                
                {selectedEvent.extendedProps.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Notes</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedEvent.extendedProps.notes}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      onClick={() => navigateToInteractions(selectedEvent.extendedProps.customer_id)}
                    >
                      View All Interactions
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              startIcon={<DeleteIcon />} 
              color="error"
              onClick={handleDeleteDialogOpen}
            >
              Delete
            </Button>
            <Button 
              startIcon={<EditIcon />}
              onClick={handleEditDialogOpen}
            >
              Edit
            </Button>
            <Button 
              variant="contained"
              onClick={() => setViewEventDialogOpen(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Interaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this scheduled interaction? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;