const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = process.argv[2] || 'd:/DevProject/breastcalculator';
const port = Number(process.argv[3] || 8765);
const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  let fp = path.join(dir, url);
  if (!fs.existsSync(fp)) { res.writeHead(404); res.end('not found: ' + url); return; }
  const ext = path.extname(fp).toLowerCase();
  const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.ico':'image/x-icon'}[ext] || 'application/octet-stream';
  const c = fs.readFileSync(fp);
  res.writeHead(200, {'Content-Type': mime});
  res.end(c);
});
server.listen(port, () => console.log('http://localhost:' + port));
