import json
from typing import List
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from uagents import Model
from uagents.envelope import Envelope
from uagents.query import query
import uvicorn

AGENT_ADDRESS = "agent1q2nrt776zs8ckksh8jepqcvmk36tathm8sdj25s7jx6nad0rlmmrcrka3tn"

origins = ["*"]



class TestRequest(Model):
    message: str

class CorsiTestData(Model):
    iteration: int
    playerOrder: List[int] | None
    flashOrder: List[int]
    reactionTime: int


async def agent_query(req):
    print(req)
    response = await query(destination=AGENT_ADDRESS, message=req, timeout=15)
    if isinstance(response, Envelope):
        data = json.loads(response.decode_payload())
        return data["text"]
    return response


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return "Hello from the Agent controller"


@app.post("/endpoint")
async def make_agent_call(req: Request):
    model = CorsiTestData.parse_obj(await req.json())
    try:
        res = await agent_query(model)
        return f"successful call - agent response: {res}"
    except Exception:
        return "unsuccessful agent call"

@app.post("/reaction")
async def reaction(req: Request):
    model = CorsiTestData.parse_obj(await req.json())
    try:
        print("Hello, sending the query to corsi")
        res = await agent_query(model)
        return f"successful call - agent response: {res}"
    except Exception:
        return "unsuccessful agent call"


if __name__=="__main__":
    uvicorn.run(app, port=8001)