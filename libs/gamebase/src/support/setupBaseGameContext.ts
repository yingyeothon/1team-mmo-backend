import BaseGameContext from "../models/BaseGameContext";
import BaseGameObserver from "../models/BaseGameObserver";
import BaseGameUser from "../models/BaseGameUser";
import GameStartMember from "../models/GameStartMember";

export default function setupBaseGameContext(
  members: GameStartMember[]
): BaseGameContext {
  const users = members
    .filter((member) => !member.observer)
    .map(
      (member): BaseGameUser => ({
        connectionId: "",
        load: false,
        memberId: member.memberId,
      })
    );
  const observers = members
    .filter((member) => member.observer)
    .map(
      (member): BaseGameObserver => ({
        memberId: member.memberId,
        connectionId: "",
      })
    );
  return { users, observers, connectedUsers: {} };
}
