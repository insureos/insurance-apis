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
    lp_token_volume = IntField(required=True, default=0)


class LPPool(Document):
    created_by = StringField(required=True)
    total_assets = IntField(required=True, default=0)
    total_liabilties = IntField(required=True, default=0)
    tokenised = ReferenceField(LPToken, default=None)


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


class Claim(Document):
    insurance_proposal = ReferenceField(InsuranceProposal, required=True)
    claim_amount = IntField(required=True)
    vote_positive = IntField(required=True, default=0)
    vote_negative = IntField(required=True, default=0)
    voting_start = DateTimeField()
    claim_accepted = BooleanField(required=True, default=False)
    claim_title = StringField(required=True)
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
