import { createServer } from 'http'
import { createContext } from './context'
import { schema } from './schema'
import { createYoga } from 'graphql-yoga'
import { useServer } from 'graphql-ws/lib/use/ws'
import ws from 'ws'

const yoga = createYoga({
  schema,
  context: (req) => {
    return createContext(req)
  },
  graphqlEndpoint: "/graphql",
  graphiql: {
    subscriptionsProtocol: 'WS',
  }
})

const httpServer = createServer(yoga)

const paths = '/subscriptions'
const wsServer = new ws.WebSocketServer({
  server: httpServer,
  path: paths,
});

useServer(
  {
    schema: schema,
    context: createContext,
    connectionInitWaitTimeout: 10000,
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onConnect: async (ctx) => { },
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };
      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
    onDisconnect: (ctx, code, reason) => {

    },
  },
  wsServer,
  //10_000
);



httpServer.listen(4000, async () => {
  // setInterval(logout, 4000)
  console.log("server started")
});