from uagents import Agent, Context, Model
import json

class UserInput(Model):
    input: str
    time_taken: float
    accuracy: float

class AnalysisRequest(Model):
    inputs: list[UserInput]

class AnalysisResponse(Model):
    analysis: str

agent = Agent(name="input_analysis_agent")

@agent.on_message(UserInput)
async def handle_input(ctx: Context, sender: str, msg: UserInput):
    # Store the input in a JSON file
    try:
        with open('user_data.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = []
    
    data.append(msg.dict())
    
    with open('user_data.json', 'w') as f:
        json.dump(data, f)
    
    await ctx.send(sender, AnalysisResponse(analysis="Input received and stored"))

@agent.on_message(AnalysisRequest)
async def handle_analysis(ctx: Context, sender: str, msg: AnalysisRequest):
    # Perform simple analysis
    total_time = sum(input.time_taken for input in msg.inputs)
    avg_time = total_time / len(msg.inputs) if msg.inputs else 0
    total_accuracy = sum(input.accuracy for input in msg.inputs)
    avg_accuracy = total_accuracy / len(msg.inputs) if msg.inputs else 0
    
    analysis = f"Analyzed {len(msg.inputs)} inputs. Average time: {avg_time:.2f}s, Average accuracy: {avg_accuracy:.2f}"
    
    await ctx.send(sender, AnalysisResponse(analysis=analysis))

if __name__ == "__main__":
    agent.run()