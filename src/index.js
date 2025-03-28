import dotenv from 'dotenv';
import { fetchApiIndex, fetchTournamentData } from './utils/apiClient.js';
import { processData } from './utils/dataProcessor.js';
import { createOrUpdateCalendar } from './services/calendarService.js';
import { getAdapter } from './adapters/adapterFactory.js';

// 載入環境變數
dotenv.config();

/**
 * 主程序入口點
 * @param {string[]} sportIds - 要處理的運動 ID 列表 (例如: ['bwf'])
 */
export async function main(sportIds = []) {
  try {
    console.log('Starting calendar creation process...');
    
    // 如果沒有指定運動 ID，則獲取並處理所有可用的運動
    if (sportIds.length === 0) {
      const apiIndex = await fetchApiIndex();
      sportIds = apiIndex.apis.map(api => api.id);
      console.log(`No sport IDs specified, processing all available sports: ${sportIds.join(', ')}`);
    }
    
    // 處理每個運動 ID
    for (const sportId of sportIds) {
      console.log(`Processing ${sportId} tournaments...`);
      
      try {
        // 獲取適配器
        const adapter = getAdapter(sportId);
        if (!adapter) {
          console.warn(`No adapter available for ${sportId}, skipping...`);
          continue;
        }
        
        // 獲取比賽數據
        const tournamentData = await fetchTournamentData(sportId);
        
        // 使用適配器處理數據
        const standardizedData = adapter.standardize(tournamentData);
        
        // 進一步處理數據（例如按月份分組等）
        const processedData = processData(standardizedData);
        
        // 創建或更新日曆
        const calendarId = await createOrUpdateCalendar(sportId, processedData);
        console.log(`Calendar for ${sportId} created/updated with ID: ${calendarId}`);
      } catch (error) {
        console.error(`Error processing ${sportId}: ${error.message}`);
        // 繼續處理其他運動，不中斷整個流程
      }
    }
    
    console.log('Calendar creation process completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Failed to process tournaments:', error);
    throw error;
  }
}

// 如果直接運行此文件（而非作為模組導入）
if (process.argv[1] === new URL(import.meta.url).pathname) {
  // 從命令行參數獲取運動 ID
  const sportIds = process.argv.slice(2);
  main(sportIds).catch(error => {
    console.error('Application error:', error);
    process.exit(1);
  });
}
