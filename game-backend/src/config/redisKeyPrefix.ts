const gameName = process.env.GAME_NAME ?? "mmo";

const redisKeyPrefix = {
  connectionIdAndGameId: `${gameName}/gameId/`,
  actor: {
    event: `${gameName}/actor-event/`,
    awaiter: `${gameName}/awaiter/`,
    lock: `${gameName}/lock/`,
    queue: `${gameName}/queue/`,
  },
};

export default redisKeyPrefix;
