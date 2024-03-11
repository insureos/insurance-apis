from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from logger import logger  # Assuming you have a configured logger instance
import time
import traceback


class CustomMiddleware:
    def __init__(self, logger):
        self.logger = logger
        self.request_counts = {}
        self.last_access = {}
        self.rate_limit = 100
        self.rate_limit_period = 60  # 60 seconds

    def generate_middleware(self):
        async def custom_middleware(request: Request, call_next):
            start_time = time.time()
            try:
                remote_ip = request.client.host
                if self.is_ip_within_limit(remote_ip, start_time):
                    self.logger.info(
                        f"Request received: {request.method} {request.url}"
                    )
                    self.logger.info(f"Headers: {request.headers}")
                    body = await request.body()
                    self.logger.info(f"Request Body: {body.decode()}")

                    response = await call_next(request)

                    process_time = time.time() - start_time
                    self.logger.info(
                        f"Response: {response.status_code}, Latency: {process_time:.2f} seconds"
                    )

                    return response
                else:
                    self.logger.warning(f"Rate limit exceeded for IP: {remote_ip}")
                    return JSONResponse(
                        status_code=429, content={"message": "Rate limit exceeded"}
                    )
            except Exception as e:
                self.logger.error(f"Error processing request: {traceback.format_exc()}")
                raise e  # It's usually better to re-raise the original exception unless you have a specific reason to change it.

        return custom_middleware

    def is_ip_within_limit(self, remote_ip, current_time):
        self.cleanup_old_entries(current_time)
        if (
            remote_ip in self.request_counts
            and current_time - self.last_access[remote_ip] <= self.rate_limit_period
        ):
            if self.request_counts[remote_ip] >= self.rate_limit:
                return False
        self.increment_request_count(remote_ip, current_time)
        return True

    def cleanup_old_entries(self, current_time):
        for ip in list(self.last_access.keys()):
            if current_time - self.last_access[ip] > self.rate_limit_period:
                del self.last_access[ip]
                del self.request_counts[ip]

    def increment_request_count(self, remote_ip, current_time):
        if (
            remote_ip not in self.request_counts
            or current_time - self.last_access[remote_ip] > self.rate_limit_period
        ):
            self.request_counts[remote_ip] = 1
        else:
            self.request_counts[remote_ip] += 1
        self.last_access[remote_ip] = current_time


custom_middleware = CustomMiddleware(logger).generate_middleware()
