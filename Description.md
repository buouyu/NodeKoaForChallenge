# 挑战赛题目说明

模拟并开发微信朋友圈接口，提供高性能和高可靠的内容服务。

参赛者需要通过技术手段实现一套`HTTP`服务，并提供如下接口：

```
GET     /ready
POST    /initialize
POST    /users
POST    /users/{userId}/relations
POST    /users/{userId}/moments
DELETE  /users/{userId}/relations/{friendId}
DELETE 	/users/{userId}/moments/{momentId}
GET     /users/{userId}
GET     /users/{userId}/streams
```

参赛应用程序使用何种数据库、中间件等均不限制，唯一要求就是实现上述接口并正常响应。

接口的详细说明如下：

## 接口

若无特别说明，POST 和 DELETE 接口都应该返回`200 OK`状态码，非`200`状态码将被视为接口错误。

为了测试的简单性，这里的状态码并不完全是遵循`Restful`规范的，特别是`POST`在标准环境下应该返回`201 Created`。我们建议在常规的开发中还是尽量遵循`Restful`的规范，但是在本次挑战赛中，请返回`200 OK`。

### 就绪接口

```
verb: GET
path: /ready
response:
  {
    "data": "ok"
  }
```

该接口简单返回`ok`字符串，以便测评时知道程序已启动。参赛者不应该在此接口做任何的事情。

### 预热接口

```
verb: POST
path: /initialize
```

考虑到一些后端语言存在`JIT`机制，为了测试的公平性，我们允许您自主预热一些接口，使之能快速`JIT`生成优化代码。

此接口超时时间为**5 秒**，超时后测试程序将自动终止连接并展开后续测试。

请不要尝试在此接口做一些**奇怪**的事情，例如将数据从数据库载入到内存/缓存，如果参赛者在此接口做了一些有悖公平之事，竞赛组有权力将其判定为作弊，并取消参赛资格。

### 创建单一用户接口

```
verb: POST
path: /users

request:
  {
    "userId": "string",
    "name": "string"
  }
limits:
  userId: 50 chars
  name: 50 chars
```

此接口创建单一用户接口

### 添加单一用户好友接口

```
verb: POST
path: /users/{userId}/relations

request:
  {
    "friendId": "friend id string"
  }
limits:
  friendId: 50 chars
```

此接口添加单一用户好友

路径中`{userId}`是需要添加对方为好友的主体用户

`body`中的`friendId`是需要被添加的用户的`userId`，参赛者无需过多的关注，只需要按逻辑处理关系即可

**需要注意的是，A 用户添加 B 用户后，并不意味着 A 与 B 即刻成为好友，参赛者需要处理的是，只有 A 添加了 B，并且 B 添加了 A，才可认为 A 与 B 成为好友，进而互相查看对方朋友圈**

### 发布单一用户朋友圈内容

```
verb: POST
path: /users/{userId}/moments

request:
  {
    "momentId": "string",
    "content": "some content string"
  }
limits:
  momentId: 50 chars
  content: 2000 chars
```

此接口发布单一用户朋友圈内容

路径中`{userId}`是需发布朋友圈内容的主体用户

**请参赛者注意时序性，测试程序将通过一些算法，保证测试数据按照一定的顺序请求参赛程序，这意味着参赛者需要严格处理不同用户之间看到朋友圈内容的顺序**

### 删除单一用户好友

```
verb: DELETE
path: /users/{userId}/relations/{friendId}
```

此接口删除单一用户好友

路径中`{userId}`是需要删除好友的主体用户，路径中`{friendId}`是需要被删除的好友的 id

此接口的逻辑与添加单一用户好友接口互逆，参赛者除了需要处理删除后友后其朋友圈内容的处理，同时需要保留被删者的好友请求。这意味着，A 和 B 互为好友，当 A 删除 B，然后 A 再添加 B，那么 A 与 B 仍旧互为好友

### 删除单一用户朋友圈内容

```
verb: DELETE
path: /users/{userId}/moments/{momentId}
```

此接口删除单一用户朋友圈内容

路径中`{userId}`是需要删除朋友圈内容的主体用户，路径中`{momentId}`是需要被删除的朋友圈内容的 id

### 查询单一用户信息

```
verb: GET
path: /users/{userId}

response:
  {
    "message": "error message if occur",
    "data": {
      "userId": "userId",
      "name": "name"
    }
  }
```

此接口查询单一用户信息

路径中`{userId}`是需要被查询的用户 id

### 查询单一用户朋友圈内容流(单页内容不超过 50，lastId 为分页控制)

```
verb: GET
path: /users/{userId}/streams

querystrings:
  lastId: string

response:
  {
    "message": "error message if occur",
    "data": [
      {
        "momentId": "moment id",
        "momentUserId": "which user published",
        "content": "content"
      }
    ]
  }
```

此接口查询单一用户信息

路径中`{userId}`是需要被查询的用户 id

此接口为分页接口，单页返回**50**条数据，数据过多或过少都会被测评程序视为数据错误

参赛者需要留意`lastId`的处理，`lastId`将以查询字符串的形式传递给服务端，它的值是当前数据页的最后一条内容的`momentId`，如果为空的话，参赛程序需要返回首页数据
