import mongoose from 'mongoose';

interface IInsuranceProposal {
  insurance: mongoose.Schema.Types.ObjectId;
  lp: mongoose.Schema.Types.ObjectId;
  accepted: mongoose.Schema.Types.Boolean;
  proposal_docs: mongoose.Schema.Types.String;
  proposed_commision: mongoose.Schema.Types.Number;
  proposed_undercollaterization: mongoose.Schema.Types.Number;
  premium_due_date: mongoose.Schema.Types.Date;
  proposal_pubkey: mongoose.Schema.Types.String;
  sent: mongoose.Schema.Types.Boolean;
}

const InsuranceProposalSchema = new mongoose.Schema<IInsuranceProposal>(
  {
    insurance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Insurance',
      required: true,
    },
    lp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LPPool',
      required: true,
    },
    accepted: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
    proposal_docs: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    proposed_commision: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    proposed_undercollaterization: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    premium_due_date: {
      type: mongoose.Schema.Types.Date,
    },
    proposal_pubkey: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    sent: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false },
);

export const InsuranceProposal = mongoose.model<IInsuranceProposal>('InsuranceProposal', InsuranceProposalSchema);
