import dotenv from 'dotenv';
import { fetchApiIndex, fetchTournamentData } from '../utils/apiClient.js';
import { getAdapter } from '../adapters/adapterFactory.js';
import { processData } from '../utils/dataProcessor.js';

// 載入環境變數
dotenv.config();

describe('API Client Tests', () => {
  let sportId;

  beforeAll(() => {
    // Use 'bwf' as default for testing
    sportId = process.env.TEST_SPORT_ID || 'bwf';
  });

  test('should fetch API index successfully', async () => {
    const apiIndex = await fetchApiIndex();
    expect(apiIndex).toBeDefined();
    expect(Array.isArray(apiIndex.apis)).toBe(true);
    expect(apiIndex.apis.length).toBeGreaterThan(0);
  });

  test('should fetch tournament data successfully', async () => {
    const tournamentData = await fetchTournamentData(sportId);
    expect(tournamentData).toBeDefined();
    expect(Object.keys(tournamentData).length).toBeGreaterThan(0);
  });

  test('should standardize tournament data', async () => {
    const tournamentData = await fetchTournamentData(sportId);
    const adapter = getAdapter(sportId);
    
    expect(adapter).toBeDefined();
    
    const standardizedData = adapter.standardize(tournamentData);
    expect(Array.isArray(standardizedData)).toBe(true);
    expect(standardizedData.length).toBeGreaterThan(0);
  });

  test('should process tournament data', async () => {
    const tournamentData = await fetchTournamentData(sportId);
    const adapter = getAdapter(sportId);
    const standardizedData = adapter.standardize(tournamentData);
    
    const processedData = processData(standardizedData);
    expect(processedData).toBeDefined();
    expect(Object.keys(processedData).length).toBeGreaterThan(0);
    expect(Object.keys(processedData.tournamentsByMonth).length).toBeGreaterThan(0);
  });
});
