import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
export default function handleMessages<M>({ event, connectionIdAndGameIdKeyPrefix, actorQueueKeyPrefix, validateMessage, }: {
    event: APIGatewayProxyEvent;
    connectionIdAndGameIdKeyPrefix: string;
    actorQueueKeyPrefix: string;
    validateMessage: (maybe: M) => boolean;
}): Promise<APIGatewayProxyResult>;
//# sourceMappingURL=handleMessages.d.ts.map