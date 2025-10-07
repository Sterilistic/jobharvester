import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiKeyForm from './components/ApiKeyForm';
import JobsList from './components/JobsList';
import JobDetails from './components/JobDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<ApiKeyForm />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
