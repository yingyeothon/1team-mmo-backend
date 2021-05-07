import type { Serverless } from "serverless/aws";

const serviceName = `mmo-backend${process.env.RELEASE_POSTFIX ?? ""}`;
const stage = process.env.STAGE ?? "dev";
const gameActorLambdaName = `${serviceName}-${stage}-game`;

const serverlessConfiguration: Serverless = {
  service: serviceName,
  plugins: [
    "serverless-webpack",
    "serverless-prune-plugin",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    // TODO: I really want to use "nodejs12.x" but "serverless-offline" doesn't support.
    runtime: "nodejs12.x",
    region: "ap-northeast-2",
    stage,
    lambdaHashingVersion: 20201221,
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      STAGE: stage,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      WS_ENDPOINT: process.env.WS_ENDPOINT,
      GAME_ACTOR_LAMBDA_NAME: gameActorLambdaName,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: [
              {
                "Fn::Join": [
                  ":",
                  [
                    "arn:aws:lambda",
                    {
                      Ref: "AWS::Region",
                    },
                    {
                      Ref: "AWS::AccountId",
                    },
                    "function",
                    gameActorLambdaName,
                  ],
                ],
              },
            ],
          },
        ],
      },
    },
  },
  custom: {
    prune: {
      automatic: true,
      number: 7,
    },
  },
  package: {
    individually: true,
  },
  functions: {
    connect: {
      handler: "src/proxy/connect.handle",
      timeout: 3,
      memorySize: 256,
      events: [
        {
          websocket: {
            route: "$connect",
          },
        },
      ],
    },
    disconnect: {
      handler: "src/proxy/disconnect.handle",
      timeout: 3,
      memorySize: 256,
      events: [
        {
          websocket: {
            route: "$disconnect",
          },
        },
      ],
    },
    message: {
      handler: "src/proxy/message.handle",
      timeout: 3,
      memorySize: 256,
      events: [
        {
          websocket: {
            route: "$default",
          },
        },
      ],
    },
    game: {
      handler: "src/game/actor.handle",
      timeout: 900,
      memorySize: 1024,
    },
    debugStart: {
      handler: "src/proxy/debugStart.handle",
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
  },
};

module.exports = serverlessConfiguration;
