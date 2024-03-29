import * as anchor from '@project-serum/anchor';
import { Insurance } from '../type-file/insurance';
import { insurerRegistered } from './handlers/insurerRegistered';
import { insuranceRegistered } from './handlers/insuranceCreated';
import {
  IInsurerRegistered,
  IInsuranceCreated,
  ILPCreated,
  ILPAssetAdded,
  IReInsuranceProposalProposed,
  IProposalSent,
  IReInsuranceProposalAccepted,
} from './events';
import { checkTransactionSignature } from './utils';
import { lpCreated } from './handlers/lpCreated';
import { lpAssetAdded } from './handlers/lpAssetAdded';
import { reinsuranceProposalCreated } from './handlers/reinsuranceProposalCreated';
import { reinsuranceProposalSent } from './handlers/reinsuranceproposalSent';
import { reinsuranceProposalAccepted } from './handlers/reinsuranceProposalAccepted';

export const addEventListener = (program: anchor.Program<Insurance>) => {
  program.addEventListener('VerifiedUserAdded', (res: IInsurerRegistered, _, signature) => {
    checkTransactionSignature(signature);
    insurerRegistered(res)
      .then(() => {
        console.log('Insurer registered');
      })
      .catch((e) => {
        console.log('Error Adding User: ', e);
      });
  });
  program.addEventListener('InsuranceCreated', (res: IInsuranceCreated, _, signature) => {
    checkTransactionSignature(signature);
    insuranceRegistered(res)
      .then(() => {
        console.log('Insurance registered');
      })
      .catch((e) => {
        console.log('Error registering insurance: ', e);
      });
  });
  program.addEventListener('LPCreated', (res: ILPCreated, _, signature) => {
    checkTransactionSignature(signature);
    lpCreated(res)
      .then(() => {
        console.log('LP registered');
      })
      .catch((e) => {
        console.log('Error registering lp: ', e);
      });
  });
  program.addEventListener('LPAssetAdded', (res: ILPAssetAdded, _, signature) => {
    checkTransactionSignature(signature);
    lpAssetAdded(res)
      .then(() => {
        console.log('LP Asset added');
      })
      .catch((e) => {
        console.log('Error Adding lp asset: ', e);
      });
  });
  program.addEventListener('ReInsuranceProposalProposed', (res: IReInsuranceProposalProposed, _, signature) => {
    checkTransactionSignature(signature);
    reinsuranceProposalCreated(res)
      .then(() => {
        console.log('Reinsurance proposal proposed');
      })
      .catch((e) => {
        console.log('Error proposing reinsurance proposal: ', e);
      });
  });
  program.addEventListener('ProposalSent', (res: IProposalSent, _, signature) => {
    checkTransactionSignature(signature);
    reinsuranceProposalSent(res)
      .then(() => {
        console.log('reinsurance proposal sent');
      })
      .catch((e) => {
        console.log('Error sending reinsurance proposal: ', e);
      });
  });
  program.addEventListener('ReInsuranceProposalAccepted ', (res: IReInsuranceProposalAccepted, _, signature) => {
    checkTransactionSignature(signature);
    reinsuranceProposalAccepted(res)
      .then(() => {
        console.log('reinsurance proposal sent');
      })
      .catch((e) => {
        console.log('Error sending reinsurance proposal: ', e);
      });
  });
};
