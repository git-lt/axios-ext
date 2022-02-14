
const express = require('express');
const http = require('http');

const app = new express();
app.use(express.json());

const PORT = 3011;

const sleep = time =>  new Promise(resolve => { setTimeout(resolve, time)});


// 添加公共的header
app.all('*', (req, res, next) => {
  res.header('Cache-Control', 'no-cache');
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  next();
})

// 配置 options 请求
app.options('*', (req, res) => {
  // res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, token');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since, token, Authorization');
  res.header('Access-Control-All-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.send({ msg: 'ok' });
})

const responseCallback = (req, res) =>{
  const data = {...req.query, ...req.body};
  const { delay = 300, status = 200, ...others} = data;

  res.status(status);
  sleep(delay).then(() => {
    res.send({
      message: 'ok',
      code: status,
      ...others
    })
  })
}

let i = 0;
app.get('/api/user', (req, res) =>{
  console.log(req.query)
  
  // if(i<=2){
  //   res.status(500);
  // }else{
  //   res.status(200);
  //   i = 0;
  // }
  // i++;
  // console.log(i)
  sleep(500).then(() => {
    res.send({ code: 500,  mesasge: 'fail' });
  })
});

app.post('/api/user', responseCallback)

app.put('/api/user',responseCallback)

app.delete('/api/user',responseCallback)

let sessionId = 1;
app.post('/api/login', (req, res) => {
  sessionId++;
  res.cookie('sessionId', String(sessionId), { 
    httpOnly: true,
    // path: '/foo',
    // maxAge: 60000,
    // domain: 'example.com',
    // // Lax / Strict / None
    // simeSite: 'None',
    // secure: true,
  });
  res.send({ msg: 'ok' })
});

http.createServer(app).listen(PORT, () => {
  console.log(`HTTP Server listening at http://localhost:${PORT}`)
});

