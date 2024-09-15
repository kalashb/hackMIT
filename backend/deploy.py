import os
port = int(os.getenv('PORT', 8080))  # Default to 8080 if PORT is not set
app = web.Application()
# Add your routes and handlers
web.run_app(app, port=port)