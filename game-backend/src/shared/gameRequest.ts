export interface GameConnectionIdRequest {
  connectionId: string;
}

export interface GameEnterRequest extends GameConnectionIdRequest {
  type: "enter";
  memberId: string;
}

export interface GameLeaveRequest extends GameConnectionIdRequest {
  type: "leave";
}

export type GameRequest = GameEnterRequest | GameLeaveRequest;
