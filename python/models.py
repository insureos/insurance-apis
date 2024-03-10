from mongoengine import (
    Document,
    IntField,
    StringField,
    EmailField,
    DateTimeField,
    EmbeddedDocument,
    ListField,
    BooleanField,
    EmbeddedDocumentField,
    ReferenceField,
    URLField,
)


class User(Document):
    user_github_id = StringField(required=True, unique=True)
    user_verifying_documents = URLField(required=True, unique=True)
    user_github_name = StringField(required=True)
    user_hashed_github_auth = StringField(required=True)
    user_auth_salt = StringField(required=True)
    user_emails = ListField(EmailField())
    user_primary_email = EmailField()
    user_profile_pic = URLField()


class LPToken(EmbeddedDocument):
    lp_token_name = StringField(required=True)
    lp_token_image = StringField(required=True)
    lp_token_addr = StringField(required=True)
    lp_token_supply = IntField(required=True)


class LPPool(Document):
    created_by = StringField(required=True)
    total_assets = IntField(required=True, default=0)
    total_liabilties = IntField(required=True, default=0)
    tokenised = EmbeddedDocumentField(LPToken, default=None)


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
