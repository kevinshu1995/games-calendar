import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { authorize } from '../utils/authenticate.js';
import { updateCalendarInfo } from '../utils/calendarStorage.js';

// 獲取當前目錄
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Google Calendar API 範圍
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// 日曆顏色對映（可用於不同體育類型）
const CALENDAR_COLORS = {
  'bwf': '5',  // 黃色
  'default': '1'  // 藍色
};

/**
 * 為特定體育類型創建或更新 Google 日曆
 * @param {string} sportId - 體育 ID (例如: 'bwf')
 * @param {Object} data - 處理後的賽事數據
 * @returns {Promise<string>} 創建或更新的日曆 ID
 */
export async function createOrUpdateCalendar(sportId, data) {
  try {
    // 檢查是否有賽事數據
    if (!data || !data.tournaments || data.tournaments.length === 0) {
      console.warn(`No tournament data available for ${sportId}, skipping calendar creation`);
      return null;
    }
    
    // 嘗試獲取驗證客戶端
    let auth;
    try {
      auth = await getAuthClient();
    } catch (error) {
      console.warn(`Google Calendar authentication failed: ${error.message}`);
      console.warn('Calendar creation skipped. To create calendars, please set up Google Calendar credentials.');
      
      // 返回模擬的日曆 ID
      return `mock-calendar-${sportId}`;
    }
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    // 獲取或創建日曆
    const calendarId = await getOrCreateCalendar(calendar, sportId);
    
    // 清除現有事件（可選，依據需求決定是否保留）
    // await clearExistingEvents(calendar, calendarId);
    
    // 創建賽事事件
    await createEvents(calendar, calendarId, data.tournaments, sportId);
    
    return calendarId;
  } catch (error) {
    console.error(`Error creating/updating calendar for ${sportId}:`, error);
    throw error;
  }
}

/**
 * 獲取 Google API 認證客戶端
 * @returns {Promise<google.auth.OAuth2>} 認證客戶端
 */
async function getAuthClient() {
  try {
    // 使用 authenticate.js 中的 authorize 函數獲取認證
    console.log('Getting Google API auth client...');
    const auth = await authorize();
    console.log('Successfully obtained auth client');
    return auth;
  } catch (error) {
    console.error('Error getting auth client:', error);
    throw error;
  }
}

/**
 * 獲取或創建日曆
 * @param {google.calendar} calendar - Google Calendar API 實例
 * @param {string} sportId - 體育 ID
 * @returns {Promise<string>} 日曆 ID
 */
async function getOrCreateCalendar(calendar, sportId) {
  try {
    // 首先嘗試查找現有的日曆
    const calendarListResponse = await calendar.calendarList.list();
    const calendarList = calendarListResponse.data.items;
    
    // 創建日曆名稱和描述
    const calendarName = getCalendarName(sportId);
    const calendarDesc = getCalendarDescription(sportId);
    
    // 查找現有的日曆
    const existingCalendar = calendarList.find(cal => cal.summary === calendarName);
    
    if (existingCalendar) {
      console.log(`Found existing calendar for ${sportId}: ${existingCalendar.id}`);
      
      // 更新日曆 ID 到儲存中
      await updateCalendarInfo(sportId, existingCalendar.id);
      
      // 確保現有日曆的權限設置是正確的
      await updateCalendarAccessSettings(calendar, existingCalendar.id);
      
      // 顯示日曆訂閱資訊
      displayCalendarInfo(existingCalendar);
      
      return existingCalendar.id;
    }
    
    // 沒有找到現有日曆，創建新的
    console.log(`Creating new calendar for ${sportId}...`);
    const newCalendar = await calendar.calendars.insert({
      requestBody: {
        summary: calendarName,
        description: calendarDesc,
        timeZone: 'UTC'
      }
    });
    
    // 獲取創建的日曆 ID
    const calendarId = newCalendar.data.id;
    
    // 儲存日曆 ID
    await updateCalendarInfo(sportId, calendarId);
    
    // 設置日曆顏色
    const colorId = CALENDAR_COLORS[sportId] || CALENDAR_COLORS.default;
    await calendar.calendarList.update({
      calendarId: calendarId,
      requestBody: {
        colorId
      }
    });
    
    // 設置日曆為公開可見
    await updateCalendarAccessSettings(calendar, calendarId);
    
    // 獲取並顯示更新後的日曆信息
    const updatedCalendar = await calendar.calendarList.get({
      calendarId: calendarId
    });
    
    // 顯示日曆訂閱資訊
    displayCalendarInfo(updatedCalendar.data);
    
    console.log(`Created new calendar for ${sportId}: ${calendarId}`);
    return calendarId;
  } catch (error) {
    console.error(`Error getting/creating calendar for ${sportId}:`, error);
    throw error;
  }
}

/**
 * 更新日曆的訪問權限設置，確保公開可見但僅開發者可編輯
 * @param {google.calendar} calendar - Google Calendar API 實例
 * @param {string} calendarId - 日曆 ID
 */
async function updateCalendarAccessSettings(calendar, calendarId) {
  try {
    console.log(`Setting public access for calendar ${calendarId}...`);
    
    // 更新日曆的訪問控制列表 (ACL)
    await calendar.acl.insert({
      calendarId: calendarId,
      requestBody: {
        role: "reader",
        scope: {
          type: "default"  // "default" 表示所有人
        }
      }
    });
    
    console.log('Calendar access settings updated successfully.');
  } catch (error) {
    console.error('Error updating calendar access settings:', error);
    // 繼續處理，不中斷流程
    console.log('Continuing with default access settings...');
  }
}

