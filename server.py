import http.server
import os
import sys
import mimetypes

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

DIR_TO_HTML = {
    '/specials': '/specials.html',
    '/specials/': '/specials.html',
    '/wellness': '/wellness.html',
    '/wellness/': '/wellness.html',
    '/articles': '/articles.html',
    '/articles/': '/articles.html',
    '/tools': '/tools/breast-volume-calculator',
    '/tools/': '/tools/breast-volume-calculator',
    '/article': '/articles.html',
    '/article/': '/articles.html',
}

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.path.split('?')[0]

        if path in DIR_TO_HTML:
            self.path = DIR_TO_HTML[path]
            path = self.path.split('?')[0]

        if not os.path.splitext(path)[1]:
            test_path = path.rstrip('/') + '.html'
            full_test = os.path.join(DIRECTORY, test_path.lstrip('/'))
            if os.path.isfile(full_test):
                self.path = test_path

        if self.path.endswith('/') and not os.path.splitext(self.path)[1]:
            test_path = self.path.split('?')[0]
            index_path = test_path + 'index.html'
            full_test = os.path.join(DIRECTORY, index_path.lstrip('/'))
            if os.path.isfile(full_test):
                self.path = index_path

        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            notfound = os.path.join(DIRECTORY, '404.html')
            if os.path.isfile(notfound):
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                with open(notfound, 'rb') as f:
                    self.wfile.write(f.read())
                return
        super().send_error(code, message, explain)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    print(f'Starting dev server at http://localhost:{PORT}')
    print(f'Serving files from: {DIRECTORY}')
    print('Press Ctrl+C to stop')
    print()

    server = http.server.HTTPServer(('0.0.0.0', PORT), CleanURLHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
        server.server_close()