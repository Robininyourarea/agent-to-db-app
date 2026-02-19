import { Box, Paper, Typography, Fade } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Image from 'next/image';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatProps {
  messages: Message[];
  isLoading?: boolean;
}

// Fixed Thinking animation component
const ThinkingAnimation = () => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Typography
        variant="body2"
        sx={{
          color: 'white', // Changed to white for better visibility
          fontStyle: 'italic',
          fontSize: '0.9rem',
        }}
      >
        Thinking
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.8)', // White dots for visibility
            animation: 'thinking 1.4s ease-in-out infinite',
            animationDelay: '0s',
            '@keyframes thinking': {
              '0%, 80%, 100%': {
                transform: 'scale(0.8)',
                opacity: 0.5,
              },
              '40%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            animation: 'thinking 1.4s ease-in-out infinite',
            animationDelay: '0.2s',
            '@keyframes thinking': {
              '0%, 80%, 100%': {
                transform: 'scale(0.8)',
                opacity: 0.5,
              },
              '40%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            animation: 'thinking 1.4s ease-in-out infinite',
            animationDelay: '0.4s',
            '@keyframes thinking': {
              '0%, 80%, 100%': {
                transform: 'scale(0.8)',
                opacity: 0.5,
              },
              '40%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default function Chat({ messages, isLoading = false }: Readonly<ChatProps>) {
  return (
    <Box>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: message.isUser ? 'flex-end' : 'flex-start',
            mb: 2,
          }}
        >
          {message.isUser ? (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 5,
                bgcolor: '#7e57c2',
                color: 'white',
                maxWidth: '85%',
                minWidth: '200px',
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ maxWidth: '85%', mt: 1 }}>
              <MarkdownRenderer>{message.text}</MarkdownRenderer>
            </Box>
          )}
        </Box>
      ))}

      {/* AI Thinking Animation */}
      {isLoading && (
        <Fade in={isLoading}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mb: 2,
            }}
          >
            {/* AI Avatar for thinking state */}


            {/* Thinking bubble */}
            <Box
              sx={{
                p: 2,
                maxWidth: '85%',
                minWidth: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <ThinkingAnimation />
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
}