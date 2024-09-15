from uagents import Agent, Context, Model
import asyncio

MAX_RETRIES = 3
TIMEOUT_SECONDS = 60

class Prompt(Model):
    context: str
    text: str


class Response(Model):
    text: str


agent = Agent()


AI_AGENT_ADDRESS = "agent1qvyrg0578tm2ekua44gnyqmgf99wemp4q8mamatvkg5kvgepsh2fz3e24xk"

async def send_message_with_retry(ctx: Context, address: str, message: Model):
    for attempt in range(MAX_RETRIES):
        try:
            ctx.logger.info(f"Sending message to {address} (Attempt {attempt + 1})")
            response = await asyncio.wait_for(ctx.send(address, message), timeout=TIMEOUT_SECONDS)
            ctx.logger.info(f"Message sent successfully: {response}")
            return
        except asyncio.TimeoutError:
            ctx.logger.warning(f"Timeout occurred while waiting for response (Attempt {attempt + 1})")
        except Exception as e:
            ctx.logger.error(f"Error sending message: {str(e)} (Attempt {attempt + 1})")
        
        if attempt < MAX_RETRIES - 1:
            await asyncio.sleep(5)  # Wait 5 seconds before retrying
    
    ctx.logger.error("Failed to send message after maximum retries")


code = """
    def do_something():
        for i in range(10)
            pass
    """

prompt = Prompt(
    context="Find and fix the bug in the provided code snippet",
    text=code,
)

@agent.on_interval(period=30.0)
async def periodic_message(ctx: Context):
    await send_message_with_retry(ctx, AI_AGENT_ADDRESS, prompt)

@agent.on_event("startup")
async def startup_routine(ctx: Context):
    await send_message_with_retry(ctx, AI_AGENT_ADDRESS, prompt)

@agent.on_message(Response)
async def handle_response(ctx: Context, sender: str, msg: Response):
    ctx.logger.info(f"Entered handle_response function")
    ctx.logger.info(f"Received response from {sender}: {msg.text}")

if __name__ == "__main__":
    agent.run()