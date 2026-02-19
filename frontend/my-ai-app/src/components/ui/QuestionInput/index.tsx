import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, KeyboardEvent } from 'react';

type QuestionInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  loading: boolean;
  disabled: boolean;
};

export default function QuestionInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  loading,
  disabled,
}: Readonly<QuestionInputProps>) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50px',
          padding: '2px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #4facfe 50%, #00f2fe 75%, #fa709a 100%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor',
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&:hover::before': {
          opacity: 1,
        },
        '&:focus-within::before': {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50px', // Pill shape
          padding: '8px 12px',
          minHeight: 56,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'transparent',
          },
          '&:focus-within': {
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'transparent',
            boxShadow: '0 0 0 2px rgba(144, 202, 249, 0.2)',
          },
          transition: 'all 0.2s ease-in-out',
          width: '100%',
        }}
      >
        {/* Add Button */}
        <IconButton
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mr: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>

        {/* Text Input */}
        <TextField
          fullWidth
          placeholder="Ask any question with zentrix.ai ..."
          variant="standard"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          InputProps={{
            disableUnderline: true,
            sx: {
              color: 'white',
              fontSize: '1rem',
              '& input': {
                padding: 0,
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                },
              },
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              '&:before': { display: 'none' },
              '&:after': { display: 'none' },
            },
          }}
        />

        {/* Send Button */}
        <IconButton
          onClick={onSend}
          disabled={loading || disabled}
          sx={{
            ml: 1,
            bgcolor: value.trim() ? 'white' : 'rgba(255, 255, 255, 0.1)',
            color: value.trim() ? 'black' : 'rgba(255, 255, 255, 0.5)',
            width: 40,
            height: 40,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: value.trim() ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
              transform: value.trim() ? 'scale(1.05)' : 'none',
            },
            '&:disabled': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
              transform: 'none',
            },
          }}
        >
          <SendIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}