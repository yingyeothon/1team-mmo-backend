import BaseGameObserver from "./BaseGameObserver";
import BaseGameUser from "./BaseGameUser";
export default interface BaseGameContext {
    readonly users: BaseGameUser[];
    readonly observers: BaseGameObserver[];
    readonly connectedUsers: {
        [connectionId: string]: BaseGameUser;
    };
}
//# sourceMappingURL=BaseGameContext.d.ts.map