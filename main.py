import http.server
import socketserver

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = 'prebuilt/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Create an object of the above class
handler_object = MyHttpRequestHandler


my_server = socketserver.TCPServer(("0.0.0.0", 8888), handler_object)

# Star the server
my_server.serve_forever()