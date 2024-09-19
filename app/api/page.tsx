import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { api } from '@/api/routes/routes.js';

import swaggerSpec from '@/swagger';

const app = express();
const PORT = process.env.PORT || 9999;

// BigInt.prototype.toJSON = function () {
//   return parseInt(this.toString());
// };

// app.use(bodyParser.json());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hello from Homepage');
});

app.use(api);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT} `));
