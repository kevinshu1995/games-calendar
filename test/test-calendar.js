import dotenv from 'dotenv';
import { fetchApiIndex, fetchTournamentData } from '../utils/apiClient.js';
import { getAdapter } from '../adapters/adapterFactory.js';
import { processData } from '../utils/dataProcessor.js';
import { createOrUpdateCalendar } from '../services/calendarService.js';

// 載入環境變數
dotenv.config();

describe('Calendar Service Tests', () => {
  let sportId;
  let tournamentData;
  let standardizedData;
  let processedData;

  beforeAll(async () => {
    // Use 'bwf' as default for testing
    sportId = process.env.TEST_SPORT_ID || 'bwf';
    
    // Fetch tournament data
    tournamentData = await fetchTournamentData(sportId);
    
    // Get adapter and standardize data
    const adapter = getAdapter(sportId);
    standardizedData = adapter.standardize(tournamentData);
    
    // Process data
    processedData = processData(standardizedData);
  });

  test('should fetch API index successfully', async () => {
    const apiIndex = await fetchApiIndex();
    expect(apiIndex).toBeDefined();
    expect(Array.isArray(apiIndex.apis)).toBe(true);
    expect(apiIndex.apis.length).toBeGreaterThan(0);
  });

  test('should create or update calendar', async () => {
    const calendarId = await createOrUpdateCalendar(sportId, processedData);
    expect(calendarId).toBeDefined();
    expect(typeof calendarId).toBe('string');
  });

  test('should handle duplicate events', async () => {
    // This test assumes the removeDuplicateEvents script is available
    const { removeDuplicateEvents } = require('../scripts/removeDuplicateEvents.js');
    
    const calendarId = await createOrUpdateCalendar(sportId, processedData);
    await removeDuplicateEvents(calendarId);
    // Add assertions to verify duplicates were removed
  });
});
