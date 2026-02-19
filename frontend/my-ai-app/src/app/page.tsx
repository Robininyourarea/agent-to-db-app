"use client"
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import PromptCards from '../components/ui/PromptCards';
import QuestionInput from '../components/ui/QuestionInput';

interface Prompt {
  title: string;
}

const prompts: Prompt[] = [
  { title: 'What is the total sales for today?' },
  { title: 'Top 5 best-selling products last month?' },
  { title: 'Which items are running low on stock?' },
  { title: 'Which orders have pending payments?' },
];

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState('');

  // Handle prompt card click
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle Enter key press
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Navigate to /chat which will auto-create a session and then redirect
  // with the query parameter
  const handleSend = () => {
    if (!input.trim()) return;
    router.push(`/chat/new?q=${encodeURIComponent(input)}`);
  };

  return (
    <Box sx={{ px: 8, py: 8, maxWidth: 900, mx: 'auto', marginTop: '160px' }}>

      {/* Title and subtitle */}
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{
        fontFamily: 'var(--font-manrope)',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f5576c 100%)',
        WebkitBackgroundClip: 'text', // Clips the background to only show within the text
        WebkitTextFillColor: 'transparent', // Makes the text transparent so the background shows through
        backgroundClip: 'text', // Standard property (WebKit is for browser compatibility)
        display: 'inline-block',
        fontSize: { xs: '2.5rem', md: '3rem' },
        lineHeight: 1.2,
      }}>
        Welcome to zentrix.ai
      </Typography>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        What you would like to know?
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Use one of the most common prompts below or use your own to begin
      </Typography>

      {/* Prompt cards */}
      <PromptCards prompts={prompts} onPromptClick={handlePromptClick} />

      {/* Question input */}
      <QuestionInput
        value={input}
        onChange={handleInputChange}
        onSend={handleSend}
        onKeyDown={handleInputKeyDown}
        loading={false}
        disabled={!input.trim()}
      />

    </Box>
  );
}