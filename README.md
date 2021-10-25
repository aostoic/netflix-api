# netflix-api

### Install

```bash
$ npm install
```

### Set environment variables

The `.env` configuration file is created for local executions only. The environment variables of the service must be added here, that is, values that can change over time.

```txt
PORT = '3030'
DB_URL= mongodb+srv://netflix-user:netflix1A1@cluster0.wcwko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

### Local Execution

```bash
$ npm run dev
```

Once the service is running, it will be accessible through `http://localhost:3030`.

Also in the repository `/postman` there is a postman file which will facilitate the use of this resource

### Server Execution

```bash
$ npm start
```

The base endpoint of the service is `/`, therefore the rest of the resources will be preceded by this string. The operations that this service has are:

```http
POST localhost:3030/films
GET localhost:3030/films/id
GET localhost:3030/films/randoms
GET localhost:3030/categories
```
