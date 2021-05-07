import BaseGameEnterRequest from "./BaseGameEnterRequest";
import BaseGameLeaveRequest from "./BaseGameLeaveRequest";

type BaseGameRequest = BaseGameEnterRequest | BaseGameLeaveRequest;

export default BaseGameRequest;
