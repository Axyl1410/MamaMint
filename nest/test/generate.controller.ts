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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import FormData from 'form-data';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'node:process';
import extract from 'extract-zip';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import puppeteer from 'puppeteer';
import { Response } from 'express';
import { Model } from 'mongoose';
import { Token } from './entities/token.schema';
import { InjectModel } from '@nestjs/mongoose';

declare global {
  interface Window {
    $hl?: {
      token: Record<string, any>;
    };
  }
}

@Controller('generate')
export class GenerateController {
  private UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
  private OUTPUT_DIR = path.join(__dirname, '..', '..', 'output');

  // private ipfs;

  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>, // ✅ Đưa vào tham số constructor
  ) {
    // ✅ Kiểm tra và tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
    if (!fs.existsSync(this.OUTPUT_DIR)) {
      fs.mkdirSync(this.OUTPUT_DIR, { recursive: true });
    }
    // this.initIPFS(); // Nếu cần khởi tạo IPFS, bỏ comment dòng này
  }

  // async initIPFS() {
  //   this.ipfs = create({ url: 'http://localhost:5001' });
  // }

  // async uploadToPinata(filePath: string, fileName: string) {
  //   const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  //
  //   const data = new FormData();
  //   const fileStream = fs.createReadStream(filePath);
  //   (data as any).append('file', fileStream, { filename: fileName });
  //
  //   const metadata = JSON.stringify({ name: fileName });
  //   data.append('pinataMetadata', metadata);
  //
  //   const options = JSON.stringify({ cidVersion: 0 });
  //   data.append('pinataOptions', options);
  //
  //   try {
  //     const response = await axios.post(url, data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         pinata_api_key: process.env.PINATA_API_KEY,
  //         pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
  //       },
  //     });
  //     return `ipfs://${response.data.IpfsHash}`;
  //   } catch (error) {
  //     console.error('Error uploading to Pinata:', error);
  //     throw new Error('Failed to upload to Pinata');
  //   }
  // }

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

    const uniqueId = uuidv4(); // Tạo một ID ngẫu nhiên
    console.log(uniqueId);
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

      const indexHtmlPath = path.join(userFolder, indexFile);
      if (!fs.existsSync(indexHtmlPath)) {
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

  // async uploadFolderToIPFS(folderPath: string) {
  //   const files = [];
  //   const dir = fs.readdirSync(folderPath);
  //   const fileCIDs = {};
  //
  //   for (const file of dir) {
  //     const filePath = path.join(folderPath, file);
  //     const content = fs.readFileSync(filePath);
  //
  //     const result = await this.ipfs.add({ path: file, content });
  //     fileCIDs[file] = `ipfs://${result.cid.toString()}`;
  //
  //     files.push({ path: `metadata/${file}`, content });
  //   }
  //
  //   let folderCID = '';
  //
  //   for await (const result of this.ipfs.addAll(files, {
  //     wrapWithDirectory: true,
  //   })) {
  //     folderCID = `https://ipfs.io/ipfs/${result.cid.toString()}`; // Lưu CID cuối cùng (là folder)
  //   }
  //
  //   return {
  //     folderCID,
  //   };
  // }

  // @Post('generate')
  // async generateImages(
  //   @Query('amount') amount: number,
  //   @Query('id') id: number,
  //   @Res() res,
  // ) {
  //   if (!amount) {
  //     return res.status(400).json({ message: 'Missing amount' });
  //   }
  //
  //   const uniqueId = uuidv4(); // Tạo một ID ngẫu nhiên
  //   const outputPath = path.join(this.OUTPUT_DIR, uniqueId);
  //   const imagesPath = path.join(outputPath, 'images');
  //   const metadataPath = path.join(outputPath, 'metadata');
  //
  //   // Tạo thư mục mới
  //   [outputPath, imagesPath, metadataPath].forEach((dir) => {
  //     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  //   });
  //
  //   try {
  //     const browser = await puppeteer.launch({
  //       headless: true,
  //       args: [
  //         '--allow-file-access-from-files',
  //         '--disable-web-security',
  //         '--no-sandbox',
  //       ],
  //     });
  //
  //     const page = await browser.newPage();
  //     const fileUrl = `file://${path.join(this.UPLOAD_DIR, `${id}/index.html`)}`;
  //     await page.goto(fileUrl, { waitUntil: 'networkidle2' });
  //
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  //     for (let i = 0; i < Number(amount); i++) {
  //       console.log(i);
  //       await page.reload({ waitUntil: 'networkidle2' });
  //       await new Promise((resolve) => setTimeout(resolve, 500));
  //
  //       const imgFileName = `${i + 1}.png`;
  //       console.log(1);
  //       const imgPath = path.join(imagesPath, imgFileName);
  //       await page.screenshot({ path: imgPath });
  //       console.log(2);
  //
  //       await page.waitForFunction(() => window.$hl?.token);
  //       console.log(3);
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //       const hlToken = await page.evaluate(() => window.$hl?.token);
  //       console.log(hlToken);
  //
  //       const metadata = {
  //         name: hlToken.name || `NFT #${i + 1}`,
  //         description: hlToken.description || 'No description',
  //         image: '',
  //         attributes: Object.entries(hlToken.traits).map(
  //           ([traitType, value]) => ({
  //             trait_type: traitType,
  //             value,
  //           }),
  //         ),
  //       };
  //       const imageIPFS = await this.uploadToPinata(imgPath, imgFileName);
  //       metadata.image = imageIPFS;
  //
  //       const metadataFilePath = path.join(metadataPath, `${i + 1}.json`);
  //       fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
  //     }
  //
  //     await browser.close();
  //
  //     const folderCid = await this.uploadFolderToIPFS(metadataPath);
  //     console.log('Folder uploaded to IPFS:', folderCid);
  //
  //     return res.json({
  //       message: 'NFT images and metadata generated successfully',
  //       folderCid: folderCid,
  //     });
  //   } catch (error) {
  //     return res
  //       .status(500)
  //       .json({ message: 'Error generating images', error: error.message });
  //   }
  // }

  @Get('view/:id')
  async getIndex(
    @Param('id') id: string,
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ) {
    console.log('view id', id);
    const folderPath = path.join(this.UPLOAD_DIR, id);
    const indexPath = path.join(folderPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ message: 'File index.html not found' });
    }

    let indexHtml = fs.readFileSync(indexPath, 'utf8');

    const scriptTag = `<script>
window.params = ${JSON.stringify(query)};
window.userId = new URLSearchParams(window.location.search).get('userId') || 'guest';
console.log('Query Params:', window.params);
console.log('User ID:', window.userId);

const observer = new MutationObserver(() => {
  if (window.$hl?.token?.name) {
    console.log('Sending token:', window.$hl.token);
    fetch('http://localhost:8080/generate/save-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: window.userId, id: "${id}", token: window.$hl.token }),
    })
    .then(response => response.json())
    .then(data => console.log('Server response:', data))
    .catch(error => console.error('Error sending token:', error));

    observer.disconnect(); // Ngừng theo dõi sau khi có dữ liệu
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
    const { userId, id, token } = body; // Nhận thêm userId

    if (!userId || !id || !token) {
      throw new BadRequestException('Missing userId, id, or token');
    }

    try {
      const savedToken = await this.tokenModel.findOneAndUpdate(
        { userId, id }, // Tìm theo userId + id
        { token },
        { upsert: true, new: true },
      );

      console.log('Token saved:', savedToken);
      return { message: 'Token saved successfully' };
    } catch (error) {
      console.error('Error saving token:', error);
      throw new InternalServerErrorException('Failed to save token');
    }
  }

  @Get('get-metadata/:userId/:id')
  async getMetadata(@Param('userId') userId: string, @Param('id') id: string) {
    const tokenData = await this.tokenModel.findOne({ userId, id });

    if (!tokenData) {
      throw new NotFoundException('Metadata not found');
    }

    return { metadata: tokenData.token };
  }

  @Get('view/:id/*')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const requestedPath = res.req.url.replace(`/generate/view/${id}/`, '');
    const fileFullPath = path.join(this.UPLOAD_DIR, id, requestedPath);

    if (!fs.existsSync(fileFullPath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.sendFile(fileFullPath);
  }
}
