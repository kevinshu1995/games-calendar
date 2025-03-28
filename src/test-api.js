import dotenv from 'dotenv';
import { fetchApiIndex, fetchTournamentData } from './utils/apiClient.js';
import { getAdapter } from './adapters/adapterFactory.js';
import { processData } from './utils/dataProcessor.js';

// 載入環境變數
dotenv.config();

/**
 * 測試 API 獲取和數據處理
 */
async function testApi() {
  try {
    console.log('===== Testing API Data Fetching =====');
    
    // 獲取 API 索引
    console.log('Fetching API index...');
    const apiIndex = await fetchApiIndex();
    console.log(`Found APIs: ${apiIndex.apis.map(api => api.id).join(', ')}`);
    
    // 使用第一個 API 或指定的 API
    const sportId = process.argv[2] || 'bwf';
    console.log(`\nTesting with sport ID: ${sportId}`);
    
    // 獲取比賽數據
    console.log(`Fetching ${sportId} tournament data...`);
    const tournamentData = await fetchTournamentData(sportId);
    console.log('API response structure:', Object.keys(tournamentData).join(', '));
    
    // 獲取適配器
    const adapter = getAdapter(sportId);
    if (!adapter) {
      console.error(`No adapter available for ${sportId}`);
      process.exit(1);
    }
    
    // 標準化數據
    console.log('\nStandardizing tournament data...');
    const standardizedData = adapter.standardize(tournamentData);
    console.log(`Standardized ${standardizedData.length} tournaments.`);
    
    if (standardizedData.length > 0) {
      console.log('\nSample tournament data:');
      console.log(JSON.stringify(standardizedData[0], null, 2));
    }
    
    // 處理數據
    console.log('\nProcessing tournament data...');
    const processedData = processData(standardizedData);
    console.log(`Processed ${processedData.tournaments.length} tournaments.`);
    console.log(`Tournament months: ${Object.keys(processedData.tournamentsByMonth).join(', ')}`);
    
    console.log('\n✅ API test completed successfully!');
  } catch (error) {
    console.error('API test failed:', error);
    process.exit(1);
  }
}

// 運行測試
testApi();
