import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

type Prompt = { title: string };

type PromptCardsProps = {
  prompts: Prompt[];
  onPromptClick: (prompt: string) => void;
};

export default function PromptCards({ prompts, onPromptClick }: Readonly<PromptCardsProps>) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {prompts.map((prompt, index) => {

        // Different gradient for each card
        const gradients = [
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Blue to Purple
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Cyan to Blue
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Green to Cyan
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Pink to Yellow
        ];

        return (
          <Grid item xs={12} sm={6} md={3} key={prompt.title}>
            <Card
              sx={{
                bgcolor: 'background.default',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                  '&::before': {
                    opacity: 1,
                  },
                  '& .card-content': {
                    color: 'white',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: gradients[index % gradients.length],
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                  zIndex: 1,
                },
              }}
            >
              <CardActionArea
                onClick={() => onPromptClick(prompt.title)}
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                }}
              >
                <CardContent
                  className="card-content"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    height: '100px', // Reduced height since no icon
                    position: 'relative',
                    zIndex: 2,
                    transition: 'color 0.3s ease-in-out',
                  }}
                >
                  {/* Title */}
                  <Typography
                    variant="body1"
                    fontWeight={300}
                    fontSize={15}
                    sx={{
                      transition: 'color 0.3s ease-in-out',
                    }}
                  >
                    {prompt.title}
                  </Typography>

                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}