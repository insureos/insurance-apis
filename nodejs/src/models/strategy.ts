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
  strategy_program: mongoose.Types.ObjectId;
  insurance_proposal: mongoose.Types.ObjectId;
  stream_amount: number;
  stream_every: number;
  number_of_streams: number;
  strategy_id: number;
  vote: number;
  accepted: boolean;
  blocked: boolean;
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
      type: Number,
      required: true,
    },
    stream_every: {
      type: Number,
      required: true,
    },
    number_of_streams: {
      type: Number,
      required: true,
    },
    strategy_id: {
      type: Number,
      required: true,
    },
    vote: {
      type: Number,
      default: 0,
      required: true,
    },
    accepted: {
      type: Boolean,
      default: false,
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { versionKey: false },
);

const StrategyProposal = mongoose.model<IStrategyProposal>('StrategyProposal', StrategyProposalSchema);

export { Strategy, StrategyProposal };
