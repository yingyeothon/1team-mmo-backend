import BaseGameContext from "../../gamebase/models/BaseGameContext";
import BaseGameEnterRequest from "../../gamebase/requests/BaseGameEnterRequest";
import broadcast from "../../gamebase/network/broadcast";

export default async function processEnter({
  context,
  message: { connectionId, memberId },
}: {
  context: BaseGameContext;
  message: BaseGameEnterRequest;
}): Promise<void> {
  const newbie = context.users.find((u) => u.memberId === memberId);
  const observer = context.observers.find((o) => o.memberId === memberId);
  if (observer) {
    observer.connectionId = connectionId;
  } else if (newbie) {
    newbie.connectionId = connectionId;
    newbie.load = false;

    context.connectedUsers[connectionId] = newbie;
    await broadcast(Object.keys(context.connectedUsers), {
      type: "enter",
      payload: { memberId },
    });
  }
}
