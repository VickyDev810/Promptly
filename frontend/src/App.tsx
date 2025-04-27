import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import QuestionPage from './pages/QuestionPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuestionsListPage from './pages/QuestionsListPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionsListPage />} />
            <Route path="/questions/:id" element={<QuestionPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
