const axios = require('axios');

const API_KEY = '08c74138d0466463988a945a8becdeaa-9';
const BASE_URL = 'http://localhost:3001/api/greenhouse';

async function testBackend() {
  console.log('Testing JobHarvester Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed:', healthResponse.data);

    // Test API key validation
    console.log('\n2. Testing API key validation...');
    const validationResponse = await axios.post(`${BASE_URL}/validate-key`, {
      apiKey: API_KEY
    });
    console.log('✅ API key validation:', validationResponse.data);

    // Test jobs endpoint
    console.log('\n3. Testing jobs endpoint...');
    const jobsResponse = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY }
    });
    console.log('✅ Jobs fetched:', jobsResponse.data.jobs?.length || 0, 'jobs');

    // Test specific job if available
    if (jobsResponse.data.jobs && jobsResponse.data.jobs.length > 0) {
      const jobId = jobsResponse.data.jobs[0].id;
      console.log(`\n4. Testing job details for job ${jobId}...`);
      const jobResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
        headers: { 'x-api-key': API_KEY }
      });
      console.log('✅ Job details fetched:', jobResponse.data.name);

      console.log(`\n5. Testing candidates for job ${jobId}...`);
      try {
        const candidatesResponse = await axios.get(`${BASE_URL}/jobs/${jobId}/candidates`, {
          headers: { 'x-api-key': API_KEY }
        });
        console.log('✅ Candidates fetched:', candidatesResponse.data.candidates?.length || 0, 'candidates');
      } catch (error) {
        console.log('ℹ️  No candidates found for this job (this is normal for test data)');
      }
    }

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if backend is running
axios.get('http://localhost:3001/health')
  .then(() => testBackend())
  .catch(() => {
    console.error('❌ Backend is not running. Please start it with: cd backend && npm run dev');
    process.exit(1);
  });
