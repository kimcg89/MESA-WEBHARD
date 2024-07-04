const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 한글 파일명 처리
        cb(null, originalName);
    }
});

const upload = multer({ storage: storage });

// 파일 리스트 가져오기
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).send('Failed to list files');
        }
        const fileList = files.map(file => {
            const stats = fs.statSync(path.join('uploads', file));
            const originalName = file;
            return {
                filename: file,
                originalname: decodeURIComponent(originalName), // 한글 파일명 복원
                size: stats.size,
                uploadedAt: stats.birthtime
            };
        });
        res.json({ files: fileList });
    });
});

// 파일 업로드
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        const newFilename = req.file.filename;
        res.json({
            file: {
                filename: newFilename,
                originalname: originalName,
                size: req.file.size,
                uploadedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).send('Failed to upload file');
    }
});

// 파일 삭제
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    fs.unlink(path.join('uploads', filename), (err) => {
        if (err) {
            return res.status(500).send('Failed to delete file');
        }
        res.sendStatus(200);
    });
});

// 폴더 데이터 저장 파일
const foldersFilePath = path.join(__dirname, 'folders.json');

// 폴더 리스트 가져오기
app.get('/folders', (req, res) => {
    fs.readFile(foldersFilePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json({ folders: [] });
            }
            return res.status(500).send('Failed to read folders');
        }
        const folders = JSON.parse(data);
        res.json({ folders });
    });
});

// 폴더 저장
app.post('/folders', (req, res) => {
    const { folders } = req.body;
    fs.writeFile(foldersFilePath, JSON.stringify(folders), (err) => {
        if (err) {
            return res.status(500).send('Failed to save folders');
        }
        res.sendStatus(200);
    });
});

app.listen(3001, () => {
    console.log('Server started on http://localhost:3001');
});
