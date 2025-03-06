from fastapi import FastAPI, HTTPException, BackgroundTasks

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
import threading
from pathlib import Path
from src.action_handler import execute_action
from src.cli import ZerePyCLI


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server/app")

class ActionRequest(BaseModel):
    """Request model for agent actions"""
    connection: str
    action: str
    params: Optional[List[str]] = []

class ConfigureRequest(BaseModel):
    """Request model for configuring connections"""
    connection: str
    params: Optional[Dict[str, Any]] = {}

class ServerState:
    """Simple state management for the server"""
    def __init__(self):
        self.cli = ZerePyCLI()
        self.agent_running = False
        self.agent_task = None
        self._stop_event = threading.Event()

    def _run_agent_loop(self):
        """Run agent loop in a separate thread"""
        try:
            log_once = False
            while not self._stop_event.is_set():
                if self.cli.agent:
                    try:
                        if not log_once:
                            logger.info("Loop logic not implemented")
                            log_once = True

                    except Exception as e:
                        logger.error(f"Error in agent action: {e}")
                        if self._stop_event.wait(timeout=30):
                            break
        except Exception as e:
            logger.error(f"Error in agent loop thread: {e}")
        finally:
            self.agent_running = False
            logger.info("Agent loop stopped")

    async def start_agent_loop(self):
        """Start the agent loop in background thread"""
        if not self.cli.agent:
            raise ValueError("No agent loaded")
        
        if self.agent_running:
            raise ValueError("Agent already running")

        self.agent_running = True
        self._stop_event.clear()
        self.agent_task = threading.Thread(target=self._run_agent_loop)
        self.agent_task.start()

    async def stop_agent_loop(self):
        """Stop the agent loop"""
        if self.agent_running:
            self._stop_event.set()
            if self.agent_task:
                self.agent_task.join(timeout=5)
            self.agent_running = False

