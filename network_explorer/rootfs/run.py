from flask import Flask, request, Response, send_from_directory
import requests

app = Flask(__name__)
HOST="0.0.0.0"
PORT=8099

def _proxy(*args, **kwargs):
    print(request.url, flush=True)
    resp = requests.request(
        method=request.method,
        url=request.url.replace(request.host_url, 'http://127.0.0.1/'),
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        allow_redirects=False)

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    return response

@app.route('/admin')
def httpserver():
    return send_from_directory("/html", "index.html")

@app.route('/')
def index():
    return _proxy()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def default(path):
    return _proxy()

if __name__ == "__main__":
    app.run(host=HOST, port=PORT)
