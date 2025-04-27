import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Chip,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Divider,
  Stack
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Search as SearchIcon,
  LightbulbOutlined as LightbulbIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { LLMResponse, FetchedQuestion } from '../types';


// Custom renderers for markdown components
const renderers = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  // Add custom styling for other markdown elements
  p: (props: any) => <Typography variant="body1" sx={{ mb: 2 }} {...props} />,
  h1: (props: any) => <Typography variant="h4" sx={{ mt: 3, mb: 2 }} {...props} />,
  h2: (props: any) => <Typography variant="h5" sx={{ mt: 3, mb: 2 }} {...props} />,
  h3: (props: any) => <Typography variant="h6" sx={{ mt: 2, mb: 1 }} {...props} />,
  ul: (props: any) => <Box component="ul" sx={{ pl: 2, mb: 2 }} {...props} />,
  ol: (props: any) => <Box component="ol" sx={{ pl: 2, mb: 2 }} {...props} />,
  li: (props: any) => <Box component="li" sx={{ mb: 1 }} {...props} />,
  blockquote: (props: any) => (
    <Box
      component="blockquote"
      sx={{
        pl: 2,
        py: 1,
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        bgcolor: 'rgba(3, 233, 244, 0.05)',
        my: 2,
      }}
      {...props}
    />
  ),
};

