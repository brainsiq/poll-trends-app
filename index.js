const app = require('./lib/app');
const { port } = require('./lib/config');

app.listen(port);

console.log(`Listening on ${port}`);
