import mongoose from 'mongoose';

interface IClaimVotes {
  voter: string;
  vote_amount: mongoose.Schema.Types.Number;
  vote_side: boolean;
}

const ClaimVotesSchema = new mongoose.Schema<IClaimVotes>(
  {
    voter: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    vote_amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    vote_side: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
    },
  },
  { _id: false },
);

interface IClaim {
  claim_id: mongoose.Schema.Types.String;
  claim_addr: mongoose.Schema.Types.String;
  claim_amount: mongoose.Schema.Types.Number;
  vote_positive: mongoose.Schema.Types.Number;
  vote_negative: mongoose.Schema.Types.Number;
  voting_start: mongoose.Schema.Types.Date;
  voting_ended: mongoose.Schema.Types.Boolean;
  claim_accepted: mongoose.Schema.Types.Boolean;
  claim_title: mongoose.Schema.Types.String;
  claim_votes: IClaimVotes[];
  claim_description: mongoose.Schema.Types.String;
  reinsurance: mongoose.Schema.Types.ObjectId;
  claim_claimed: mongoose.Schema.Types.Boolean;
}

const ClaimSchema = new mongoose.Schema<IClaim>(
  {
    claim_id: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    claim_addr: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    claim_amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    vote_positive: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
    vote_negative: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
    voting_start: {
      type: mongoose.Schema.Types.Date,
      required: true,
      default: Date.now, // Use Date.now to ensure the current time is used
    },
    voting_ended: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
    claim_accepted: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
    claim_claimed: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
    claim_title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    claim_votes: {
      type: [ClaimVotesSchema],
      default: [],
      required: true,
    },
    claim_description: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    reinsurance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsuranceProposal',
      required: true,
    },
  },
  { versionKey: false },
);

export const Claim = mongoose.model<IClaim>('Claim', ClaimSchema);
