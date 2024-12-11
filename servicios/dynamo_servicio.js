// services/dynamoService.js
const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Configuración del cliente DynamoDB
const dynamoDB = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    }
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

const guardarSesion = async (alumnoId) => {
    const sessionId = uuidv4();
    const timestamp = Math.floor(Date.now() / 1000);
    const sessionString = uuidv4();

    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: sessionId },
            fecha: { N: timestamp.toString() },
            alumnoid: { S: alumnoId },
            active: { BOOL: true },
            sessionString: { S: sessionString },
        },
    };

    try {
        const command = new PutItemCommand(params);
        await dynamoDB.send(command);
        console.log(sessionString, "2")
        return { sessionId, sessionString };
    } catch (error) {
        console.error('Error al crear sesión en DynamoDB:', error);
        throw new Error('Error al crear sesión en DynamoDB');
    }
};

const verificarSesion = async (sessionString) => {
    console.log(sessionString, "1")
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'sessionString = :sessionString AND active = :active',
        ExpressionAttributeValues: {
            ':sessionString': { S: sessionString },
            ':active': { BOOL: true },
        },
    };

    try {
        const command = new ScanCommand(params);
        const data = await dynamoDB.send(command);
        return data.Items.length > 0;
    } catch (error) {
        console.error('Error al verificar sesión en DynamoDB:', error);
        throw new Error('Error al verificar sesión en DynamoDB');
    }
};

const finalizarSesion = async (sessionString) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'sessionString = :sessionString',
        ExpressionAttributeValues: {
            ':sessionString': { S: sessionString },
        },
    };

    try {
        const command = new ScanCommand(params);
        const data = await dynamoDB.send(command);
        if (data.Items.length > 0) {
            const sessionId = data.Items[0].id.S;
            const updateParams = {
                TableName: TABLE_NAME,
                Key: { id: { S: sessionId } },
                UpdateExpression: 'SET active = :active',
                ExpressionAttributeValues: {
                    ':active': { BOOL: false },
                },
            };
            const updateCommand = new UpdateItemCommand(updateParams);
            await dynamoDB.send(updateCommand);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al cerrar sesión en DynamoDB:', error);
        throw new Error('Error al cerrar sesión en DynamoDB');
    }
};

module.exports = { guardarSesion, verificarSesion, finalizarSesion };
