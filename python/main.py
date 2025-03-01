import sys
import os

# Add the ZerePy directory to sys.path
zerepy_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "ZerePy"))
if zerepy_path not in sys.path:
    sys.path.append(zerepy_path)

from ZerePy.src.server.client import ZerePyClient

client = ZerePyClient("http://localhost:8000")

# List available agents
agents = client.list_agents()

# Load an agent
client.load_agent("Tutor")

# List connections
connections = client.list_connections()

# Execute an action
# result=client.perform_action(
#     connection="tutor",
#     action="generate-lesson",
#     params=["Japanese","Beginner","[]"]
# )

print(result)
# # Start/stop agent loop
# client.start_agent()
# client.stop_agent()