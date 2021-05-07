import { BaseGameContext, BaseGameEnterRequest } from "@yingyeothon/lambda-gamebase";
export default function processEnter({ context, message: { connectionId, memberId }, }: {
    context: BaseGameContext;
    message: BaseGameEnterRequest;
}): Promise<void>;
//# sourceMappingURL=processEnter.d.ts.map