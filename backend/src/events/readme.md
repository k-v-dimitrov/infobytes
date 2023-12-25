APP Events:
Events that are intended to be handled by the socket gateway and dispatched to the app

INTERNAL Events:
Events that are intended to be handled by listeners in events/listeners

Adding new APP event:

1. Define new event in index.ts (APP)
2. Create or reuse event payload in ./payloads
3. Emit the new event
4. Define handler in sockets.service

Adding new INTERNAL event:

1. Define new event in index.ts (INTERNAL)
2. Create or reuse event payload in ./payloads
3. Emit the new event
4. Define handler ./listeners
5. Add it to events.module.ts
