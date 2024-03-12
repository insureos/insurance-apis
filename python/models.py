from mongoengine import (
    Document,
    IntField,
    StringField,
    EmailField,
    DateTimeField,
    EmbeddedDocument,
    ListField,
    BooleanField,
    ReferenceField,
    URLField,
    FloatField,
    EmbeddedDocumentListField,
)
from datetime import datetime


class User(Document):
    user_addr = StringField(required=True, unique=True)
    user_verifying_documents = URLField(required=True, unique=True)


class LPToken(Document):
    lp = ReferenceField("LPPool", required=True, unique=True)
    lp_token_name = StringField(required=True)
    lp_token_image = StringField(required=True)
    lp_token_addr = StringField(required=True)
    lp_token_supply = IntField(required=True)
    lp_token_created = DateTimeField(required=True, default=datetime.now())


class LPPool(Document):
    pool_name = StringField(required=True, unique=True)
    created_by = StringField(required=True, unique=True)
    total_assets = IntField(required=True, default=0)
    total_liabilties = IntField(required=True, default=0)
    tokenised = ReferenceField(LPToken, default=None)
    pool_created_at = DateTimeField(required=True, default=datetime.now())
    target_pool_size = IntField(required=True)
    pool_lifecycle = IntField(required=True)
    tokens_sold_last_month = IntField(required=True, default=0)


class Insurance(Document):
    created_by = StringField(required=True)
    coverage = IntField(required=True)
    premium = IntField(required=True)
    minimum_commision = IntField(required=True)
    deductible = IntField(required=True, default=0)
    expiry = DateTimeField(required=True)
    metadata_link = URLField(required=True)
    reinsured = BooleanField(required=True, default=False)


class InsuranceProposal(Document):
    insurance = ReferenceField(Insurance, required=True)
    lp = ReferenceField(LPPool, required=True)
    accepted = BooleanField(required=True, default=False)
    proposal_docs = URLField(required=True, unique=True)
    proposed_commision = IntField(required=True)
    proposed_undercollaterization = IntField(required=True)
    premium_due_date = DateTimeField()


class ClaimVotes(EmbeddedDocument):
    voter = StringField(required=True)
    vote_amount = IntField(required=True)
    vote_side = BooleanField(required=True)


class Claim(Document):
    claim_id = StringField(required=True, unique=True)
    claim_proposer_address = StringField(required=True)
    claim_amount = IntField(required=True)
    vote_positive = IntField(required=True, default=0)
    vote_negative = IntField(required=True, default=0)
    voting_start = DateTimeField(required=True, default=datetime.now())
    voting_ended = BooleanField(required=True, default=False)
    claim_accepted = BooleanField(required=True, default=False)
    claim_title = StringField(required=True)
    claim_votes = EmbeddedDocumentListField(ClaimVotes, default=[], required=True)
    claim_description = StringField(required=True)


class StrategyProposal(Document):
    strategy_program = StringField(required=True)
    insurance_proposal = ReferenceField(InsuranceProposal, required=True)
    stream_amount = IntField(required=True)
    stream_every = IntField(required=True)
    number_of_streams = IntField(required=True)
    strategy_id = IntField(required=True)
    vote = IntField(required=True, default=0)
    accepted = BooleanField(required=True, default=False)
    blocked = BooleanField(required=True, default=False)


class OracleTimeSeriesData(EmbeddedDocument):
    oracle_val = FloatField(required=True)
    oracle_sync_time = DateTimeField(required=True)


class Oracle(Document):
    oracle_name = StringField(required=True, unique=True)
    oracle_created_by = StringField(required=True)
    oracle_data_point = StringField(required=True)
    oracle_metadata_uri = URLField(required=True, unique=True)
    oracle_percentage_change = FloatField(required=True)
    oracle_val = EmbeddedDocumentListField(
        OracleTimeSeriesData, required=True, default=[]
    )
    oracle_last_synced = DateTimeField(required=True)
