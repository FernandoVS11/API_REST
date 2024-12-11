const AWS = require('aws-sdk');

// Configuración de AWS SDK
AWS.config.update({
    region: 'us-east-1',
});

const sns = new AWS.SNS();

const topicArn = process.env.AWS_ARN ; // Reemplaza con tu ARN real

async function enviarNotificacion(mensaje) {
    const params = {
        TopicArn: topicArn,
        Message: mensaje,
        Subject: 'Notificación de Alumno',
    };

    try {
        const result = await sns.publish(params).promise();
        console.log('Notificación enviada:', result);
        return result;
    } catch (error) {
        console.error('Error al enviar la notificación:', error);
        throw error;
    }
}


module.exports = {
    enviarNotificacion,
};
