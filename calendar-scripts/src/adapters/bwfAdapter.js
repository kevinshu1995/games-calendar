/**
 * BWF (羽毛球世界聯合會) 比賽數據適配器
 * 將 BWF API 格式轉換為標準化的比賽數據格式
 */
export class BwfAdapter {
  /**
   * 將 BWF 比賽數據標準化
   * @param {Object} data - 從 BWF API 獲取的原始數據
   * @returns {Array} 標準化的比賽數據數組
   */
  standardize(data) {
    console.log('BWF Adapter received data:', JSON.stringify(data).substring(0, 200) + '...');
    
    // 檢查數據是否為空或無效
    if (!data) {
      console.warn('Received empty data in BWF adapter');
      return [];
    }
    
    try {
      // 處理 BWF API 特定格式: {results: {January: {...}, February: {...}, ...}}
      if (data.results) {
        console.log('Processing BWF data in results format with months');
        return this._processMonthlyResults(data.results);
      } 
      // 處理 tournaments 數組格式
      else if (data.tournaments && Array.isArray(data.tournaments)) {
        console.log('Processing BWF data in tournaments array format');
        return this._processTournamentsArray(data.tournaments);
      } 
      // 處理純數組格式
      else if (Array.isArray(data)) {
        console.log('Processing BWF data as direct array');
        return this._processTournamentsArray(data);
      } 
      // 未知格式
      else {
        console.warn('Unrecognized BWF data format:', Object.keys(data).join(', '));
        return [];
      }
    } catch (error) {
      console.error('Error standardizing BWF tournament data:', error);
      return [];
    }
  }
  
  /**
   * 處理按月份組織的比賽數據
   * @param {Object} monthlyResults - 按月份組織的比賽數據
   * @returns {Array} 標準化的比賽數據數組
   * @private
   */
  _processMonthlyResults(monthlyResults) {
    const standardizedTournaments = [];
    
    // 遍歷所有月份
    for (const month in monthlyResults) {
      const monthData = monthlyResults[month];
      
      // 檢查月份數據是否為對象
      if (!monthData || typeof monthData !== 'object') continue;
      
      // 遍歷月份內的所有比賽
      for (const tournamentIndex in monthData) {
        const tournament = monthData[tournamentIndex];
        
        if (!tournament || typeof tournament !== 'object') continue;
        
        // 創建標準化比賽對象
        const standardTournament = {
          id: `bwf-${month}-${tournamentIndex}-${Date.now()}`,
          name: tournament.name || 'Unnamed Tournament',
          location: {
            city: tournament.city || '',
            country: tournament.country || '',
            venue: tournament.venue || ''
          },
          dateStart: tournament.start_date ? new Date(tournament.start_date).toISOString() : null,
          dateEnd: tournament.end_date ? new Date(tournament.end_date).toISOString() : null,
          category: tournament.category || tournament.level || 'BWF Tournament',
          level: tournament.grade || tournament.tier || '',
          prize: tournament.prize || '',
          url: tournament.url || '',
          description: this._generateDescription(tournament),
          source: 'BWF',
          lastUpdated: new Date().toISOString()
        };
        
        // 只添加有開始和結束日期的比賽
        if (standardTournament.dateStart && standardTournament.dateEnd) {
          standardizedTournaments.push(standardTournament);
        }
      }
    }
    
    console.log(`Standardized ${standardizedTournaments.length} tournaments from monthly format`);
    return standardizedTournaments;
  }
  
  /**
   * 處理比賽數組格式
   * @param {Array} tournaments - 比賽數據數組
   * @returns {Array} 標準化的比賽數據數組
   * @private
   */
  _processTournamentsArray(tournaments) {
    const standardizedTournaments = [];
    
    for (const tournament of tournaments) {
      const standardTournament = {
        id: tournament.id || `bwf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: tournament.name || tournament.title || 'Unnamed Tournament',
        location: {
          city: this._getNestedProperty(tournament, 'location.city') || tournament.city || '',
          country: this._getNestedProperty(tournament, 'location.country') || tournament.country || '',
          venue: this._getNestedProperty(tournament, 'location.venue') || tournament.venue || ''
        },
        dateStart: this._getDate(tournament, 'start') || null,
        dateEnd: this._getDate(tournament, 'end') || null,
        category: tournament.category || 'BWF Tournament',
        level: tournament.level || tournament.grade || '',
        prize: tournament.prize || '',
        url: tournament.url || '',
        description: this._generateDescription(tournament),
        source: 'BWF',
        lastUpdated: new Date().toISOString()
      };
      
      // 只添加有開始和結束日期的比賽
      if (standardTournament.dateStart && standardTournament.dateEnd) {
        standardizedTournaments.push(standardTournament);
      }
    }
    
    console.log(`Standardized ${standardizedTournaments.length} tournaments from array format`);
    return standardizedTournaments;
  }
  
  /**
   * 根據比賽數據生成描述文本
   * @param {Object} tournament - 比賽數據
   * @returns {string} 描述文本
   * @private
   */
  _generateDescription(tournament) {
    let description = '';
    
    if (tournament.name) {
      description += `${tournament.name}\n\n`;
    }
    
    if (tournament.level || tournament.category) {
      description += `${tournament.level || ''} ${tournament.category || ''}\n`;
    }
    
    if (tournament.prize) {
      description += `Prize: ${tournament.prize}\n`;
    }
    
    if (tournament.location) {
      const locationParts = [
        tournament.location.venue,
        tournament.location.city,
        tournament.location.country
      ].filter(Boolean);
      
      if (locationParts.length > 0) {
        description += `Location: ${locationParts.join(', ')}\n`;
      }
    }
    
    if (tournament.url) {
      description += `\nMore info: ${tournament.url}\n`;
    }
    
    description += `\nSource: BWF Tournament Calendar`;
    
    return description;
  }
  
  _getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, current) => acc && acc[current], obj);
  }
  
  _getDate(tournament, type) {
    if (tournament.dates && tournament.dates[type]) {
      return new Date(tournament.dates[type]).toISOString();
    } else if (tournament[type]) {
      return new Date(tournament[type]).toISOString();
    } else {
      return null;
    }
  }
}