/**
 * 顯示日曆訂閱資訊
 * @param {Object} calendar - 日曆對象
 */
function displayCalendarInfo(calendar) {
  console.log('\n===== Calendar Subscription Information =====');
  console.log(`Calendar Name: ${calendar.summary}`);
  console.log(`Calendar ID: ${calendar.id}`);
  
  // 日曆的公開 URL 格式
  const publicUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendar.id)}`;
  const icalUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendar.id)}/public/basic.ics`;
  
  console.log('\nSubscription Links:');
  console.log(`Public URL: ${publicUrl}`);
  console.log(`iCal URL: ${icalUrl}`);
  console.log('===========================================\n');
}

/**
 * 清除日曆中的現有事件
 * @param {google.calendar} calendar - Google Calendar API 實例
 * @param {string} calendarId - 日曆 ID
 */
async function clearExistingEvents(calendar, calendarId) {
  try {
    console.log(`Clearing existing events from calendar ${calendarId}...`);
    
    // 獲取現有事件
    const eventsResponse = await calendar.events.list({
      calendarId,
      maxResults: 2500
    });
    
    const events = eventsResponse.data.items;
    
    if (events.length === 0) {
      console.log('No existing events found.');
      return;
    }
    
    console.log(`Found ${events.length} existing events, deleting...`);
    
    // 刪除每個事件
    for (const event of events) {
      await calendar.events.delete({
        calendarId,
        eventId: event.id
      });
    }
    
    console.log('All existing events cleared.');
  } catch (error) {
    console.error('Error clearing existing events:', error);
    throw error;
  }
}

/**
 * 創建賽事事件
 * @param {google.calendar} calendar - Google Calendar API 實例
 * @param {string} calendarId - 日曆 ID
 * @param {Array} tournaments - 賽事數據數組
 * @param {string} sportId - 體育 ID
 */
async function createEvents(calendar, calendarId, tournaments, sportId) {
  if (!tournaments || tournaments.length === 0) {
    console.log(`No tournaments to add for ${sportId}`);
    return;
  }
  
  console.log(`Creating ${tournaments.length} events for ${sportId}...`);
  
  for (const tournament of tournaments) {
    try {
      // 檢查是否已存在相同名稱和日期範圍的事件
      const existingEvents = await calendar.events.list({
        calendarId,
        timeMin: new Date(tournament.dateStart).toISOString(),
        timeMax: new Date(tournament.dateEnd).toISOString(),
        q: tournament.name,
        singleEvents: true
      });

      // 如果沒有找到相同名稱和日期範圍的事件，則創建新事件
      if (!existingEvents.data.items || existingEvents.data.items.length === 0) {
        await calendar.events.insert({
          calendarId,
          requestBody: {
            summary: tournament.name,
            location: formatLocation(tournament.location),
            description: tournament.description,
            start: {
              date: formatDate(tournament.dateStart),
              timeZone: 'UTC'
            },
            end: {
              date: formatDate(tournament.dateEnd, true),
              timeZone: 'UTC'
            },
            transparency: 'transparent',
            visibility: 'public',
            source: {
              title: `${getSourceName(sportId)} Calendar`,
              url: tournament.url || ''
            }
          }
        });
        console.log(`Created event for tournament: ${tournament.name}`);
      } else {
        console.log(`Event already exists for tournament: ${tournament.name}`);
      }
    } catch (error) {
      console.error(`Error processing event for tournament ${tournament.name}:`, error);
      // 繼續處理其他賽事，不中斷整個流程
    }
  }
  
  console.log(`Finished processing ${tournaments.length} events for ${sportId}`);
}

/**
 * 格式化日期為 YYYY-MM-DD 格式
 * @param {string} dateString - ISO 日期字符串
 * @param {boolean} addDay - 是否加一天
 * @returns {string} 格式化的日期
 */
function formatDate(dateString, addDay = false) {
  const date = new Date(dateString);
  
  if (addDay) {
    date.setDate(date.getDate() + 1);
  }
  
  return date.toISOString().split('T')[0];
}

/**
 * 格式化位置信息
 * @param {Object} location - 位置對象
 * @returns {string} 格式化的位置字符串
 */
function formatLocation(location) {
  if (!location) return '';
  
  return [location.venue, location.city, location.country]
    .filter(Boolean)
    .join(', ');
}

/**
 * 獲取日曆名稱
 * @param {string} sportId - 體育 ID
 * @returns {string} 日曆名稱
 */
function getCalendarName(sportId) {
  const names = {
    'bwf': 'BWF Badminton Tournaments',
    // 可以添加更多體育類型
  };
  
  return names[sportId] || `${sportId.toUpperCase()} Tournaments`;
}

/**
 * 獲取日曆描述
 * @param {string} sportId - 體育 ID
 * @returns {string} 日曆描述
 */
function getCalendarDescription(sportId) {
  const descriptions = {
    'bwf': 'Badminton World Federation tournament calendar',
    // 可以添加更多體育類型
  };
  
  return descriptions[sportId] || `${sportId.toUpperCase()} tournament calendar`;
}

/**
 * 獲取來源名稱
 * @param {string} sportId - 體育 ID
 * @returns {string} 來源名稱
 */
function getSourceName(sportId) {
  const names = {
    'bwf': 'BWF',
    // 可以添加更多體育類型
  };
  
  return names[sportId] || sportId.toUpperCase();
}
