import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
export default function handleDebugStart({ event, actorLockKeyPrefix, }: {
    event: APIGatewayProxyEventV2;
    actorLockKeyPrefix: string;
}): Promise<APIGatewayProxyResultV2>;
//# sourceMappingURL=handleDebugStart.d.ts.map