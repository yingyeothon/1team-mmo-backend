import BaseGameConnectionIdRequest from "../../gamebase/requests/BaseGameConnectionIdRequest";
import BaseGameContext from "../../gamebase/models/BaseGameContext";

export default function processLeave({
  context,
  message: { connectionId },
}: {
  context: BaseGameContext;
  message: BaseGameConnectionIdRequest;
}) {
  const leaver = context.connectedUsers[connectionId];
  const observer = context.observers.find(
    (o) => o.connectionId === connectionId
  );

  if (observer) {
    observer.connectionId = "";
  } else if (leaver) {
    leaver.connectionId = "";
    leaver.load = false;
    delete context.connectedUsers[connectionId];

    // No reset for leaver because they can reconnect.
  }
}
