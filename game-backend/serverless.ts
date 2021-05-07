import type { Serverless } from "serverless/aws";
import functions from "./src/lambda/functions";

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
    timeout: 3,
    memorySize: 256,
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
  functions,
};

module.exports = serverlessConfiguration;
