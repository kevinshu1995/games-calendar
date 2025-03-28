import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllCalendars } from '../src/utils/calendarStorage.js';

// 獲取當前目錄
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3001;

// 靜態文件服務
app.use(express.static(path.join(__dirname, '../public')));

// API 端點 - 獲取所有日曆
app.get('/api/calendars', async (req, res) => {
    try {
        const calendars = await getAllCalendars();
        res.json(calendars);
    } catch (error) {
        console.error('Error fetching calendars:', error);
        res.status(500).json({ error: 'Failed to fetch calendars' });
    }
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
