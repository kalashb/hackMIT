from uagents import Agent, Context, Model
import asyncio

class Prompt(Model):
    context: str
    text: str


class Response(Model):
    text: str


agent = Agent()


AI_AGENT_ADDRESS = "agent1qvyrg0578tm2ekua44gnyqmgf99wemp4q8mamatvkg5kvgepsh2fz3e24xk"


code = """
    def do_something():
        for i in range(10)
            pass
    """

prompt = Prompt(
    context="Find and fix the bug in the provided code snippet",
    text=code,
)

@agent.on_interval(period=10.0)
async def check_status(ctx: Context):
    ctx.logger.info("Still waiting for a response...")

@agent.on_event("startup")
async def send_message(ctx: Context):
    ctx.logger.info(f"Sending message to {AI_AGENT_ADDRESS}")
    try:
        response = await asyncio.wait_for(ctx.send(AI_AGENT_ADDRESS, prompt), timeout=30)
        ctx.logger.info(f"Message sent successfully: {response}")
    except asyncio.TimeoutError:
        ctx.logger.error("Timeout occurred while waiting for response")
    except Exception as e:
        ctx.logger.error(f"Error sending message: {str(e)}")

@agent.on_message(Response)
async def handle_response(ctx: Context, sender: str, msg: Response):
    ctx.logger.info(f"Entered handle_response function")
    ctx.logger.info(f"Received response from {sender}: {msg.text}")

if __name__ == "__main__":
    agent.run()