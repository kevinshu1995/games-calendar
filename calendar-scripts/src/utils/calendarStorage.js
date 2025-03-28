import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 獲取當前目錄
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../../public/data/calendars.json');

/**
 * 讀取日曆數據
 * @returns {Promise<Object>} 日曆數據
 */
export async function loadCalendars() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const calendars = JSON.parse(data);
    
    // 將陣列轉換為物件格式
    const calendarObj = {
      calendars: {}
    };
    
    calendars.forEach(calendar => {
      calendarObj.calendars[calendar.sportId] = calendar;
    });

    return calendarObj;
  } catch (error) {
    console.error('Error loading calendar data:', error);
    return { calendars: {} };
  }
}

/**
 * 儲存日曆數據
 * @param {Object} data - 日曆數據
 * @returns {Promise<void>}
 */
export async function saveCalendars(data) {
  try {
    // 將物件格式轉換為陣列
    const calendars = Object.values(data.calendars);
    const dataStr = JSON.stringify(calendars, null, 2);
    await fs.writeFile(DATA_FILE, dataStr, 'utf-8');
  } catch (error) {
    console.error('Error saving calendar data:', error);
    throw error;
  }
}

/**
 * 更新日曆信息
 * @param {string} sportId - 體育 ID
 * @param {string} calendarId - 日曆 ID
 * @returns {Promise<void>}
 */
export async function updateCalendarInfo(sportId, calendarId) {
  const data = await loadCalendars();
  if (data.calendars[sportId]) {
    data.calendars[sportId].id = calendarId;
    await saveCalendars(data);
  }
}

/**
 * 獲取所有日曆信息
 * @returns {Promise<Array>} 日曆信息數組
 */
export async function getAllCalendars() {
  const data = await loadCalendars();
  return Object.values(data.calendars).map(calendar => ({
    ...calendar,
    publicUrl: calendar.id ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendar.id)}` : '',
    icalUrl: calendar.id ? `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendar.id)}/public/basic.ics` : ''
  }));
}
