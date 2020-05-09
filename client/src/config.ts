// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 's60ix4ebe3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'auth-todo.auth0.com', // Auth0 domain
  clientId: 'FKt8yt0YpZspt0G7rCwjUMsSWAw4vthm', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
