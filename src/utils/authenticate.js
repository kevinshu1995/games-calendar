import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// 獲取當前目錄
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Google Calendar API 範圍
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// 認證路徑
const CREDENTIALS_PATH = process.env.GOOGLE_CALENDAR_CREDENTIALS || 
                         path.resolve(process.cwd(), 'credentials.json');
const TOKEN_PATH = process.env.GOOGLE_CALENDAR_TOKEN || 
                   path.resolve(process.cwd(), 'token.json');

/**
 * 使用服務帳戶進行認證
 * 這種方法適用於在無頭環境（如 GitHub Actions）中運行
 */
export async function authorize() {
  try {
    console.log('使用服務帳戶認證...');
    
    // 首先檢查 credentials.json 文件是否存在
    try {
      await fs.access(CREDENTIALS_PATH);
    } catch (err) {
      throw new Error(`憑證文件 ${CREDENTIALS_PATH} 不存在，請先創建服務帳戶並下載金鑰`);
    }
    
    // 讀取憑證文件
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
    
    // 使用服務帳戶憑證創建 JWT 客戶端
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES
    });
    
    // 獲取客戶端
    const client = await auth.getClient();
    console.log('服務帳戶認證成功!');
    
    // 將認證信息保存到 token.json (非必要，但保持一致性)
    await fs.writeFile(TOKEN_PATH, JSON.stringify({
      type: 'service_account',
      project_id: credentials.project_id,
      private_key_id: credentials.private_key_id,
      client_email: credentials.client_email,
      token_uri: credentials.token_uri
    }));
    
    return client;
  } catch (error) {
    console.error('認證失敗:', error);
    throw error;
  }
}

/**
 * 設置日曆訪問權限
 * 對於服務帳戶，需要手動授予日曆的訪問權限
 * @param {google.auth.OAuth2} auth - 認證客戶端
 * @param {string} calendarId - 日曆 ID
 */
export async function shareCalendarWithServiceAccount(auth, calendarId = 'primary') {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    
    // 獲取服務帳戶電子郵件
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH));
    const serviceAccountEmail = credentials.client_email;
    
    if (!serviceAccountEmail) {
      throw new Error('無法獲取服務帳戶電子郵件');
    }
    
    console.log(`共享日曆 ${calendarId} 給服務帳戶 ${serviceAccountEmail}...`);
    
    // 為服務帳戶添加日曆訪問權限
    await calendar.acl.insert({
      calendarId,
      requestBody: {
        role: 'writer',
        scope: {
          type: 'user',
          value: serviceAccountEmail
        }
      }
    });
    
    console.log('日曆訪問權限設置成功!');
  } catch (error) {
    console.error('設置日曆訪問權限失敗:', error);
    throw error;
  }
}

// 如果直接執行此文件
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  authorize()
    .then(() => {
      console.log('\n認證成功!');
      console.log('\n重要提醒:');
      console.log('使用服務帳戶時，您需要在 Google 日曆中手動授予該服務帳戶訪問權限。');
      console.log('請前往 Google 日曆網頁版，在日曆共享設置中添加以下電子郵件:');
      
      // 嘗試讀取服務帳戶郵箱
      fs.readFile(CREDENTIALS_PATH)
        .then(content => {
          const credentials = JSON.parse(content);
          if (credentials.client_email) {
            console.log(`  ${credentials.client_email}`);
          }
        })
        .catch(() => {});
    })
    .catch(err => {
      console.error('認證失敗:', err);
      process.exit(1);
    });
}
