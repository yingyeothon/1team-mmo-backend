export interface RespondResult {
    [connectionId: string]: boolean;
}
export default function broadcast<T extends {
    type: string;
}>(connectionIds: string[], response: T): Promise<RespondResult>;
//# sourceMappingURL=broadcast.d.ts.map