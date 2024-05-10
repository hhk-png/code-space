import fs from 'fs';
import path from 'path'

let count: number = 0;
const txtPath: string = path.resolve('./packages/express-plugin/plugins/counter.txt');

export function load(app: any) {
  try {
    count += parseInt(fs.readFileSync(txtPath, 'utf8'));
  } catch(e) {
    console.log('No counter file found');
  }
  app.server.use((req, res, next) => {
    count++;
    next();
  });
  app.server.get('/count', (req, res) => {
    res.send(`Counter: ${count}`);
  });
}

export function unload() {
  fs.writeFileSync(txtPath, count + "");
}

