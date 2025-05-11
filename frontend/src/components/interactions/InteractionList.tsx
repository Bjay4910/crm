import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { Interaction, deleteInteraction } from '../../services/interactionService';
import { Customer } from '../../services/customerService';
import { useAuth } from '../../utils/AuthContext';

interface InteractionListProps {
  interactions: Interaction[];
  customer: Customer;
  onInteractionDeleted: () => void;
}

const InteractionList: React.FC<InteractionListProps> = ({
  interactions,
  onInteractionDeleted
}) => {
  const { currentUser } = useAuth();

  const getInteractionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return 'primary';
      case 'meeting':
        return 'success';
      case 'email':
        return 'info';
      case 'note':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      try {
        await deleteInteraction(id);
        onInteractionDeleted();
      } catch (error) {
        console.error('Error deleting interaction:', error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (interactions.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No interactions found for this customer.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }} disablePadding>
      {interactions.map((interaction, index) => (
        <React.Fragment key={interaction.id}>
          {index > 0 && <Divider component="li" />}
          <Paper elevation={0} sx={{ mb: 1 }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={interaction.type}
                      color={getInteractionTypeColor(interaction.type) as any}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(interaction.date || interaction.created_at || '')}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', whiteSpace: 'pre-line' }}
                    >
                      {interaction.description}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Recorded by: {interaction.user_name || 'Unknown'}
                    </Typography>
                  </Box>
                }
              />
              {currentUser && (interaction.user_id === currentUser.id || currentUser.role === 'admin') && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(interaction.id!)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </Paper>
        </React.Fragment>
      ))}
    </List>
  );
};

export default InteractionList;