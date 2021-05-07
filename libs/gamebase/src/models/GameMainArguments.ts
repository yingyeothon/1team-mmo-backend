import GameStartMember from "./GameStartMember";

export default interface GameMainArguments<M> {
  gameId: string;
  members: GameStartMember[];
  pollMessages: () => Promise<M[]>;
}
