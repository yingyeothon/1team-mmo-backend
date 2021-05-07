import GameStartMember from "../../models/GameStartMember";

export default interface GameActorStartEvent {
  gameId: string;
  members: GameStartMember[];
  callbackUrl?: string;
}
