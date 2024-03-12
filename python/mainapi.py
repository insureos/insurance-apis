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
            claims = (
                Claim.objects(voting_ended=False)
                .order_by("voting_start")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            claims_json_list = []
            for claim in claims:
                # The target is 30 days after the given datetime
                target_datetime = claim.voting_start + timedelta(days=30)
                time_to_get_there = target_datetime - datetime.now()
                claim_json = claim.to_mongo().to_dict()
                del claim_json["claim_votes"]
                claim_json["voting_ending_in"] = str(time_to_get_there)
                claims_json_list.append(claim_json)
            return claims_json_list

        @self.app.get("/claim/table")
        async def get_claim_table(claim_id: str):
            claim = Claim.objects(claim_id=claim_id).first()
            return claim.claim_votes.to_mongo().to_dict()

        @self.app.get("/lp/token")
        async def get_all_lp_tokens(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_tokens = (
                LPToken.objects().skip(offset).limit(pagination_request.page_size)
            )
            lp_tokens_json = [lp_token.to_mongo().to_dict() for lp_token in lp_tokens]
            return lp_tokens_json

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
            return lp_tokens_json

        @self.app.get("/mixpanel/proxy/{path}")
        async def get_mixpanel_proxy(path: str, request: Request):
            return api_request(path, request)

        @self.app.post("/mixpanel/proxy/{path}")
        async def post_mixpanel_proxy(path: str, request: Request):
            return api_request(path, request)

        @self.app.get("/oracle")
        async def get_oracles(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            oracles = (
                Oracle.objects()
                .order_by("-oracle_last_synced")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            oracles_json_list = []
            for oracle in oracles:
                oracles_json_list.append(
                    {
                        "oracle_name": oracle.oracle_name,
                        "oracle_created_by": oracle.oracle_created_by,
                        "oracle_data_point": oracle.oracle_data_point,
                        "oracle_metadata_uri": oracle.oracle_metadata_uri,
                        "oracle_percentage_change": oracle.oracle_percentage_change,
                        "oracle_last_synced": oracle.oracle_last_synced,
                    }
                )
            return oracles_json_list

        @self.app.get("/oracle/graph")
        async def get_oracle_details(oracle_name: str):
            oracle = Oracle.objects(oracle_name=oracle_name).first()
            return oracle.oracle_val.to_mongo().to_dict()

        @self.app.get("/lp")
        async def get_lps(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_pools = (
                LPPool.objects(tokenised != None)
                .order_by("tokens_sold_last_month", "total_assets")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            lp_pools_json_list = []
            for lp_pool in lp_pools:
                lp_pools_json_list.append(
                    {
                        "pool_name": lp_pool.pool_name,
                        "created_by": lp_pool.created_by,
                        "current_pool_size": lp_pool.total_assets,
                        "target_pool_size": lp_pool.target_pool_size,
                        "overcapitalization_ratio": round(
                            lp_pool.total_liabilties / lp_pool.total_assets, 2
                        ),
                        "pool_lifecycle": lp_pool.pool_lifecycle,
                    }
                )
            return lp_pools_json_list

        @self.app.get("/lp/detail")
        async def get_lp_details(pool_name: str):
            lp = LPPool.objects(pool_name=pool_name).first()
            insurance_proposals = InsuranceProposal.objects(lp=lp, accepted=True)
            insurance_proposals_json_list = []
            for insurance_proposal in insurance_proposals:
                insurance_proposals_json_list.append(
                    insurance_proposal.to_mongo().to_dict()
                )
            return insurance_proposals_json_list

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
