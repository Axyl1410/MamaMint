import { Controller, Get, Query, Res } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Controller('capture')
export class CaptureController {
  @Get()
  async captureScreenshot(@Query('url') url: string, @Res() res) {
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    try {
      // Thay localhost bằng 127.0.0.1
      const fixedUrl = url.replace('localhost', '127.0.0.1');
      console.log('Capturing:', fixedUrl);

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Fix lỗi khi chạy trên server
      });

      const page = await browser.newPage();
      const response = await page.goto(fixedUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Kiểm tra xem trang có load thành công không
      if (!response || !response.ok()) {
        console.error('Failed to load page:', response?.status());
        return res.status(500).json({ error: 'Failed to load page' });
      }

      const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: true });
      await browser.close();

      res.setHeader('Content-Type', 'image/png');
      res.send(screenshotBuffer);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      res.status(500).json({ error: 'Failed to capture screenshot' });
    }
  }
}
