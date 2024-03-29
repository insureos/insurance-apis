import mongoose from 'mongoose';

interface IClaimVotes {
  voter: string;
  vote_amount: number;
  vote_side: boolean;
}

const ClaimVotesSchema = new mongoose.Schema<IClaimVotes>(
  {
    voter: {
      type: String,
      required: true,
    },
    vote_amount: {
      type: Number,
      required: true,
    },
    vote_side: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
); // Set _id to false for embedded documents if you don't want them to have their own _id.

interface IClaim {
  claim_id: string;
  claim_proposer_address: string;
  claim_amount: number;
  vote_positive: number;
  vote_negative: number;
  voting_start: Date;
  voting_ended: boolean;
  claim_accepted: boolean;
  claim_title: string;
  claim_votes: IClaimVotes[];
  claim_description: string;
}

const ClaimSchema = new mongoose.Schema<IClaim>(
  {
    claim_id: {
      type: String,
      required: true,
      unique: true,
    },
    claim_proposer_address: {
      type: String,
      required: true,
    },
    claim_amount: {
      type: Number,
      required: true,
    },
    vote_positive: {
      type: Number,
      required: true,
      default: 0,
    },
    vote_negative: {
      type: Number,
      required: true,
      default: 0,
    },
    voting_start: {
      type: Date,
      required: true,
      default: Date.now, // Use Date.now to ensure the current time is used
    },
    voting_ended: {
      type: Boolean,
      required: true,
      default: false,
    },
    claim_accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    claim_title: {
      type: String,
      required: true,
    },
    claim_votes: {
      type: [ClaimVotesSchema],
      default: [],
      required: true,
    },
    claim_description: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export const Claim = mongoose.model<IClaim>('Claim', ClaimSchema);
