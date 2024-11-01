import asyncio
import websockets
import json

active_chats = {}

async def handler(websocket, path):
    print(f"Novo cliente conectado em {path}")
    
    if path not in active_chats:
        active_chats[path] = set()
    active_chats[path].add(websocket)

    try:
        async for message in websocket:
            data = json.loads(message)
            chat = data['chat']
            msg = data['message']
            
            print(f"Mensagem recebida: {msg} no chat: {path}")
            
            for client in active_chats[path]:
                if client != websocket:
                    await client.send(json.dumps({"chat": path, "message": msg}))


    except websockets.exceptions.ConnectionClosed:
        print(f"Conexão fechada no chat: {path}")
    finally:
        active_chats[path].remove(websocket)
        if not active_chats[path]:
            del active_chats[path]

async def main():
    server = await websockets.serve(handler, "localhost", 8888)
    print("Servidor WebSocket rodando em ws://localhost:8888")
    await server.wait_closed()

asyncio.run(main())