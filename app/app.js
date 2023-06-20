const http = require('http');
const os = require("os");

const hostname = '0.0.0.0';
const port = 3000;


const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://0.0.0.0:27017";
const mongoClient = new MongoClient(url);
count = 0;

async function run() {
    try {
        // Подключаемся к серверу
        await mongoClient.connect();
        // обращаемся к базе данных пользователя
        const db = mongoClient.db('artem');
        // выполняем пинг для проверки подключения
        const result = await db.command({ ping: 1 });
        console.log("Подключение с сервером успешно установлено");
        const collection = db.collection("users");
        count = await collection.countDocuments();
        console.log(`В коллекции users ${count} документа/ов`);
        console.log(result);
    } catch (err) {
        console.log("Возникла ошибка");
        console.log(err);
    } finally {
        // Закрываем подключение при завершении работы или при ошибк
        await mongoClient.close();
        console.log("Подключение закрыто");
    }
}

run().catch(console.error);

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Hello Artem, you have ${count} documents`);
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
