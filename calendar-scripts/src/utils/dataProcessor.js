/**
 * 處理標準化後的賽事數據
 * 
 * 這個模組負責對標準化後的賽事數據進行進一步處理，
 * 如按月份分組、排序、過濾等操作
 */

/**
 * 處理標準化後的賽事數據
 * @param {Array} standardizedData - 標準化後的賽事數據
 * @returns {Object} 處理後的賽事數據
 */
export function processData(standardizedData) {
  if (!Array.isArray(standardizedData)) {
    console.warn('Invalid data format: Expected an array of tournaments');
    return { tournaments: [] };
  }
  
  try {
    // 過濾無效的賽事（沒有開始或結束日期的賽事）
    const validTournaments = standardizedData.filter(
      tournament => tournament.dateStart && tournament.dateEnd
    );
    
    // 按開始日期排序
    const sortedTournaments = validTournaments.sort(
      (a, b) => new Date(a.dateStart) - new Date(b.dateStart)
    );
    
    // 按月份分組
    const tournamentsByMonth = groupByMonth(sortedTournaments);
    
    return {
      tournaments: sortedTournaments,
      tournamentsByMonth,
      count: sortedTournaments.length,
      processedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing tournament data:', error);
    throw error;
  }
}

/**
 * 按月份分組賽事
 * @param {Array} tournaments - 賽事數據數組
 * @returns {Object} 按月份分組的賽事
 */
function groupByMonth(tournaments) {
  const grouped = {};
  
  for (const tournament of tournaments) {
    const startDate = new Date(tournament.dateStart);
    const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    
    grouped[monthKey].push(tournament);
  }
  
  return grouped;
}
