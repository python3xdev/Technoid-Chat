import socket
import threading
from datetime import datetime

HOST = "127.0.0.1"
PORT = 65353

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))

server.listen()

clients = []
nicknames = []


def broadcast(message):
    for client in clients:
        client.send(message)


def handle(client):
    while True:
        try:
            message = client.recv(1024)
            if message.decode('utf-8') == "*CLIENT_LEFT_THE_CHAT*":
                indx = clients.index(client)
                clients.remove(client)
                client.close()
                nickname = nicknames[indx]
                nicknames.remove(nickname)
                print(f"{nickname.decode('utf-8')} has left the chat.")
                msg_date = datetime.now().strftime("%H:%M | %d %B, %Y")
                broadcast(f"SYSTEM: {nickname.decode('utf-8')} has left the chat.*MSG&DATE_DIVIDER*{msg_date}".encode("utf-8"))
                break
            print(f"{nicknames[clients.index(client)].decode('utf-8')}: {message.decode('utf-8')}")
            msg_date = datetime.now().strftime("%H:%M | %d %B, %Y")
            broadcast(f"{nicknames[clients.index(client)].decode('utf-8')}*USER&MSG_DIVIDER*{message.decode('utf-8')}*MSG&DATE_DIVIDER*{msg_date}".encode("utf-8"))
        except:
            indx = clients.index(client)
            clients.remove(client)
            client.close()
            nickname = nicknames[indx]
            nicknames.remove(nickname)
            break


def receive():
    while True:
        client, address = server.accept()
        print(f"Connected with {str(address)}.")

        client.send("NICK_REQ_F_USER".encode('utf-8'))
        nickname = client.recv(1024)

        if nickname.decode('utf-8') != "*CLIENT_LEFT_THE_CHAT*":
            nicknames.append(nickname)
            clients.append(client)
            print(f"Nickname of the new client is: {nickname.decode('utf-8')}.")
            msg_date = datetime.now().strftime("%H:%M | %d %B, %Y")
            broadcast(f"SYSTEM: {nickname.decode('utf-8')} has joined the chat.*MSG&DATE_DIVIDER*{msg_date}".encode('utf-8'))
            client.send(f"SYSTEM: You have successfully connected to the server.*MSG&DATE_DIVIDER*{msg_date}".encode('utf-8'))

            thread = threading.Thread(target=handle, args=(client,))
            thread.start()


print("Server running...")
receive()