const HomePage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<LLMResponse | null>(null);
  const [trendingQuestions, setTrendingQuestions] = useState<FetchedQuestion[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [featuredTopics, setFeaturedTopics] = useState<string[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [topicQuestions, setTopicQuestions] = useState<FetchedQuestion[]>([]);
  const [topicLoading, setTopicLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadTrendingQuestions = async () => {
      try {
        apiService.publishTrendingQuestions()
        const fetchedQuestions = await apiService.getTrendingQuestions();
        setTrendingQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching trending questions:', error);
      } finally {
        setTrendingLoading(false);
      }
    };

  const loadTrendingTags = async () => {
      try {
        const tags = await apiService.getTrendingTags();
        const tagNames = tags.map((tag: any) => tag.name);  // <-- take only 'name'
        setFeaturedTopics(tagNames);
      } catch (error) {
        console.error('Error loading trending tags:', error);
      } finally {
        setTagsLoading(false);
      }
    };
    

    loadTrendingQuestions();
    loadTrendingTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await apiService.askQuestion(question);
      setResponse(result);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = () => {
    // Navigate to questions list page
    navigate('/questions');
  };

  const handleNewQuestion = () => {
    setQuestion('');
    setResponse(null);
  };

  const handleTopicClick = async (topic: string) => {
    try {
      setTopicLoading(true);
      setSelectedTopic(topic);
      await apiService.publishTopicQuestions(topic);
      const fetchedQuestions = await apiService.getTrendingQuestionsByTag(topic);
      setTopicQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error handling topic click:', error);
    } finally {
      setTopicLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Box>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            padding: { xs: 4, md: 8 },
            mb: 6,
            background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.95), rgba(28, 35, 60, 0.9))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 0,
              opacity: 0.2,
              background: `url('/images/circuit-pattern.svg')`,
              backgroundSize: 'cover',
              pointerEvents: 'none'
            }}
          />
          
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h2" 
              component="h1" 
              align="center"
              sx={{ 
                mb: 2,
                fontWeight: 'bold',
                backgroundImage: 'linear-gradient(90deg, #03e9f4, #6e42f5)',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 20px rgba(3, 233, 244, 0.4)',
                letterSpacing: { xs: 0, md: 2 },
              }}
            >
              Promptly
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary"
              sx={{ 
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 'light'
              }}
            >
              Get instant answers to your questions with our AI-powered assistant.
              Complex questions are escalated to our community of experts.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                position: 'relative',
                maxWidth: '800px',
                mx: 'auto',
                mb: 3,
                zIndex: 1,
        }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(17, 25, 40, 0.7)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    border: '1px solid rgba(66, 153, 225, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(66, 153, 225, 0.4)',
                    },
                    '&.Mui-focused': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px',
                    fontSize: '1.1rem',
                  },
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  endAdornment: loading ? <CircularProgress size={24} color="primary" /> : null
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || !question.trim()}
                sx={{
                  position: { xs: 'relative', sm: 'absolute' },
                  right: { xs: 0, sm: 8 },
                  top: { xs: 'auto', sm: '50%' },
                  transform: { xs: 'none', sm: 'translateY(-50%)' },
                  mt: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {loading ? 'Processing...' : 'Ask AI'}
              </Button>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'inline-block', mr: 1 }}>
                Popular topics:
              </Typography>
              <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                {tagsLoading ? (
                  <CircularProgress size={24} color="primary" />
                ) : featuredTopics.length > 0 ? (
                  featuredTopics.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      size="small"
                      color="primary"
                      variant="outlined"
                      clickable
                      onClick={() => handleTopicClick(topic)}
                      sx={{ 
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(3, 233, 244, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(3, 233, 244, 0.2)',
                        }
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No trending topics available
                  </Typography>
                )}
              </Box>
            </Box>
          </motion.div>
        </Box>

        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.95), rgba(17, 23, 43, 0.98))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(66, 153, 225, 0.08)',
              }}
            >
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontFamily: '"Orbitron", sans-serif' }}>
                  Questions about {selectedTopic}
                </Typography>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => setSelectedTopic(null)}
                >
                  Clear
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              {topicLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : topicQuestions.length > 0 ? (
                <Box>
                  {topicQuestions.map((q) => (
                    <Box 
                      key={q.question_id}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => navigate(`/questions/${q.question_id}`)}
                    >
                      <Typography variant="body1">{q.title}</Typography>
                      <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                        {q.tags && q.tags.slice(0, 3).map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(3, 233, 244, 0.1)',
                            }} 
                          />
                        ))}
                        {q.tags && q.tags.length > 3 && (
                          <Chip 
                            label={`+${q.tags.length - 3} more`} 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(3, 233, 244, 0.1)',
                            }} 
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No questions found for this topic
                </Typography>
              )}
            </Paper>
          </motion.div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.95), rgba(17, 23, 43, 0.98))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(66, 153, 225, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                '& pre': {
                  borderRadius: 1,
                  padding: '1rem',
                  overflow: 'auto',
                  backgroundColor: 'rgba(0, 0, 0, 0.2) !important',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.9rem',
                  maxHeight: '400px',
                },
                '& code': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  padding: '2px 4px',
                  borderRadius: 1,
                  fontSize: '0.9rem',
                  color: theme.palette.primary.light,
                },
                '& a': {
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
                '& table': {
                  borderCollapse: 'collapse',
                  width: '100%',
                  marginBottom: 2,
                },
                '& th, & td': {
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 12px',
                  textAlign: 'left',
                },
                '& th': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontFamily: '"Orbitron", sans-serif', mb: { xs: 1, md: 0 } }}>AI Response</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label={`Confidence: ${Math.round(response.confidence * 100)}%`} 
                    size="small" 
                    color={response.confidence > 0.7 ? "success" : "warning"}
                    sx={{ 
                      borderColor: response.confidence > 0.7 ? "success.main" : "warning.main",
                      '& .MuiChip-label': { fontWeight: 'bold' }
                    }}
                  />
                  {response.tags.slice(0, 3).map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                      sx={{ 
                        backgroundColor: 'rgba(3, 233, 244, 0.05)',
                        borderColor: 'rgba(3, 233, 244, 0.3)',
                        '&:hover': { backgroundColor: 'rgba(3, 233, 244, 0.1)' }
                      }}
                    />
                  ))}
                  {response.tags.length > 3 && (
                    <Chip 
                      label={`+${response.tags.length - 3} more`} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                      sx={{ 
                        backgroundColor: 'rgba(3, 233, 244, 0.05)',
                        borderColor: 'rgba(3, 233, 244, 0.3)'
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Box sx={{ fontFamily: '"Roboto", sans-serif' }}>
                <ReactMarkdown components={renderers}>
                  {response.answer}
                </ReactMarkdown>
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNewQuestion}
                >
                  Ask New Question
                </Button>
                
                {response.escalate_to_human && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEscalate}
                  >
                    Escalate to Human Experts
                  </Button>
                )}
                
                {!response.escalate_to_human && (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleEscalate}
                  >
                    Not Satisfied? Ask Community
                  </Button>
                )}
              </Stack>
            </Paper>
          </motion.div>
        )}
        
        <motion.div variants={containerVariants}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 4, 
              fontFamily: '"Orbitron", sans-serif',
              textAlign: 'center'
            }}
          >
            Why Use Promptly?
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
            {[
              { 
                icon: <SpeedIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'Instant Answers', 
                description: 'Get immediate responses to your technical questions without waiting for community replies.'
              },
              { 
                icon: <PsychologyIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'AI-Powered Intelligence', 
                description: 'Our advanced AI can understand complex technical questions and provide accurate answers.'
              },
              { 
                icon: <QuestionIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'Community Expertise', 
                description: 'For complex questions, tap into our community of experienced developers and engineers.'
              },
              { 
                icon: <LightbulbIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />, 
                title: 'Smart Escalation', 
                description: 'Our system intelligently determines when a question needs human expertise.'
              },
            ].map((feature, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(25% - 24px)' }
                }}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' 
                  }}
                >
                  <Card 
                    sx={{ 
                      height: 250, // Fixed height
                      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.6), rgba(12, 18, 32, 0.8))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'rgba(3, 233, 244, 0.3)',
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom
                        sx={{ fontFamily: '"Orbitron", sans-serif' }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ mb: 6 }}>
            <Card
              sx={{
                p: 4,
                background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.9), rgba(17, 23, 43, 0.95))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(3, 233, 244, 0.1)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                <Box sx={{ width: { xs: '100%', md: 'calc(48.33% - 16px)' }}}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
       gutterBottom
                    sx={{ fontFamily: '"Orbitron", sans-serif' }}
                  >
                    Trending Questions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    See what the community is discussing right now. Browse through trending questions or contribute your expertise.
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    color="primary"
                    startIcon={<TrendingIcon />}
                    component="a"
                    href="/questions"
                    sx={{ mt: 1 }}
                  >
                    Browse Questions
                  </Button>
                </Box>

                <Box sx={{ width: { xs: '100%', md: 'calc(51.67% - 16px)' }}}>
                  <Box sx={{ p: 1 }}>
                    {trendingLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : trendingQuestions.length > 0 ? (
                      trendingQuestions.slice(0, 3).map((fq, i) => (
                        <Box 
                          key={fq.question_id}
                          sx={{ 
                            p: 2, 
                            mb: 2, 
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 1,
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => {navigate(`/questions/${fq.question_id}`); console.log(fq.question_id)}}
                        >
                          <Typography variant="body2">{fq.title}</Typography>
                          <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                            {fq.tags && fq.tags.slice(0, 3).map(tag => (
                              <Chip 
                                key={tag} 
                                label={tag} 
                                size="small" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(3, 233, 244, 0.1)',
                                }} 
                              />
                            ))}
                            {fq.tags && fq.tags.length > 3 && (
                              <Chip 
                                label={`+${fq.tags.length - 3} more`} 
                                size="small" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  backgroundColor: 'rgba(3, 233, 244, 0.1)',
                                }} 
                              />
                            )}
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        No trending questions available
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default HomePage; 
