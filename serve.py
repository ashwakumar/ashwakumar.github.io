#!/usr/bin/env python3
"""
Simple HTTP server to serve the static website locally.
Run this script and visit http://localhost:8000 to view your website.
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
HOST = "localhost"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve files with proper MIME types"""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from (current directory)
        super().__init__(*args, directory=".", **kwargs)
    
    def end_headers(self):
        # Add some security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    # Change to the script's directory
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    
    # Check if index.html exists
    if not Path("index.html").exists():
        print("Error: index.html not found in the current directory!")
        print(f"Current directory: {os.getcwd()}")
        sys.exit(1)
    
    try:
        # Create the server
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            server_url = f"http://{HOST}:{PORT}"
            
            print("=" * 50)
            print("🚀 Website Server Starting...")
            print("=" * 50)
            print(f"📂 Serving directory: {os.getcwd()}")
            print(f"🌐 Server running at: {server_url}")
            print(f"📱 Open in browser: {server_url}")
            print("=" * 50)
            print("Press Ctrl+C to stop the server")
            print("=" * 50)
            
            # Optionally open browser automatically
            try:
                webbrowser.open(server_url)
                print("🔍 Opening website in your default browser...")
            except Exception as e:
                print(f"Could not open browser automatically: {e}")
            
            # Start serving
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48 or "Address already in use" in str(e):
            print(f"❌ Error: Port {PORT} is already in use!")
            print(f"Try using a different port or stop the process using port {PORT}")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()
