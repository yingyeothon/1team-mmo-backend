import GameStartMember from "./GameStartMember";
export default interface GameMainArguments<M> {
    gameId: string;
    members: GameStartMember[];
    pollMessages: () => Promise<M[]>;
}
//# sourceMappingURL=GameMainArguments.d.ts.map