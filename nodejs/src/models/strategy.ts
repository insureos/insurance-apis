import mongoose from 'mongoose';

// Strategy Interface and Schema
interface IStrategy {
  strategy: string;
}

const StrategySchema = new mongoose.Schema<IStrategy>(
  {
    strategy: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false },
);

const Strategy = mongoose.model<IStrategy>('Strategy', StrategySchema);

// StrategyProposal Interface and Schema
interface IStrategyProposal {
  strategy_program: mongoose.Schema.Types.ObjectId;
  insurance_proposal: mongoose.Schema.Types.ObjectId;
  stream_amount: mongoose.Schema.Types.Number;
  stream_every: mongoose.Schema.Types.Number;
  number_of_streams: mongoose.Schema.Types.Number;
  strategy_id: mongoose.Schema.Types.String;
  vote: mongoose.Schema.Types.Number;
  accepted: mongoose.Schema.Types.Boolean;
  blocked: mongoose.Schema.Types.Boolean;
  proposal_pubkey: mongoose.Schema.Types.String;
}

const StrategyProposalSchema = new mongoose.Schema<IStrategyProposal>(
  {
    strategy_program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Strategy',
      required: true,
    },
    insurance_proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsuranceProposal',
      required: true,
    },
    stream_amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    stream_every: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    number_of_streams: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    strategy_id: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    vote: {
      type: mongoose.Schema.Types.Number,
      default: 0,
      required: true,
    },
    accepted: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
      required: true,
    },
    blocked: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
      required: true,
    },
  },
  { versionKey: false },
);

const StrategyProposal = mongoose.model<IStrategyProposal>('StrategyProposal', StrategyProposalSchema);

export { Strategy, StrategyProposal };
