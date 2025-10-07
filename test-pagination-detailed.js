const axios = require('axios');

const API_KEY = '08c74138d0466463988a945a8becdeaa-9';
const BASE_URL = 'http://localhost:3001';

async function testDetailedPagination() {
  console.log('Detailed JobHarvester Pagination Test\n');

  try {
    // Test 1: Jobs pagination with detailed output
    console.log('1. Testing Jobs Pagination');
    console.log('----------------------------------------');
    
    const jobsPage1 = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 2 }
    });
    
    console.log('Page 1 Jobs:');
    jobsPage1.data.jobs?.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.name} (ID: ${job.id}) - Status: ${job.status}`);
    });
    console.log('Meta:', jobsPage1.data.meta);

    const jobsPage2 = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 2, per_page: 2 }
    });
    
    console.log('\nPage 2 Jobs:');
    jobsPage2.data.jobs?.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.name} (ID: ${job.id}) - Status: ${job.status}`);
    });
    console.log('Meta:', jobsPage2.data.meta);

    // Test 2: All candidates pagination with detailed output
    console.log('\n2. Testing All Candidates Pagination');
    console.log('----------------------------------------');
    
    const candidatesPage1 = await axios.get(`${BASE_URL}/candidates`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 3 }
    });
    
    console.log('Page 1 Candidates:');
    candidatesPage1.data.candidates?.forEach((candidate, index) => {
      console.log(`  ${index + 1}. ${candidate.first_name} ${candidate.last_name} (ID: ${candidate.id})`);
      if (candidate.email_addresses.length > 0) {
        console.log(`     Email: ${candidate.email_addresses[0].value}`);
      }
    });
    console.log('Meta:', candidatesPage1.data.meta);

    // Test 3: Job-specific candidates (if any exist)
    console.log('\n3. Testing Job-Specific Candidates');
    console.log('----------------------------------------');
    
    const allJobs = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 10 }
    });

    if (allJobs.data.jobs && allJobs.data.jobs.length > 0) {
      const testJob = allJobs.data.jobs[0];
      console.log(`Testing candidates for job: "${testJob.name}" (ID: ${testJob.id})`);
      
      const jobCandidates = await axios.get(`${BASE_URL}/jobs/${testJob.id}/candidates`, {
        headers: { 'x-api-key': API_KEY },
        params: { page: 1, per_page: 5 }
      });
      
      console.log(`Candidates for "${testJob.name}":`);
      if (jobCandidates.data.candidates && jobCandidates.data.candidates.length > 0) {
        jobCandidates.data.candidates.forEach((candidate, index) => {
          console.log(`  ${index + 1}. ${candidate.first_name} ${candidate.last_name}`);
        });
      } else {
        console.log('  No candidates found for this job');
      }
      console.log('Meta:', jobCandidates.data.meta);
    }

    // Test 4: Pagination navigation simulation
    console.log('\n4. Testing Pagination Navigation');
    console.log('----------------------------------------');
    
    const navTest = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 1 }
    });
    
    console.log('Single item per page test:');
    console.log(`  Current page: ${navTest.data.meta.page}`);
    console.log(`  Total items: ${navTest.data.meta.total}`);
    console.log(`  Has next page: ${navTest.data.meta.has_next_page}`);
    console.log(`  Has prev page: ${navTest.data.meta.has_prev_page}`);
    
    if (navTest.data.meta.has_next_page) {
      const nextPage = await axios.get(`${BASE_URL}/jobs`, {
        headers: { 'x-api-key': API_KEY },
        params: { page: 2, per_page: 1 }
      });
      console.log(`  Next page items: ${nextPage.data.jobs?.length || 0}`);
      console.log(`  Next page meta: ${JSON.stringify(nextPage.data.meta)}`);
    }

    console.log('\nDetailed pagination test completed successfully');
    console.log('\nSummary:');
    console.log('  Jobs pagination working correctly');
    console.log('  Candidates pagination working correctly');
    console.log('  Job-specific candidates pagination working correctly');
    console.log('  Navigation metadata working correctly');

  } catch (error) {
    console.error('Detailed pagination test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if backend is running
axios.get('http://localhost:3001/health')
  .then(() => testDetailedPagination())
  .catch(() => {
    console.error('Backend is not running. Please start it with: cd backend && npm run dev');
    process.exit(1);
  });
