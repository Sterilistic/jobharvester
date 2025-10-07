const axios = require('axios');

const API_KEY = '08c74138d0466463988a945a8becdeaa-9';
const BASE_URL = 'http://localhost:3001/api/greenhouse';

async function testPagination() {
  console.log('Testing JobHarvester Pagination...\n');

  try {
    // Test jobs pagination
    console.log('1. Testing jobs pagination...');
    const page1Response = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 3 }
    });
    
    console.log('✅ Page 1 jobs:', page1Response.data.jobs?.length || 0);
    console.log('✅ Page 1 meta:', page1Response.data.meta);

    const page2Response = await axios.get(`${BASE_URL}/jobs`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 2, per_page: 3 }
    });
    
    console.log('✅ Page 2 jobs:', page2Response.data.jobs?.length || 0);
    console.log('✅ Page 2 meta:', page2Response.data.meta);

    // Test candidates pagination
    console.log('\n2. Testing candidates pagination...');
    const candidatesPage1Response = await axios.get(`${BASE_URL}/candidates`, {
      headers: { 'x-api-key': API_KEY },
      params: { page: 1, per_page: 5 }
    });
    
    console.log('✅ Candidates page 1:', candidatesPage1Response.data.candidates?.length || 0);
    console.log('✅ Candidates meta:', candidatesPage1Response.data.meta);

    console.log('\n🎉 Pagination tests completed successfully!');

  } catch (error) {
    console.error('❌ Pagination test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if backend is running
axios.get('http://localhost:3001/health')
  .then(() => testPagination())
  .catch(() => {
    console.error('❌ Backend is not running. Please start it with: cd backend && npm run dev');
    process.exit(1);
  });
