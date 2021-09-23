# socket.io cat

Tired of dealing with Javascript and Socket.IO? This netcat-like utility is for you!

Example session with testserver-chat (copied from https://github.com/socketio/socket.io/blob/master/examples/chat/):

```
> node test.js http://localhost:3000
connect
connect
emit    add user        "hi"
event   login   {"numUsers":2}
> emit  new message     "message"
> emit  new message     "data"
event   typing  {"username":"halo"}
event   new message     {"username":"halo","message":"ht"}
event   stop typing     {"username":"halo"}
```
