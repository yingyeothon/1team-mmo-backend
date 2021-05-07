import BaseGameConnectionIdRequest from "./BaseGameConnectionIdRequest";

export default interface BaseGameLeaveRequest
  extends BaseGameConnectionIdRequest {
  type: "leave";
}
