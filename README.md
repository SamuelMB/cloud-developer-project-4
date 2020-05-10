# Serverless TODO - Udacity Project 4

This is a serverless application developed for the Udacity Cloud Developer Nanodegree Program.

## Getting Started

### Tools

- [Nodej.s 12](https://nodejs.org/dist/v12.16.3/node-v12.16.3.pkg)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)

### Deployment

#### Backend

Go to backend folder:
```
cd $PROJECT_HOME/backend
```

Execute the serverless cli deployment command:

```
sls deploy -v --stage dev --region us-east-1
```

#### Frontend

Go to client folder:
```
cd $PROJECT_HOME/frontend
```

Install dependencies:
```
npm install
```

Execute the npm script:
```
npm run start
``` 

