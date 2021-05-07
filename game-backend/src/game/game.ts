import {
  GameConnectionIdRequest,
  GameEnterRequest,
  GameRequest,
} from "../shared/gameRequest";

import { ConsoleLogger } from "@yingyeothon/logger";
import { GameMember } from "../shared/actorRequest";
import GameObserver from "./models/GameObserver";
import GameStage from "./models/GameStage";
import GameUser from "./models/GameUser";
import Ticker from "./support/Ticker";
import broadcast from "./support/broadcast";
import dropConnection from "./support/dropConnection";
import gameRunningSeconds from "./env/gameRunningSeconds";
import gameWaitSeconds from "./env/gameWaitSeconds";
import sleep from "./support/sleep";

const logger = new ConsoleLogger(
  process.env.STAGE === "production" ? `info` : `debug`
);

const loopInterval = 0;

export default class Game {
  private readonly users: GameUser[];
  private readonly observers: GameObserver[];
  private readonly connectedUsers: { [connectionId: string]: GameUser } = {};

  private lastMillis: number;
  private ticker: Ticker | null;

  constructor(
    private readonly gameId: string,
    members: GameMember[],
    private readonly pollRequests: () => Promise<GameRequest[]>
  ) {
    // Setup game context from members.
    this.users = members
      .filter((member) => !member.observer)
      .map(
        (member): GameUser => ({
          connectionId: "",
          load: false,
          memberId: member.memberId,
        })
      );
    this.observers = members
      .filter((member) => member.observer)
      .map(
        (member): GameObserver => ({
          memberId: member.memberId,
          connectionId: "",
        })
      );
  }

  public run = async () => {
    try {
      await this.stageWait();
      if (Object.keys(this.connectedUsers).length > 0) {
        await this.stageRunning();
      }
    } catch (error) {
      logger.error(`Error in game logic`, error);
    }
    await this.stageEnd();
  };

  private stageWait = async () => {
    logger.info(`Game WAIT-stage`, this.gameId, this.users);

    this.ticker = new Ticker(GameStage.Wait, gameWaitSeconds * 1000);
    while (this.ticker.isAlive()) {
      const requests = await this.pollRequests();
      await this.processEnterLeaveLoad(requests);

      if (Object.keys(this.connectedUsers).length === this.users.length) {
        break;
      }

      await this.ticker.checkAgeChanged(this.broadcastStage);
      await sleep(loopInterval);
    }
  };

  private stageRunning = async () => {
    logger.info(`Game RUNNING-stage`, this.gameId, this.users);

    this.lastMillis = Date.now();
    this.ticker = new Ticker(GameStage.Running, gameRunningSeconds * 1000);
    while (this.ticker.isAlive()) {
      const requests = await this.pollRequests();
      await this.processEnterLeaveLoad(requests);

      await this.processChanges(requests);
      await this.update();

      await this.ticker.checkAgeChanged(this.broadcastStage);
      await sleep(loopInterval);

      // if (AWESOME_EXIT_CONDITION) {
      //   break;
      // }
    }
  };

  private stageEnd = async () => {
    logger.info(`Game END-stage`, this.gameId);
    await Promise.all(Object.keys(this.connectedUsers).map(dropConnection));
  };

  private processEnterLeaveLoad = async (requests: GameRequest[]) => {
    for (const request of requests) {
      try {
        switch (request.type) {
          case "enter":
            await this.onEnter(request);
            break;
          case "leave":
            this.onLeave(request);
            break;
        }
      } catch (error) {
        logger.error(`Error in request`, request, error);
      }
    }
  };

  private processChanges = async (requests: GameRequest[]) => {
    const promises: Promise<void>[] = [];
    for (const request of requests) {
      if (!this.isValidUser(request)) {
        continue;
      }
      const user = this.connectedUsers[request.connectionId];
      try {
        // TODO: Do something.
        // if (maybe !== undefined) {
        //   promises.push(maybe);
        // }
      } catch (error) {
        logger.error(`Error in processing change`, request, error);
      }
    }
    if (promises.length === 0) {
      return;
    }
    try {
      await Promise.all(promises);
    } catch (error) {
      logger.error(`Error in awaiting updates`, error);
    }
  };

  private update = async () => {
    const now = Date.now();
    const dt = (now - this.lastMillis) / 1000;
    this.lastMillis = now;

    return this.updateWithDt(dt);
  };

  private updateWithDt = async (dt: number) => {
    // TODO: Do something.
  };

  private isValidUser = ({ connectionId }: GameConnectionIdRequest) =>
    this.connectedUsers[connectionId] !== undefined;

  private onEnter = ({ connectionId, memberId }: GameEnterRequest) => {
    const newbie = this.users.find((u) => u.memberId === memberId);
    const observer = this.observers.find((o) => o.memberId === memberId);
    if (observer) {
      observer.connectionId = connectionId;
    } else if (newbie) {
      newbie.connectionId = connectionId;
      newbie.load = false;

      this.connectedUsers[connectionId] = newbie;
      // TODO: Make it awesome.
      return broadcast(Object.keys(this.connectedUsers), {
        type: "enter",
        payload: { memberId },
      });
    }
  };

  private onLeave = ({ connectionId }: GameConnectionIdRequest) => {
    const leaver = this.connectedUsers[connectionId];
    const observer = this.observers.find(
      (o) => o.connectionId === connectionId
    );

    if (observer) {
      observer.connectionId = "";
    } else if (leaver) {
      leaver.connectionId = "";
      leaver.load = false;
      delete this.connectedUsers[connectionId];

      // No reset for leaver because they can reconnect.
    }
  };

  private broadcastStage = (stage: GameStage, age: number) => {
    // TODO: Make it awesome.
    return broadcast(Object.keys(this.connectedUsers), {
      type: "stage",
      payload: { stage, age },
    });
  };
}
