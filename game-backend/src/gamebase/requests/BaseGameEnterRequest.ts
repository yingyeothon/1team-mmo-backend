import BaseGameConnectionIdRequest from "./BaseGameConnectionIdRequest";

export default interface BaseGameEnterRequest
  extends BaseGameConnectionIdRequest {
  type: "enter";
  memberId: string;
}
