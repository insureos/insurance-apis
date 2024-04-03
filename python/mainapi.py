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
        @self.app.get("/python/")
        async def sanity_check():
            """
            Health check endpoint to ensure the service is up and running.
            """
            return {"message": "Service is up!"}

        @self.app.get("/python/insurance")
        async def get_open_insurances(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            insurances = (
                Insurance.objects(reinsured=False)
                .filter(expiry__gt=int(datetime.now().timestamp()))
                .order_by("-expiry")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            insurance_json_list = []
            for insurance in insurances:
                insurance_json = insurance.to_mongo().to_dict()
                del insurance_json["_id"]
                del insurance_json["created_by"]
                insurance_json_list.append(insurance_json)
                print(insurance_json)
            return insurance_json_list

        @self.app.get("/python/insurance/detail")
        async def get_insurance_details(insurance_pubkey: str):
            insurance = Insurance.objects(insurance_pubkey=insurance_pubkey).first()
            insurance_proposals = InsuranceProposal.objects(insurance=insurance)
            insurance_proposals_json_list = []
            for insurance_proposal in insurance_proposals:
                insurance_json = insurance_proposal.to_mongo().to_dict()
                del insurance_json["_id"]
                del insurance_json["lp"]
                del insurance_json["insurance"]
                insurance_proposals_json_list.append(insurance_json)
            return insurance_proposals_json_list

        @self.app.get("/python/claim")
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

        @self.app.get("/python/claim/table")
        async def get_claim_table(claim_id: str):
            claim = Claim.objects(claim_id=claim_id).first()
            return claim.claim_votes.to_mongo().to_dict()

        @self.app.get("/python/lp/token")
        async def get_all_lp_tokens(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_tokens = (
                LPToken.objects().skip(offset).limit(pagination_request.page_size)
            )
            lp_tokens_json = []
            for lp_token in lp_tokens:
                lp_json = lp_token.to_mongo().to_dict()
                del lp_json["_id"]
                lp_tokens_json.append(lp_json)
            return lp_tokens_json

        @self.app.get("/python/lp/token/new")
        async def get_new_lp_token(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_tokens = (
                LPToken.objects()
                .order_by("-lp_token_created")
                .skip(offset)
                .limit(pagination_request.page_size)
            )
            lp_tokens_json = []
            for lp_token in lp_tokens:
                lp_json = lp_token.to_mongo().to_dict()
                del lp_json["_id"]
                lp_tokens_json.append(lp_json)
            return lp_tokens_json

        @self.app.get("/python/mixpanel/proxy/{path}")
        async def get_mixpanel_proxy(path: str, request: Request):
            return api_request(path, request)

        @self.app.post("/python/mixpanel/proxy/{path}")
        async def post_mixpanel_proxy(path: str, request: Request):
            return api_request(path, request)

        @self.app.get("/python/oracle")
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

        @self.app.get("/python/oracle/graph")
        async def get_oracle_details(oracle_name: str):
            oracle = Oracle.objects(oracle_name=oracle_name).first()
            return oracle.oracle_val.to_mongo().to_dict()

        @self.app.get("/python/lp")
        async def get_lps(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            lp_pools = (
                LPPool.objects(tokenised__exists=True)
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
                        "overcapitalization_ratio": (
                            0
                            if lp_pool.total_assets == 0
                            else round(
                                lp_pool.total_liabilties / lp_pool.total_assets, 2
                            )
                        ),
                        "pool_lifecycle": lp_pool.pool_lifecycle,
                        "pool_pubkey": lp_pool.pool_pubkey,
                    }
                )
            return lp_pools_json_list

        @self.app.get("/python/lp/detail")
        async def get_lp_details(pool_pubkey: str):
            lp = LPPool.objects(pool_pubkey=pool_pubkey).first()
            insurance_proposals = InsuranceProposal.objects(lp=lp, accepted=True)
            insurance_proposals_json_list = []
            for insurance_proposal in insurance_proposals:
                insurance_proposals_json_list.append(
                    insurance_proposal.to_mongo().to_dict()
                )
            return insurance_proposals_json_list

        @self.app.get("/python/strategy")
        async def get_approved_strategy(pagination_request: PaginationRequest):
            offset = (pagination_request.page_no - 1) * pagination_request.page_size
            strategies = (
                Strategy.objects().skip(offset).limit(pagination_request.page_size)
            )
            strategy_json_list = []
            for strategy in strategies:
                strategy_json_list.append(strategy.to_mongo().to_dict())
            return strategy_json_list

        return self

    def get_app(self):
        return self.app


app = (
    Application(
        FastAPI(),
        custom_middleware,
        global_config["Application"]["DB"],
        list(global_config["Application"]["DOMAIN_CORS_LIST"]),
    )
    .build_application()
    .add_routes()
    .get_app()
)
if __name__ == "__main__":
    uvicorn.run("mainapi:app", reload=True)
