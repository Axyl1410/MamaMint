import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import extract from 'extract-zip';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import * as process from 'node:process';
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { Token } from './entities/token.schema';

@Controller('generate')
export class GenerateController {
  private UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
  private OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');

  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.OUTPUT_DIR)) {
      fs.mkdirSync(this.OUTPUT_DIR, { recursive: true });
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) =>
          cb(null, path.join(__dirname, '..', '..', 'uploads')),
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uniqueId = uuidv4();
    const userFolder = path.join(this.UPLOAD_DIR, uniqueId);

    if (!fs.existsSync(userFolder))
      fs.mkdirSync(userFolder, { recursive: true });

    try {
      await extract(file.path, { dir: userFolder });

      const files = fs.readdirSync(userFolder);
      const indexFile = files.find(
        (file) => file.toLowerCase() === 'index.html',
      );

      if (!indexFile) {
        return res
          .status(400)
          .json({ message: 'index.html không tồn tại trong file ZIP' });
      }

      return res.json({
        message: 'File uploaded and extracted successfully',
        folderId: uniqueId,
        url: `/uploads/${uniqueId}/index.html`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Lỗi khi giải nén file', error: error.message });
    }
  }

  @Get('view/:id')
  async getIndex(@Param('id') id: string, @Res() res: Response) {
    const folderPath = path.join(this.UPLOAD_DIR, id);
    const indexPath = path.join(folderPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ message: 'File index.html not found' });
    }

    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    const sessionId = uuidv4();

    // Helper functions to generate random values
    const generateRandomHash = () =>
      '0x' +
      [...Array(64)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
    const generateRandomAddress = () =>
      '0x' +
      [...Array(40)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');

    // Generate actual or mock data
    const params = {
      a: generateRandomAddress(), // contractAddress
      c: [1, 5, 137, 80001][Math.floor(Math.random() * 4)], // chainId
      s: Math.floor(Math.random() * 100), // editionSize
      ms: Math.floor(Math.random() * 10) + 1, // mintSize
      mi: Math.floor(Math.random() * 5) + 1, // mintIteration
      h: generateRandomHash(), // transaction hash
      bh: generateRandomHash(), // block hash
      bn: Math.floor(Math.random() * 1000000), // blockNumber
      tid: Math.floor(Math.random() * 100), // tokenId
      wa: generateRandomAddress(), // walletAddress
      t: Math.floor(Date.now() / 1000), // timestamp
      gp: Math.floor(Math.random() * (200 - 10 + 1) + 10), // gasPrice
      gu: Math.floor(Math.random() * (100 - 10 + 1) + 10), // gasUsed
      ic: '0', // isCurated (default 0)
      pr: '0', // previewMode (default 0)
      nfts: encodeURIComponent(
        JSON.stringify([
          {
            tokenId: 1,
            traits: [],
          },
          {
            tokenId: 2,
            traits: [],
          },
          {
            tokenId: 3,
            traits: [],
          },
          {
            tokenId: 4,
            traits: [
              {
                trait_type: 'Number of Rectangles',
                value: '6',
              },
              {
                trait_type: 'Background Color',
                value: 'white',
              },
              {
                trait_type: 'Color Saturation',
                value: '21',
              },
              {
                trait_type: 'Color Brightness',
                value: '9',
              },
            ],
          },
          {
            tokenId: 5,
            traits: [
              {
                trait_type: 'Number of Rectangles',
                value: '8',
              },
              {
                trait_type: 'Background Color',
                value: 'white',
              },
              {
                trait_type: 'Color Saturation',
                value: '33',
              },
              {
                trait_type: 'Color Brightness',
                value: '59',
              },
            ],
          },
          {
            tokenId: 6,
            traits: [
              {
                trait_type: 'Number of Rectangles',
                value: '3',
              },
              {
                trait_type: 'Background Color',
                value: 'white',
              },
              {
                trait_type: 'Color Saturation',
                value: '27',
              },
              {
                trait_type: 'Color Brightness',
                value: '3',
              },
            ],
          },
        ]),
      ),
    };
    console.log(params.nfts);
    const scriptTag = `<script>
window.params = ${JSON.stringify(params)};
window.sessionId = '${sessionId}';

console.log('Injected Params:', window.params);
console.log('Injected Session ID:', window.sessionId);

window.onload = function() {
  console.log('Window loaded, sending sessionId:', window.sessionId);
  window.parent.postMessage({ sessionId: window.sessionId }, '*');
};

const observer = new MutationObserver(() => {
  if (window.$hl?.token?.name) {
    fetch('http://localhost:8080/generate/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: window.sessionId, id: '${id}', token: window.$hl.token }),
    })
    .then(response => response.json())
    .catch(error => console.error('Error sending token:', error));

    console.log('Sending sessionId via postMessage:', window.sessionId);
    window.parent.postMessage({ sessionId: window.sessionId }, '*');
window.parent.postMessage({ params: window.params }, '*');

    observer.disconnect();
  }
});

observer.observe(document, { childList: true, subtree: true });

</script>`;

    indexHtml = indexHtml.replace('</body>', `${scriptTag}</body>`);
    res.setHeader('Content-Type', 'text/html');
    return res.send(indexHtml);
  }

  @Post('save-token')
  async saveToken(@Body() body) {
    const { sessionId, id, token } = body;

    if (!sessionId || !id || !token) {
      throw new BadRequestException('Missing sessionId, id, or token');
    }

    try {
      // Kiểm tra xem token đã tồn tại chưa
      const existingToken = await this.tokenModel.findOne({ sessionId });

      if (existingToken) {
        // Nếu đã có, cập nhật token mới
        await this.tokenModel.updateOne({ id }, { $set: { sessionId, token } });
        return { message: 'Token updated successfully' };
      } else {
        // Nếu chưa có, tạo mới
        const savedToken = await this.tokenModel.create({
          sessionId,
          id,
          token,
        });
        return { message: 'Token saved successfully', savedToken };
      }
    } catch (error) {
      console.error('Error saving/updating token:', error);
      throw new InternalServerErrorException(
        `Failed to save/update token: ${error.message}`,
      );
    }
  }

  @Get('get-metadata/:sessionId')
  async getMetadata(@Param('sessionId') sessionId: string) {
    const tokenData = await this.tokenModel.findOne({ sessionId });

    if (!tokenData) {
      throw new NotFoundException('Metadata not found');
    }

    return { metadata: tokenData.token };
  }

  @Get('screenshot/:id')
  async generateScreenshot(
    @Param('id') id: string,
    @Query() queryParams: Record<string, string>,
    @Res() res: Response,
  ) {
    console.log(queryParams);
    const folderPath = path.join(this.UPLOAD_DIR, id);
    const indexPath = path.join(folderPath, 'index.html');
    const outputDir = path.join(process.cwd(), 'output');

    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ message: 'File index.html not found' });
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const screenshotPath = path.join(outputDir, `${id}.png`);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--allow-file-access-from-files',
        '--disable-web-security',
        '--no-sandbox',
      ],
    });

    try {
      const page = await browser.newPage();

      // Chuyển params thành query string
      const queryString = new URLSearchParams(queryParams).toString();
      const fileUrl = `file://${indexPath}${queryString ? '?' + queryString : ''}`;

      await page.goto(fileUrl, { waitUntil: 'networkidle2' });

      await page.waitForSelector('canvas', { timeout: 15000 });

      await page.waitForFunction(
        () => {
          const canvas = document.querySelector('canvas');
          return canvas && canvas.width > 0 && canvas.height > 0;
        },
        { timeout: 15000 },
      );

      await page.screenshot({ path: screenshotPath, type: 'png' });

      res.setHeader('Content-Type', 'image/png');
      return res.sendFile(screenshotPath, () => {
        // Xóa file sau khi gửi
        fs.unlinkSync(screenshotPath);
        console.log(`Screenshot deleted: ${screenshotPath}`);
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return res
        .status(500)
        .json({ message: 'Error capturing screenshot', error: error.message });
    } finally {
      await browser.close();
      console.log('Browser closed');
    }
  }

  @Get('view/:id/*')
  async getFile(@Param('id') id: string, @Res() res: Response, @Req() req) {
    const requestedPath = req.url.replace(`/generate/view/${id}/`, '');
    const fileFullPath = path.join(this.UPLOAD_DIR, id, requestedPath);

    if (!fs.existsSync(fileFullPath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.sendFile(fileFullPath);
  }
}
