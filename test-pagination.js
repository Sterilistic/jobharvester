const axios = require('axios');

const API_KEY = '08c74138d0466463988a945a8becdeaa-9';
const BASE_URL = 'http://localhost:3001';

async function testPagination() {
  console.log('Testing JobHarvester Pagination\n');

  try {
    // Test 1: Jobs pagination
    console.log('1. Testing jobs pagination');
    const jobsPage1Response = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 3 }
    });
    
    console.log('  Jobs page 1:', jobsPage1Response.data.jobs?.length || 0, 'items');
    console.log('  Meta:', jobsPage1Response.data.meta);

    const jobsPage2Response = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 2, per_page: 3 }
    });
    
    console.log('  Jobs page 2:', jobsPage2Response.data.jobs?.length || 0, 'items');
    console.log('  Meta:', jobsPage2Response.data.meta);

    // Test 2: All candidates pagination
    console.log('\n2. Testing all candidates pagination');
    const candidatesPage1Response = await axios.get(`${BASE_URL}/candidates`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 5 }
    });
    
    console.log('  All candidates page 1:', candidatesPage1Response.data.candidates?.length || 0, 'items');
    console.log('  Meta:', candidatesPage1Response.data.meta);

    // Test 3: Job-specific candidates pagination
    console.log('\n3. Testing job-specific candidates pagination');
    const jobs = jobsPage1Response.data.jobs;
    if (jobs && jobs.length > 0) {
      const firstJobId = jobs[0].id;
      console.log(`  Testing candidates for job ID: ${firstJobId}`);
      
      const jobCandidatesPage1Response = await axios.get(`${BASE_URL}/jobs/${firstJobId}/candidates`, {
        headers: { 'x-api-key': API_KEY },
        params: { page: 1, per_page: 3 }
      });
      
      console.log('  Job candidates page 1:', jobCandidatesPage1Response.data.candidates?.length || 0, 'items');
      console.log('  Meta:', jobCandidatesPage1Response.data.meta);

      // Test page 2 if there are more candidates
      if (jobCandidatesPage1Response.data.meta?.has_next_page) {
        const jobCandidatesPage2Response = await axios.get(`${BASE_URL}/jobs/${firstJobId}/candidates`, {
          headers: { 'x-api-key': API_KEY },
          params: { page: 2, per_page: 3 }
        });
        
        console.log('  Job candidates page 2:', jobCandidatesPage2Response.data.candidates?.length || 0, 'items');
        console.log('  Meta:', jobCandidatesPage2Response.data.meta);
      }
    }

    // Test 4: Edge cases
    console.log('\n4. Testing edge cases');
    
    // Test with large page size
    const largePageResponse = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 50 }
    });
    console.log('  Large page size test:', largePageResponse.data.jobs?.length || 0, 'items');

    // Test with small page size
    const smallPageResponse = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 1 }
    });
    console.log('  Small page size test:', smallPageResponse.data.jobs?.length || 0, 'items');

    // Test invalid page (should handle gracefully)
    try {
      const invalidPageResponse = await axios.get(`${BASE_URL}/jobs`, {
        headers: { 'x-api-key': API_KEY },
        params: { page: 999, per_page: 10 }
      });
      console.log('  Invalid page test (should be empty):', invalidPageResponse.data.jobs?.length || 0, 'items');
    } catch (error) {
      console.log('  Invalid page test handled gracefully');
    }

    console.log('\nAll pagination tests completed successfully');

  } catch (error) {
    console.error('Pagination test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if backend is running
axios.get('http://localhost:3001/health')
  .then(() => testPagination())
  .catch(() => {
    console.error('Backend is not running. Please start it with: cd backend && npm run dev');
    process.exit(1);
  });
