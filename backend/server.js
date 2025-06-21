const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Pasta onde as imagens serão salvas
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// Servir arquivos da pasta /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint de upload
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

    const url = `http://192.168.3.3:3000/uploads/${req.file.filename}`;
    return res.status(200).json({ url });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
