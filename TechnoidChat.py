import socket
import threading
import eel
from random import randint

HOST = "127.0.0.1"
PORT = 65353


class Client:
    def __init__(self, host, port):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((host, port))

        self.nickname = None

        self.gui_done = False
        self.running = True

    def start_listening(self):
        receive_thread = threading.Thread(target=self.receive)
        receive_thread.start()

    def set_gui_done(self):
        self.gui_done = True

    def write(self, msg):
        self.sock.send(msg.encode(encoding='UTF-8'))

    def stop(self):
        self.running = False
        self.sock.send("*CLIENT_LEFT_THE_CHAT*".encode(encoding="UTF-8"))
        self.sock.close()
        exit(0)

    def receive(self):
        while self.running:
            try:
                message = self.sock.recv(1024).decode("utf-8")
                if message == "NICK_REQ_F_USER":
                    self.sock.send(self.nickname.encode(encoding='UTF-8'))
                else:
                    eel.display_msg(message)
            except ConnectionAbortedError:
                break
            except:
                print("Error")
                self.sock.close()
                break


client = Client(HOST, PORT)

eel.init("web")


@eel.expose
def set_username(nick):
    client.nickname = nick
    client.start_listening()


@eel.expose
def write_msg(msg):
    client.write(msg)


@eel.expose
def client_left_the_chat():
    client.stop()


client.set_gui_done()
eel.start("index.html", port=randint(1500, 2000))  # using a random port number, so you can run multiple instances of the program
# Important: is it not a good idea to leave this kind of code in a finished product, this is just a 'quick fix' for testing.