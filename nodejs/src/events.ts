import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export interface IInsurerRegistered {
  insuranceCreator: PublicKey;
  verifyingDocuments: String;
  insurer: PublicKey;
}

export interface IInsuranceCreated {
  insurer: PublicKey;
  insuranceId: String;
  coverage: BN;
  premium: BN;
  minimumCommission: BN;
  deductible: BN;
  expiry: BN;
  metadataLink: String;
  insurance: PublicKey;
}

export interface ILPCreated {
  lpCreator: PublicKey;
  tokenName: String;
  tokenMetadataUri: String;
  tokenSymbol: String;
  idealSize: BN;
  poolLifecycle: BN;
  lp: PublicKey;
}

export interface ILPAssetAdded {
  lp: PublicKey;
  assetAmount: BN;
  securityMint: PublicKey;
  securityAddr: PublicKey;
}

export interface IReInsuranceProposalProposed {
  lp: PublicKey;
  proposer: PublicKey;
  proposedCommision: BN;
  proposedUndercollaterization: BN;
  insurance: PublicKey;
  proposalDocs: String;
  proposal: String;
}

export interface IProposalSent {
  proposal: PublicKey;
}

export interface IInsuranceProposalVoted {
  voter: PublicKey;
  proposal: PublicKey;
  transferAmount: BN;
  voteProposalAccount: PublicKey;
}

export interface IReInsuranceProposalAccepted {
  reinsurance: PublicKey;
}

export interface IPremiumPayed {
  reinsurance: PublicKey;
  prepaymentTime: BN;
  premiumVault: PublicKey;
}

export interface IStrategyProposed {
  strategy: PublicKey;
  streamAmount: BN;
  streamEvery: BN;
  numberOfStreams: BN;
  premiumVault: PublicKey;
  strategyId: String;
  strategyProgram: PublicKey;
}

export interface IStrategyVoted {
  strategy: PublicKey;
  voter: PublicKey;
  vote_amount: BN;
  proposed_strategy_vote_account: PublicKey;
}

export interface IStrategyAccepted {
  strategy: PublicKey;
}

export interface IStrategyBlocked {
  strategy: PublicKey;
}
export interface IStrategyExecuted {
  strategy: PublicKey;
}

export interface IClaimRaised {
  reinsurance: PublicKey;
  claim: PublicKey;
  claimAmount: BN;
  claimMetadataLink: String;
  claimId: String;
}

export interface IClaimVoted {
  claim: PublicKey;
  voter: PublicKey;
  voteAmount: BN;
  claimVoteAccount: PublicKey;
  voteDirection: boolean;
}

export interface IClaimDecisionReleased {
  claim: PublicKey;
  decision: Boolean;
}

export interface IReInsuranceClaimed {
  reinsurance: PublicKey;
  claim: PublicKey;
}
