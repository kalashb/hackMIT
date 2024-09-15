from uagents import Agent, Context, Model
from typing import List
from uagents.setup import fund_agent_if_low
import asyncio
from aiohttp import web
import json
import os

class CorsiTestData(Model):
    iteration: int
    playerOrder: List[int] | None
    flashOrder: List[int]
    reactionTime: int

class AnalysisRequest(Model):
    pass

class AnalysisResponse(Model):
    analysis: str

class Response(Model):
    text: str

# Create an agent
corsi_agent = Agent(name="corsi agent asdsa", port=8000, seed="corsi seed asdada", endpoint=["http://localhost:8000/submit"])
#fund_agent_if_low(corsi_agent.wallet.address())

@corsi_agent.on_query(model=CorsiTestData, replies={Response})
async def query_handler(ctx: Context, sender: str, _query: CorsiTestData):
    ctx.logger.info("Query analysed")
    try:
        await ctx.send(sender, Response(text="Right hemisphere regions of the inferior prefrontal cortex, anterior occipital cortex, and posterior parietal cortex"))
    except Exception:
        await ctx.send(sender, Response(text="fail"))
'''
# Ensure the JSON file exists
if not os.path.exists('corsi_data.json'):
    with open('corsi_data.json', 'w') as f:
        json.dump([], f)

# Function to save data to JSON file
def save_to_json(data):
    with open('corsi_data.json', 'r+') as f:
        file_data = json.load(f)
        file_data.append(data)
        f.seek(0)
        json.dump(file_data, f, indent=2)

@corsi_agent.on_message(CorsiTestData)
async def handle_corsi_data(ctx: Context, sender: str, msg: CorsiTestData):
    save_to_json(msg.dict())
    ctx.logger.info(f"Received and saved Corsi test data for iteration {msg.iteration}")

@corsi_agent.on_message(AnalysisRequest)
async def handle_analysis_request(ctx: Context, sender: str, msg: AnalysisRequest):
    with open('corsi_data.json', 'r') as f:
        data = json.load(f)
    
    prompt = f"Analyze the following Corsi Block Test data:\n\n"
    for item in data:
        prompt += f"Iteration: {item['iteration']}, Correct: {item['correct']}\n"
    prompt += "\nProvide insights on the participant's performance and any patterns observed."
    
    # Placeholder analysis
    analysis = "Based on the Corsi Block Test data, the participant showed improvement over time..."
    
    await ctx.send(sender, AnalysisResponse(analysis=analysis))

@corsi_agent.on_query(model=CorsiTestData, replies={Response})
async def query_handler(ctx: Context, sender: str, _query: CorsiTestData):
    ctx.logger.info("Query analysed")
    try:
        await ctx.send(sender, Response(text="Right hemisphere regions of the inferior prefrontal cortex, anterior occipital cortex, and posterior parietal cortex"))
    except Exception:
        await ctx.send(sender, Response(text="fail"))

# Set up web server
app = web.Application()

async def handle_corsi_data(request):
    data = await request.json()
    await corsi_agent.send(corsi_agent.address, CorsiTestData(**data))
    return web.json_response({"status": "ok"})

async def handle_analysis_request(request):
    response = await corsi_agent.send(corsi_agent.address, AnalysisRequest())
    return web.json_response({"analysis": response.analysis})

app.router.add_post('/submit_data', handle_corsi_data)
app.router.add_get('/analyze', handle_analysis_request)

# Run both the agent and the web server
async def run_server():
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8000)
    await site.start()
    print(f"Server started at http://localhost:8000")

'''

if __name__ == "__main__":
    corsi_agent.run()