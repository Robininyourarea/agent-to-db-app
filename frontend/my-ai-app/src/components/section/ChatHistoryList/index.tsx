'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  // Chip,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Session } from '../../../types/session';
import { sessionService } from '../../../services/sessionService';
import { useRouter } from 'next/navigation';

export default function ChatHistoryList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionService.getSessions();
      setSessions(response.sessions);
    } catch (err) {
      setError('Failed to load chat history');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  const handleRefresh = () => {
    fetchSessions();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
          Chats
        </Typography>
        <IconButton
          size="small"
          onClick={handleRefresh}
          disabled={loading}
          sx={{ color: 'text.secondary' }}
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Error message */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      {/* Session list */}
      <List sx={{
        width: '100%',
        height: error ? 'calc(100% - 120px)' : 'calc(100% - 60px)',
        overflow: 'auto',
        bgcolor: 'background.paper'
      }}>
        {sessions.length === 0 ? (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary" align="center">
                  chat history are empty
                </Typography>
              }
            />
          </ListItem>
        ) : (
          sessions.map((session) => (
            <React.Fragment key={session.session_id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSessionClick(session.session_id)}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 'calc(100% - 60px)',
                      }}
                    >
                      {session.preview}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(session.updated_at)}
                    </Typography>
                  </Box>

                  {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${session.message_count} message${session.message_count !== 1 ? 's' : ''}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </Box> */}
                </ListItemButton>
              </ListItem>
              {/* {index < sessions.length - 1 && <Divider />} */}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
} 