import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export default function handleConnect({ event, connectionIdAndGameIdKeyPrefix, actorEventKeyPrefix, actorQueueKeyPrefix, }: {
    event: APIGatewayProxyEvent;
    connectionIdAndGameIdKeyPrefix: string;
    actorEventKeyPrefix: string;
    actorQueueKeyPrefix: string;
}): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=handleConnect.d.ts.map