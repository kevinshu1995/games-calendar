import dotenv from 'dotenv';
import { fetchApiIndex, fetchTournamentData } from './utils/apiClient.js';
import { getAdapter } from './adapters/adapterFactory.js';
import { processData } from './utils/dataProcessor.js';
import { createOrUpdateCalendar } from './services/calendarService.js';

// 載入環境變數
dotenv.config();

/**
 * 測試日曆創建流程
 */
async function testCalendarCreation() {
  try {
    console.log('===== Testing Calendar Creation =====');
    
    // 獲取 API 索引
    console.log('Fetching API index...');
    const apiIndex = await fetchApiIndex();
    console.log(`Found ${apiIndex.apis.length} APIs: ${apiIndex.apis.map(api => api.id).join(', ')}`);
    
    // 使用第一個 API 或指定的 API
    const sportId = process.argv[2] || 'bwf';
    console.log(`\nTesting with sport ID: ${sportId}`);
    
    // 獲取比賽數據
    console.log(`Fetching ${sportId} tournament data...`);
    const tournamentData = await fetchTournamentData(sportId);
    console.log(`Fetched tournament data successfully.`);
    
    // 獲取適配器
    const adapter = getAdapter(sportId);
    if (!adapter) {
      console.error(`No adapter available for ${sportId}`);
      process.exit(1);
    }
    
    // 標準化數據
    console.log('Standardizing tournament data...');
    const standardizedData = adapter.standardize(tournamentData);
    console.log(`Standardized ${standardizedData.length} tournaments.`);
    
    // 處理數據
    console.log('Processing tournament data...');
    const processedData = processData(standardizedData);
    console.log(`Processed ${processedData.tournaments.length} tournaments.`);
    
    // 創建日曆
    console.log('\nCreating Google Calendar...');
    console.log('This step requires valid Google Calendar API credentials.');
    console.log('If you have not authenticated yet, please run: node src/utils/authenticate.js');
    
    const calendarId = await createOrUpdateCalendar(sportId, processedData);
    console.log(`\n✅ Success! Calendar created/updated with ID: ${calendarId}`);
    console.log('\nCheck your Google Calendar to see the created events.');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// 運行測試
testCalendarCreation();