class ZerePyServer:
    def __init__(self):
        self.app = FastAPI(title="ZerePy Server")
        self.state = ServerState()
        self.setup_routes()

    def setup_routes(self):
        @self.app.get("/")
        async def root():
            """Server status endpoint"""
            return {
                "status": "running",
                "agent": self.state.cli.agent.name if self.state.cli.agent else None,
                "agent_running": self.state.agent_running
            }

        @self.app.get("/agents")
        async def list_agents():
            """List available agents"""
            try:
                agents = []
                agents_dir = Path("agents")
                if agents_dir.exists():
                    for agent_file in agents_dir.glob("*.json"):
                        if agent_file.stem != "general":
                            agents.append(agent_file.stem)
                return {"agents": agents}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/agents/{name}/load")
        async def load_agent(name: str):
            """Load a specific agent"""
            try:
                self.state.cli._load_agent_from_file(name)
                return {
                    "status": "success",
                    "agent": name
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.get("/connections")
        async def list_connections():
            """List all available connections"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            
            try:
                connections = {}
                for name, conn in self.state.cli.agent.connection_manager.connections.items():
                    connections[name] = {
                        "configured": conn.is_configured(),
                        "is_llm_provider": conn.is_llm_provider
                    }
                return {"connections": connections}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/{name}/generate-intent")
        async def agent_action(action_request: ActionRequest,name:str):
            """Execute a single agent action"""
            self.state.cli._load_agent_from_file(name)
            
            
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            print(action_request.action)
            
            try:
                # result = await asyncio.to_thread(
                #     self.state.cli.agent.perform_action,
                #     connection=action_request.connection,
                #     action=action_request.action,
                #     params=action_request.params
                # )
                args={
                "prompt":action_request.params[0]
                }

                result=execute_action(self.state.cli.agent,'generate-intent',**args)
                print(result)
            
                return {"status": "success", "result": result}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
        @self.app.post("/{name}/generate-lesson")
        async def agent_action(action_request: ActionRequest,name:str):
            """Execute a single agent action"""
            #loading the agent
            
            self.state.cli._load_agent_from_file(name)
             
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            print(action_request.action)
            
            try:
                args={
                "language":action_request.params[0],
                "level":action_request.params[1],
                "knownWords":action_request.params[2]
                }
                result=execute_action(self.state.cli.agent,'generate-lesson',**args)
                print(result)
               
                return {"status": "success", "result":result}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.post("/{name}/chat")
        async def agent_action(action_request: ActionRequest,name:str):
            """Execute a single agent action"""
            #loading the agent
            
            self.state.cli._load_agent_from_file(name)
             
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            print(action_request.action)
            
            try:
                args={
                "prompt":action_request.params[0],
                "user":action_request.params[1],
                "conversation_history":action_request.params[2]
                }
                result=execute_action(self.state.cli.agent,'chat',**args)
                print(result)
               
                return {"status": "success", "result":result}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
        @self.app.post("/{name}/progress")
        async def agent_action(action_request: ActionRequest,name:str):
            """Execute a single agent action"""
            #loading the agent
            
            self.state.cli._load_agent_from_file(name)
             
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            print(action_request.action)
            
            try:
                args={
                "prompt":action_request.params[0],
                "user":action_request.params[1],
                "progress":action_request.params[2]
                }
                result=execute_action(self.state.cli.agent,'get-progress-report',**args)
                print(result)
               
                return {"status": "success", "result":result}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
        @self.app.post("/{name}/get-rewards")
        async def agent_action(action_request: ActionRequest,name:str):
            """Execute a single agent action"""
            #loading the agent
            
            self.state.cli._load_agent_from_file(name)
             
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            print(action_request.action)
            
            try:
                args={
                "user_address":action_request.params[0],
                "name":action_request.params[1],
                "level":action_request.params[2],
                "title":action_request.params[3]
                }
                
                result=execute_action(self.state.cli.agent,'get-rewards',**args)
                print(result)
               
                return {"status": "success", "result":result}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
        @self.app.post("/agent/start")
        async def start_agent():
            """Start the agent loop"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            
            try:
                await self.state.start_agent_loop()
                return {"status": "success", "message": "Agent loop started"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/agent/stop")
        async def stop_agent():
            """Stop the agent loop"""
            try:
                await self.state.stop_agent_loop()
                return {"status": "success", "message": "Agent loop stopped"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        @self.app.post("/connections/{name}/configure")
        async def configure_connection(name: str, config: ConfigureRequest):
            """Configure a specific connection"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
            
            try:
                connection = self.state.cli.agent.connection_manager.connections.get(name)
                if not connection:
                    raise HTTPException(status_code=404, detail=f"Connection {name} not found")
                
                success = connection.configure(**config.params)
                if success:
                    return {"status": "success", "message": f"Connection {name} configured successfully"}
                else:
                    raise HTTPException(status_code=400, detail=f"Failed to configure {name}")
                    
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.get("/connections/{name}/status")
        async def connection_status(name: str):
            """Get configuration status of a connection"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")
                
            try:
                connection = self.state.cli.agent.connection_manager.connections.get(name)
                if not connection:
                    raise HTTPException(status_code=404, detail=f"Connection {name} not found")
                    
                return {
                    "name": name,
                    "configured": connection.is_configured(verbose=True),
                    "is_llm_provider": connection.is_llm_provider
                }
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
            
        # @self.app.post("/agents/{name}/create-lesson")
        # async def create_lesson(request: LessonRequest):
        #     """
        #     Create lesson: Sending lesson data through this proxy.
        #     """
        #     try:
        #         # Fetch user data
        #         user_response = await get_user(request.address)
        #         known_words = user_response['data']['knownWords']
        #         target_language = user_response['data']['targetLanguage']
        #         prior_experience = user_response['data']['priorExperience']
                
                
        #         print(known_words,target_language,prior_experience,request.address)
        #         # Create lesson
        #         lesson_response = create_language_lesson(target_language, prior_experience, " ".join(known_words))
        #         # Prepare final JSON
        #         final_json = {
        #             "createdBy": request.user_id,
        #             "lesson": lesson_response,
        #         }

        #         # Hit the Node.js backend endpoint
        #         async with httpx.AsyncClient() as client:
        #             response = await client.post(
        #                 f"{NODE_BACKEND_URL}/create-material",
        #                 json=final_json
        #             )
        #             response.raise_for_status()
        #             logger.info("Material created successfully.")

        #         return {"message": "Lesson created successfully", "data": final_json}
        
        #     except Exception as e:
        #         logger.error(f"Unexpected error in create_lesson: {e}")
        #         raise HTTPException(status_code=500, detail=str(e))

def create_app():
    server = ZerePyServer()
    return server.app