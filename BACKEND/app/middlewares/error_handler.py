from fastapi import Request
from fastapi.responses import JSONResponse
from app.utils.logger import logger
import traceback

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught: {exc}")
    logger.error("Error Handler: ",traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )