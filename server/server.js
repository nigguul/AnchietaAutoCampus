const http = require('http');
const FS = require("fs");
const XLSX = require('xlsx');

const port = process.env.PORT || 15768;

const contentTypes = {
	"css": "text/css",
	"js": "text/javascript",
	"svg": "image/svg+xml",
  "png": "image/png",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg"
}

async function readUsers() {
  try {
    const data = FS.readFileSync("./data/users.json");
    const users = JSON.parse(data);
    return users
  } catch (err) {}
}

async function readCars() {
  try {
    const data = FS.readFileSync("./data/cars.json");
    const cars = JSON.parse(data);
    return cars
  } catch (err) {}
}

async function newUser(user) {
  try {
    FS.writeFileSync("./data/users.json", user)
  } catch (err) {}
}

const paths = {
  '/': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end(FS.readFileSync(`./pages/index.html`));
  },
  '/login': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end(FS.readFileSync(`./pages/login/login.html`));
  },
  '/logon': async (req, res) => {
    const props = await readUsers();

    if(props[req.headers.user.toLowerCase()] == undefined) {
      res.statusCode = 401;
      res.end();
    } else if(req.headers.passwd !== props[req.headers.user.toLowerCase()].Senha) {
      res.statusCode = 402;
      res.end();
    } else if (req.headers.passwd == props[req.headers.user.toLowerCase()].Senha){
      const currentDate = new Date();
      const expiresDate = new Date(currentDate.getTime() + (8 * 60 * 60 * 1000)).toUTCString();

      res.setHeader('set-cookie', [
        `usertk=${req.headers.user}; expires=${expiresDate};Secure`
      ]);

      res.statusCode = 200;
      res.end();
    }
  },
  '/createuser': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end(FS.readFileSync(`./pages/createUser/createUser.html`));
  },
  '/checkUserForCreate': async (req, res) => {
    const props = await readUsers();

    if(props[req.headers.email.toLowerCase()] !== undefined) {
      res.statusCode = 401;
      res.end();
    } else {
      const novoUsuario = {
        Nome: req.headers.nome,
        Senha: req.headers.passwd,
        Ende: req.headers.address
      };

      props[req.headers.email] = novoUsuario;

      const newBase = await JSON.stringify(props);
      await newUser(newBase)

      res.statusCode = 200;
      res.end();
    }
  },
  '/getUserInfo': async (req, res) => {
    const props = await readUsers();

    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(props[req.headers.user]));
  },
  '/suvs': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end(FS.readFileSync(`./pages/vehicles/suvs.html`));
  },
  '/populares': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end(FS.readFileSync(`./pages/vehicles/populares.html`));
  },
  '/esportivos': (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end(FS.readFileSync(`./pages/vehicles/esportivos.html`));
  },
  '/getSuvs': async (req, res) => {
    const props = await readCars();
    
    const data = props.filter(info => info.model=='SUV');
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(data));
  },
  '/getPopulares': async (req, res) => {
    const props = await readCars();
    
    const data = props.filter(info => info.model=='POPULARES');
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.end(JSON.stringify(data));
  },
}

const server = http.createServer((req, res) => {
  try {
    console.log(req.url)
    paths[req.url](req,res);
  } catch (err) {
    try {
      res.statusCode = 200;
      res.setHeader('Content-Type', contentTypes[req.url.split('.')[1]]);
      res.end(FS.readFileSync(`.${req.url}`));
    } catch (err) {
    }
  }
});

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});