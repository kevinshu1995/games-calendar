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
    if (!data || !data.tournaments) {
      console.warn('Invalid BWF data format received');
      return [];
    }
    
    try {
      // 標準化後的數據數組
      const standardizedTournaments = [];
      
      // 處理每一個比賽
      for (const tournament of data.tournaments) {
        const standardTournament = {
          id: tournament.id || `bwf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: tournament.name,
          location: {
            city: tournament.location?.city || '',
            country: tournament.location?.country || '',
            venue: tournament.location?.venue || ''
          },
          dateStart: tournament.dates?.start || null,
          dateEnd: tournament.dates?.end || null,
          category: tournament.category || 'BWF Tournament',
          level: tournament.level || '',
          prize: tournament.prize || '',
          url: tournament.url || '',
          description: this._generateDescription(tournament),
          source: 'BWF',
          lastUpdated: new Date().toISOString()
        };
        
        standardizedTournaments.push(standardTournament);
      }
      
      return standardizedTournaments;
    } catch (error) {
      console.error('Error standardizing BWF tournament data:', error);
      throw new Error(`Failed to standardize BWF data: ${error.message}`);
    }
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
}
