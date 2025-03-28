import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
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
 * 創建 OAuth2 客戶端並獲取 token
 */
async function authenticate() {
  try {
    console.log('Reading credentials from:', CREDENTIALS_PATH);
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(content);
    
    await getAccessToken(credentials);
  } catch (err) {
    console.error('Error loading client credentials:', err);
    console.log('');
    console.log('Please follow these steps to set up Google Calendar API:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a new project');
    console.log('3. Enable the Google Calendar API');
    console.log('4. Create OAuth 2.0 credentials');
    console.log('5. Download the credentials as JSON');
    console.log('6. Save the JSON file as "credentials.json" in the project root');
    console.log('7. Run this script again');
    process.exit(1);
  }
}

/**
 * 獲取並儲存 access token
 * @param {Object} credentials - OAuth2 憑證
 */
async function getAccessToken(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    // 檢查是否已有 token
    const token = await fs.readFile(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log('Existing token found and loaded.');
    
    // 檢查 token 是否有效
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    await calendar.calendarList.list();
    console.log('Token is valid.');
    
    return oAuth2Client;
  } catch (err) {
    return await getNewToken(oAuth2Client);
  }
}

/**
 * 獲取新的 token
 * @param {google.auth.OAuth2} oAuth2Client - OAuth2 客戶端
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log('Authorize this app by visiting this url:', authUrl);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const code = await new Promise((resolve) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      resolve(code);
    });
  });
  
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    // 儲存 token 到本地檔案
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to:', TOKEN_PATH);
    
    return oAuth2Client;
  } catch (err) {
    console.error('Error retrieving access token:', err);
    throw err;
  }
}

// 如果直接執行此文件
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  authenticate().catch(console.error);
}

export { authenticate };
