import BaseGameContext from "../../gamebase/models/BaseGameContext";
import BaseGameRequest from "../../gamebase/requests/BaseGameRequest";
import processEnter from "./processEnter";
import processLeave from "./processLeave";

export default async function processEnterLeave({
  context,
  message,
}: {
  context: BaseGameContext;
  message: BaseGameRequest;
}): Promise<void> {
  switch (message.type) {
    case "enter":
      return await processEnter({ context, message });
    case "leave":
      return processLeave({ context, message });
  }
}
