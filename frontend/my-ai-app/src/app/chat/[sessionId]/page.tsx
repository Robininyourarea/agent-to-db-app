"use client"
import { useState, ChangeEvent, KeyboardEvent, useEffect, useRef, useCallback, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import Chat from '@/components/section/Chat';
import QuestionInput from '@/components/ui/QuestionInput';
import { sessionService } from '@/services/sessionService';
import { ChatRequest } from '@/types/session';

interface Message {
  text: string;
  isUser: boolean;
}

/*
 * ChatByIdPage is the main chat page that handles both new and existing sessions.
 * - For new sessions, it creates a new session and redirects to the new session URL.
 * - For existing sessions, it loads the session history and allows sending messages.
 * - It uses the sessionService to communicate with the backend API.
 *  @input : Cuurent text in the input box
 *  @messages : Array of messages in the chat that shown on screen  
 *  @loading : Boolean to show loading state
 *  @historyLoaded : Boolean to check if history is loaded
 *  @actualSessionId : Stores the real session ID returned by the backend after creating a new session
 *  @searchParams : Search parameters from the URL
 *  @router : Router object to navigate to different pages
 *  @processedInitialQuery : Ref to check if initial query is processed
*/
export default function ChatByIdPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [actualSessionId, setActualSessionId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const processedInitialQuery = useRef(false);

  // Check if this is a new session (placeholder)
  const isNewSession = sessionId === 'new';

  const handleSend = useCallback(async (messageText?: string) => {
    const textToSend = messageText || input;
    // If the input is empty, return
    if (!textToSend.trim()) return;

    const userMessage: Message = { text: textToSend, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    if (!messageText) {
      setInput('');
    }

    try {
      // For new sessions, don't send session_id so backend creates a new one
      // For existing sessions, send the session_id
      const requestBody: ChatRequest = { message: textToSend };

      if (!isNewSession && !actualSessionId) {
        requestBody.session_id = sessionId;
      } else if (actualSessionId) {
        requestBody.session_id = actualSessionId;
      }
      // If isNewSession and no actualSessionId, don't include session_id
      const data = await sessionService.sendMessage(requestBody);

      // If this was a new session and we got a session_id back, update URL
      if (isNewSession && data.session_id) {
        setActualSessionId(data.session_id);
        // Update the URL to use the real session ID
        router.replace(`/chat/${data.session_id}`);
      }

      const aiMessage: Message = { text: data.response || '', isUser: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = { text: 'Failed to get response from AI backend.', isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, isNewSession, actualSessionId, sessionId, router]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Load chat history only for existing sessions
  useEffect(() => {
    if (isNewSession) {
      setHistoryLoaded(true);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await sessionService.getSessionById(sessionId);
        if (data?.messages) {
          const historyMessages = data.messages.map((msg: { content: string; type: string }) => ({
            text: msg.content,
            isUser: msg.type === 'human',
          }));
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
        setHistoryLoaded(true);
      }
    };
    fetchHistory();
  }, [sessionId, isNewSession]);

  // Handle initial query from URL params (only after history is loaded)
  useEffect(() => {
    if (!historyLoaded || processedInitialQuery.current) return;

    const initialQuery = searchParams.get('q');

    if (initialQuery) {
      const isQueryInHistory = messages.some(m => m.isUser && m.text === initialQuery);

      if (!isQueryInHistory) {
        processedInitialQuery.current = true;
        handleSend(initialQuery);
      }
    }
  }, [historyLoaded, searchParams, messages, handleSend]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <Box className="chat-scroll-container" sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxWidth: 1100, mx: 'auto', width: '100%' }}>
        <Chat messages={messages} isLoading={loading} />
      </Box>
      <Box sx={{ p: 2, maxWidth: 1100, mx: 'auto', width: '100%' }}>
        <QuestionInput
          value={input}
          onChange={handleInputChange}
          onSend={() => handleSend()}
          onKeyDown={handleInputKeyDown}
          loading={loading}
          disabled={!input.trim() || loading}
        />
      </Box>
    </Box>
  );
}