#!/usr/bin/env python3
"""
Simple live reload server for web development.
Watches for file changes and auto-refreshes the browser.
"""

import http.server
import socketserver
import os
import time
import threading
import webbrowser
from pathlib import Path

class FileWatcher:
    def __init__(self, server, directory='.'):
        self.server = server
        self.directory = directory
        self.file_times = {}
        self.running = True
        
    def start_watching(self):
        """Start watching for file changes in a separate thread"""
        def watch():
            while self.running:
                try:
                    self.check_for_changes()
                    time.sleep(1)  # Check every second
                except Exception as e:
                    print(f"Error watching files: {e}")
                    time.sleep(1)
        
        watch_thread = threading.Thread(target=watch, daemon=True)
        watch_thread.start()
    
    def check_for_changes(self):
        """Check if any relevant files have been modified"""
        for root, dirs, files in os.walk(self.directory):
            for file in files:
                if any(file.endswith(ext) for ext in ['.html', '.css', '.js', '.png', '.jpg', '.svg']):
                    file_path = os.path.join(root, file)
                    try:
                        mtime = os.path.getmtime(file_path)
                        
                        if file_path in self.file_times:
                            if mtime > self.file_times[file_path]:
                                print(f"File changed: {file_path}")
                                self.server.reload_trigger = True
                        
                        self.file_times[file_path] = mtime
                    except OSError:
                        pass  # File might have been deleted
    
    def stop(self):
        self.running = False

class LiveReloadHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        # Add live reload script to HTML files
        if self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # Handle live reload endpoint
        if self.path == '/livereload':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            # Check if reload is needed
            if hasattr(self.server, 'reload_trigger') and self.server.reload_trigger:
                self.wfile.write(b'reload')
                self.server.reload_trigger = False
            else:
                self.wfile.write(b'ok')
            return
        
        # Inject live reload script into HTML files
        if self.path.endswith('.html') or self.path == '/':
            try:
                # Get the file path
                if self.path == '/':
                    file_path = 'index.html'
                else:
                    file_path = self.path.lstrip('/')
                
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Inject live reload script before closing body tag
                    live_reload_script = '''
<script>
(function() {
    function checkForReload() {
        fetch('/livereload')
            .then(response => response.text())
            .then(data => {
                if (data === 'reload') {
                    console.log('File changed, reloading page...');
                    window.location.reload();
                }
            })
            .catch(err => console.log('Live reload check failed:', err));
    }
    
    // Check for changes every 1 second
    setInterval(checkForReload, 1000);
    console.log('Live reload active');
})();
</script>
</body>'''
                    
                    # Replace closing body tag with script + closing body tag
                    if '</body>' in content:
                        content = content.replace('</body>', live_reload_script)
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.send_header('Content-length', str(len(content.encode('utf-8'))))
                    self.end_headers()
                    self.wfile.write(content.encode('utf-8'))
                    return
            except Exception as e:
                print(f"Error serving HTML file: {e}")
        
        # For all other files, use default behavior
        super().do_GET()

class LiveReloadServer:
    def __init__(self, port=8080, directory='.'):
        self.port = port
        self.directory = directory
        self.reload_trigger = False
        
    def start(self):
        # Change to the specified directory
        os.chdir(self.directory)
        
        # Set up file watcher
        file_watcher = FileWatcher(self, '.')
        file_watcher.start_watching()
        
        try:
            # Start HTTP server
            with socketserver.TCPServer(("", self.port), LiveReloadHTTPRequestHandler) as httpd:
                httpd.reload_trigger = False
                print(f"Live reload server running at http://localhost:{self.port}")
                print("Watching for file changes...")
                print("Press Ctrl+C to stop the server")
                
                # Share the reload trigger with the server
                httpd.reload_trigger = self.reload_trigger
                
                # Open browser
                webbrowser.open(f'http://localhost:{self.port}')
                
                httpd.serve_forever()
                
        except KeyboardInterrupt:
            print("\nShutting down live reload server...")
            file_watcher.stop()

if __name__ == '__main__':
    server = LiveReloadServer(port=8080, directory='.')
    server.start()
