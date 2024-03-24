import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export interface IInsurerRegistered {
  insuranceCreator: PublicKey;
  verifyingDocuments: String;
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
}

export interface ILPCreated {
  lpCreator: PublicKey;
  tokenName: String;
  tokenMetadataUri: String;
  tokenSymbol: String;
  idealSize: BN;
  poolLifecycle: BN;
}

export interface ILPAssetAdded {
  lp: PublicKey;
  assetAmount: BN;
}

export interface IReInsuranceProposalProposed {
  lp: PublicKey;
  proposer: PublicKey;
  proposedCommision: BN;
  proposedUndercollaterization: BN;
  insurance: PublicKey;
  proposalDocs: String;
}

export interface IInsuranceProposalVoted {
  voter: PublicKey;
  proposal: PublicKey;
  transferAmount: BN;
}

export interface IReInsuranceProposalAccepted {
  reinsurance: PublicKey;
}

export interface IPremiumPayed {
  reinsurance: PublicKey;
  prepaymentTime: BN;
}
