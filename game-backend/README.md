# Game backend for MMo

## Test locally

First, run Redis in local.

```bash
docker run -it -p 6379:6379 redis
```

And start this server locally.

```bash
yarn start
```

Start a new game using `debugStart` API.

```bash
curl -XPOST "http://localhost:3000/debug" \
  -H "Content-Type: application/json" \
  -d '{"gameId":"abc", "members": [{"memberId":"lacti", "name":"lacti", "email":"lacti@email.com"}]}'
```

Connect to that game with `x-game-id` and `x-member-id`.

```bash
yarn wscat -c "http://localhost:3001?x-game-id=abc&x-member-id=lacti
```
