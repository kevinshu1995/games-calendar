import { BwfAdapter } from './bwfAdapter.js';

// 適配器註冊表
const adapters = {
  'bwf': BwfAdapter
};

/**
 * 根據體育ID獲取對應的適配器
 * @param {string} sportId - 體育ID (例如: 'bwf')
 * @returns {Object|null} 適配器實例或null（如果沒有對應的適配器）
 */
export function getAdapter(sportId) {
  const AdapterClass = adapters[sportId];
  
  if (!AdapterClass) {
    console.warn(`No adapter registered for sport ID: ${sportId}`);
    return null;
  }
  
  return new AdapterClass();
}

/**
 * 註冊一個新的適配器
 * @param {string} sportId - 體育ID
 * @param {Class} AdapterClass - 適配器類
 */
export function registerAdapter(sportId, AdapterClass) {
  adapters[sportId] = AdapterClass;
  console.log(`Registered adapter for ${sportId}`);
}
