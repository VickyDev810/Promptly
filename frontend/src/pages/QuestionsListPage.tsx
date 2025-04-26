import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Chip,
  List,
  ListItem,
  Divider,
  InputAdornment,
  Tab,
  Tabs,
  Avatar,
  Stack,
  Badge
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  AccessTime as NewestIcon,
  StarOutline as UnansweredIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import { Question, User } from '../types';

const QuestionsListPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<Record<string, User>>({});

  // Helper function to map API data to our Question type
  const mapApiToQuestions = (apiQuestions: any[]): Question[] => {
    return apiQuestions.map(q => ({
      id: q.id,
      question: q.title || q.question || 'Unknown question',
      timestamp: q.created_at || q.timestamp || new Date().toISOString(),
      status: q.answered ? 'answered' : 'escalated',
      response: q.response || {
        confidence: q.confidence || 0.8,
        answer: q.answer || '',
        escalate_to_human: !q.answered,
        tags: q.tags || []
      }
    }));
  };

  // Fetch regular questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await apiService.getQuestions();
        setQuestions(fetchedQuestions as Question[]);
        
        // Get unique user IDs to fetch
        const uniqueUserIds = ['user1', 'user2', 'user3']; // In a real app, extract from questions
        
        // Fetch user data
        const usersData: Record<string, User> = {};
        for (const userId of uniqueUserIds) {
          const user = await apiService.getUser(userId) as User;
          if (user) {
            usersData[userId] = user;
          }
        }
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    
    fetchQuestions();
  }, []);

  // Fetch trending questions separately
  useEffect(() => {
    const loadTrendingQuestions = async () => {
      try {
        // Try to fetch trending questions from API
        const fetchedTrending = await apiService.publishTrendingQuestions?.();
        
        if (fetchedTrending && fetchedTrending.length > 0) {
          // Map API data to our Question type
          const mappedQuestions = mapApiToQuestions(fetchedTrending);
          setTrendingQuestions(mappedQuestions);
        } else {
          // If API doesn't exist or returns empty, use mock data
          console.log('Using mock data for trending questions');
          setTrendingQuestions(mockQuestions.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching trending questions:', error);
        // Fallback to mock data
        setTrendingQuestions(mockQuestions.slice(0, 3));
      }
    };

    loadTrendingQuestions();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Mock data for demonstration
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      question: 'Why does React re-render components when using useState?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'answered',
      response: {
        confidence: 0.95,
        answer: 'React re-renders components when state changes to ensure the UI reflects the current application state. This is a core part of React\'s design philosophy.',
        escalate_to_human: false,
        tags: ['react', 'javascript', 'hooks']
      }
    },
    {
      id: 'q2',
      question: 'What\'s the difference between useMemo and useCallback in React?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'answered',
      response: {
        confidence: 0.92,
        answer: 'useMemo caches the result of a computation, while useCallback caches a function definition. Both are used for performance optimization.',
        escalate_to_human: false,
        tags: ['react', 'hooks', 'performance']
      }
    },
    {
      id: 'q3',
      question: 'My Docker container keeps crashing with OOMKilled error. How can I debug this?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'escalated',
      response: {
        confidence: 0.45,
        answer: 'This appears to be a memory-related issue in your Docker container. You might want to check for memory leaks or increase the container memory limit.',
        escalate_to_human: true,
        tags: ['docker', 'devops', 'debugging']
      }
    },
    {
      id: 'q4',
      question: 'Best practices for implementing authentication in a Node.js/Express API?',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'escalated',
      response: {
        confidence: 0.65,
        answer: 'For Node.js/Express authentication, consider using JWT, OAuth, or Passport.js. Implement HTTPS, secure cookies, and proper password hashing.',
        escalate_to_human: true,
        tags: ['node.js', 'express', 'authentication', 'security']
      }
    },
    {
      id: 'q5',
      question: 'How to optimize database queries in a large-scale PostgreSQL application?',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'answered',
      response: {
        confidence: 0.88,
        answer: 'For PostgreSQL optimization: use proper indexing, analyze query plans with EXPLAIN, optimize JOINs, use connection pooling, and consider query caching.',
        escalate_to_human: false,
        tags: ['postgresql', 'database', 'performance']
      }
    }
  ];

  const displayQuestions = questions.length > 0 ? questions : mockQuestions;
  const filteredQuestions = displayQuestions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.response?.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  // Use trending questions for tab 0, otherwise use filtered and sorted questions
  const sortedQuestions = tabValue === 0 && trendingQuestions.length > 0
    ? trendingQuestions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.response?.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [...filteredQuestions].sort((a, b) => {
        switch (tabValue) {
          case 0: // Trending (fallback if no trending questions)
            return a.id.localeCompare(b.id);
          case 1: // Newest
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          case 2: // Unanswered/Escalated
            return a.status === 'escalated' ? -1 : 1;
          default:
            return 0;
        }
      });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
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
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              mb: 3,
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 600
            }}
          >
            Community Questions
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.7), rgba(17, 23, 43, 0.8))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(66, 153, 225, 0.08)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2
            }}
          >
            <TextField
              placeholder="Search questions by topic, keywords, or tags..."
              fullWidth
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(17, 25, 40, 0.7)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 2,
                  border: '1px solid rgba(66, 153, 225, 0.2)',
                }
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<FilterIcon />}
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: '120px'
              }}
            >
              Filters
            </Button>
            <Button 
              component={Link}
              to="/"
              variant="outlined" 
              color="primary"
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: '180px'
              }}
            >
              Ask New Question
            </Button>
          </Paper>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.7), rgba(17, 23, 43, 0.8))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(66, 153, 225, 0.08)',
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  boxShadow: '0 0 5px #03e9f4',
                },
                '& .MuiTab-root': {
                  py: 2,
                  fontWeight: 500
                }
              }}
            >
              <Tab icon={<TrendingIcon />} label="Trending" />
              <Tab icon={<NewestIcon />} label="Newest" />
              <Tab 
                icon={<Badge badgeContent={mockQuestions.filter(q => q.status === 'escalated').length} color="error"><UnansweredIcon /></Badge>} 
                label="Escalated" 
              />
            </Tabs>

            <List sx={{ p: 0 }}>
              {sortedQuestions.map((question, index) => (
                <React.Fragment key={question.id}>
                  {index > 0 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <ListItem 
                      alignItems="flex-start"
                      component={Link}
                      to={`/questions/${question.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        color: 'inherit',
                        p: 3
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Stack 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Avatar 
                            src={users['user' + (index % 3 + 1)]?.avatar || `https://i.pravatar.cc/150?img=${index + 1}`}
                            sx={{ 
                              width: 32, 
                              height: 32,
                              border: '1px solid',
                              borderColor: 'primary.main'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {users['user' + (index % 3 + 1)]?.username || 'Anonymous'} • {new Date(question.timestamp).toLocaleString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {question.status === 'escalated' && (
                            <Chip 
                              label="Escalated" 
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}
                        </Stack>

                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{ 
                            mb: 1.5,
                            fontWeight: 500
                          }}
                        >
                          {question.question}
                        </Typography>

                        {question.response && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mb: 2,
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                            }}
                          >
                            {question.response.answer}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {question.response?.tags.map(tag => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small"
                              sx={{ 
                                height: 24,
                                backgroundColor: 'rgba(3, 233, 244, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(3, 233, 244, 0.2)',
                                }
                              }}
                            />
                          ))}
                          {question.response && (
                            <Chip 
                              label={`${Math.round(question.response.confidence * 100)}% Confidence`}
                              size="small"
                              color={question.response.confidence > 0.7 ? "success" : "warning"}
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                  </motion.div>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default QuestionsListPage; 
