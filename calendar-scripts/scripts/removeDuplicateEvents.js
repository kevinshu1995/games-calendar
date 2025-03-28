#!/usr/bin/env node

import { google } from 'googleapis';
import { authorize } from '../src/utils/authenticate.js';

// Google Calendar API 範圍
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/**
 * 移除日曆中的重複事件
 * @param {string} calendarId - 日曆 ID
 */
async function removeDuplicateEvents(calendarId) {
  try {
    // 獲取認證客戶端
    const auth = await authorize();
    const calendar = google.calendar({ version: 'v3', auth });

    console.log(`開始檢查日曆 ${calendarId} 的重複事件...`);

    // 獲取所有事件
    const eventsResponse = await calendar.events.list({
      calendarId,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = eventsResponse.data.items || [];
    console.log(`找到 ${events.length} 個事件`);

    if (events.length === 0) {
      console.log('沒有找到任何事件');
      return;
    }

    // 使用 Map 來追蹤事件，以 tournament name 和日期範圍作為 key
    const eventMap = new Map();
    let duplicatesRemoved = 0;

    for (const event of events) {
      const { summary, start, end } = event;
      
      // 跳過沒有 summary 或日期的事件
      if (!summary || !start || !end) continue;

      // 獲取日期範圍（只處理全天事件）
      const startDate = start.date;
      const endDate = end.date;
      
      if (startDate && endDate) {
        const key = `${summary}-${startDate}-${endDate}`;
        
        if (eventMap.has(key)) {
          // 如果已經存在相同名稱和日期範圍的事件，則刪除當前事件
          console.log(`找到重複事件: ${summary} (${startDate} to ${endDate})`);
          await calendar.events.delete({
            calendarId,
            eventId: event.id
          });
          duplicatesRemoved++;
        } else {
          // 記錄新的事件
          eventMap.set(key, event.id);
        }
      }
    }

    console.log(`\n完成檢查！`);
    console.log(`總共移除 ${duplicatesRemoved} 個重複事件`);
    console.log(`保留 ${events.length - duplicatesRemoved} 個唯一事件`);

  } catch (error) {
    console.error('Error removing duplicate events:', error);
    throw error;
  }
}

// 主程式
async function main() {
  // 請替換為你要處理的日曆 ID
  const calendarId = process.argv[2];
  
  if (!calendarId) {
    console.error('請提供日曆 ID 作為參數');
    console.log('使用方法: node scripts/removeDuplicateEvents.js <calendar-id>');
    process.exit(1);
  }

  await removeDuplicateEvents(calendarId);
}

main().catch(console.error);
