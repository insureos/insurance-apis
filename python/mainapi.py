from fastapi import FastAPI, HTTPException, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from configuration import global_config
from models import (
    User,
    LPToken,
    LPPool,
    Insurance,
    InsuranceProposal,
    Claim,
    StrategyProposal,
)
from pydantic_models import PaginationRequest
from datetime import datetime, timedelta
from middleware import custom_middleware
from mixpanel_proxy import api_request
from db import connect_to_db


class Application:
    def __init__(self, app, middleware, db_uri, cors_origins):
        self.app = app
        self.middleware = middleware
        self.db_uri = db_uri
        self.cors_origins = cors_origins

    def build_application(self):
        self.app.middleware("http")(self.middleware)
        self.app.middleware("https")(self.middleware)
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.cors_origins,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        connect_to_db(self.db_uri)
        return self

    def add_routes(self):
        @self.app.get("/")
        async def sanity_check():
            """
            Health check endpoint to ensure the service is up and running.
            """
            return {"message": "Service is up!"}

        @self.app.get("/claim")
        async def get_all_claims(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            claims = Claim.objects().skip(offset).limit(pagination_request.page_size)
            claims_json_list = [claim.to_mongo().to_dict() for claim in claims]
            return {"claims": claims_json_list}

        @self.app.get("/lp/token")
        async def get_all_lp_tokens(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_tokens = (
                LPToken.objects().skip(offset).limit(pagination_request.page_size)
            )
            lp_tokens_json = [lp_token.to_mongo().to_dict() for lp_token in lp_tokens]
            return {"lp_tokens": lp_tokens_json}

        @self.app.get("/lp/token/new")
        async def get_new_lp_token(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_tokens = (
                LPToken.objects()
                .order_by("-lp_token_created")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            lp_tokens_json = [lp_token.to_mongo().to_dict() for lp_token in lp_tokens]
            return {"lp_tokens": lp_tokens_json}

        @self.app.get("/lp/token/trending")
        async def get_trending_lp_token(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_tokens = (
                LPToken.objects()
                .order_by("-lp_token_volume")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            lp_tokens_json = [lp_token.to_mongo().to_dict() for lp_token in lp_tokens]
            return {"lp_tokens": lp_tokens_json}

        @self.app.get("/mixpanel/proxy/{path}")
        async def get_mixpanel_proxy(path: str, request: Request):
            return api_request(path, request)

        @self.app.post("/mixpanel/proxy/{path}")
        async def post_mixpanel_proxy(path: str, request: Request):
            return api_request(path, request)

        return self

    def get_app(self):
        return self.app


app = (
    Application(
        FastAPI(),
        custom_middleware,
        global_config["Application"]["DB"],
        ["*"],
    )
    .build_application()
    .add_routes()
    .get_app()
)
if __name__ == "__main__":
    uvicorn.run("mainapi:app", reload=True)
