// s3_servicio.js
const AWS = require('aws-sdk');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configura el SDK de AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET;

async function subirArchivo(file) {
    const extension = path.extname(file.originalname);
    const nombreArchivo = `${uuidv4()}${extension}`;

    const params = {
        Bucket: BUCKET_NAME,
        Key: nombreArchivo,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Devuelve la URL pública del archivo
    } catch (error) {
        console.error('Error al subir archivo a S3:', error);
        throw new Error('No se pudo subir el archivo a S3');
    }
}

module.exports = {
    subirArchivo,
};
