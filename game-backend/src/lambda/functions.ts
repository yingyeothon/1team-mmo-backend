import type { AwsFunctionHandler } from "serverless/aws";

function handler(name: string): string {
  return `src/lambda/${name}.handle`;
}

const functions: { [name: string]: AwsFunctionHandler } = {
  connect: {
    handler: handler("connect"),
    events: [
      {
        websocket: {
          route: "$connect",
        },
      },
    ],
  },
  disconnect: {
    handler: handler("disconnect"),
    events: [
      {
        websocket: {
          route: "$disconnect",
        },
      },
    ],
  },
  message: {
    handler: handler("message"),
    events: [
      {
        websocket: {
          route: "$default",
        },
      },
    ],
  },
  game: {
    handler: handler("actor"),
    timeout: 900,
    memorySize: 1024,
  },
  debugStart: {
    handler: handler("debugStart"),
    timeout: 6,
    memorySize: 256,
    events: [
      {
        httpApi: {
          method: "POST",
          path: "/debug",
        },
      },
    ],
  },
};

export default functions;
