import uvicorn
from .app import create_app
from fastapi.middleware.cors import CORSMiddleware

def start_server(host: str = "0.0.0.0", port: int = 8000):
    """Start the ZerePy server"""
    app = create_app()
    app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

    uvicorn.run(app, host=host, port=port)