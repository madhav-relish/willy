import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const JWT_SECRET = "helloworld"

const verifyUser = (token: string) => {
  return token
}

wss.on('connection', function connection(ws, req) {
  ws.on('error', console.error);

  const url = req.url
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1])
  const token = queryParams.get('token') || ""

  //verify the token
  const userId = verifyUser(token)
  if (!userId) {
    wss.close()
    return null
  }


  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});