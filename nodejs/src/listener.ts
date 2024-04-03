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
  IStrategyProposed,
  IStrategyVoted,
  IStrategyAccepted,
  IStrategyBlocked,
  IStrategyExecuted,
  IClaimRaised,
  IClaimVoted,
  IClaimDecisionReleased,
  IReInsuranceClaimed,
} from './events';
import { checkTransactionSignature } from './utils';
import { lpCreated } from './handlers/lpCreated';
import { lpAssetAdded } from './handlers/lpAssetAdded';
import { reinsuranceProposalCreated } from './handlers/reinsuranceProposalCreated';
import { reinsuranceProposalSent } from './handlers/reinsuranceproposalSent';
import { reinsuranceProposalAccepted } from './handlers/reinsuranceProposalAccepted';
import { strategyProposed } from './handlers/strategyProposed';
import { strategyProposalVoted } from './handlers/strategyVoted';
import { strategyAccepted } from './handlers/strategyAccepted';
import { strategyBlocked } from './handlers/strategyBlocked';
import { strategyExecuted } from './handlers/strategyExecuted';
import { claimRaised } from './handlers/claimRaised';
import { claimVoted } from './handlers/claimVoted';
import { claimDecisionReleased } from './handlers/claimDecision';
import { claimMoneySent } from './handlers/claimMoneySent';

export const addEventListener = (program: anchor.Program<Insurance>) => {
  program.addEventListener('InsurerRegistered', (res: IInsurerRegistered, _, signature) => {
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
  program.addEventListener('StrategyProposed ', (res: IStrategyProposed, _, signature) => {
    checkTransactionSignature(signature);
    strategyProposed(res)
      .then(() => {
        console.log('strategy proposal loggeed');
      })
      .catch((e) => {
        console.log('Error sending proposing strategy: ', e);
      });
  });
  program.addEventListener('StrategyVoted ', (res: IStrategyVoted, _, signature) => {
    checkTransactionSignature(signature);
    strategyProposalVoted(res)
      .then(() => {
        console.log('strategy vote sent');
      })
      .catch((e) => {
        console.log('Error sending strategy vote: ', e);
      });
  });
  program.addEventListener('StrategyAccepted ', (res: IStrategyAccepted, _, signature) => {
    checkTransactionSignature(signature);
    strategyAccepted(res)
      .then(() => {
        console.log('strategy accepted');
      })
      .catch((e) => {
        console.log('Error accepting strategy: ', e);
      });
  });
  program.addEventListener('StrategyBlocked ', (res: IStrategyBlocked, _, signature) => {
    checkTransactionSignature(signature);
    strategyBlocked(res)
      .then(() => {
        console.log('strategy blocked');
      })
      .catch((e) => {
        console.log('Error blocking strategy: ', e);
      });
  });
  program.addEventListener('StrategyExecuted ', (res: IStrategyExecuted, _, signature) => {
    checkTransactionSignature(signature);
    strategyExecuted(res)
      .then(() => {
        console.log('strategy executed');
      })
      .catch((e) => {
        console.log('Error executing strategy: ', e);
      });
  });
  program.addEventListener('ClaimRaised ', (res: IClaimRaised, _, signature) => {
    checkTransactionSignature(signature);
    claimRaised(res)
      .then(() => {
        console.log('claim raised');
      })
      .catch((e) => {
        console.log('Error raising claim: ', e);
      });
  });
  program.addEventListener('ClaimVoted', (res: IClaimVoted, _, signature) => {
    checkTransactionSignature(signature);
    claimVoted(res)
      .then(() => {
        console.log('claim voted');
      })
      .catch((e) => {
        console.log('Error voting claim: ', e);
      });
  });
  program.addEventListener('ClaimDecisionReleased', (res: IClaimDecisionReleased, _, signature) => {
    checkTransactionSignature(signature);
    claimDecisionReleased(res)
      .then(() => {
        console.log('claim decision released');
      })
      .catch((e) => {
        console.log('Error releasing claim decision: ', e);
      });
  });
  program.addEventListener('ReInsuranceClaimed', (res: IReInsuranceClaimed, _, signature) => {
    checkTransactionSignature(signature);
    claimMoneySent(res)
      .then(() => {
        console.log('claim decision released');
      })
      .catch((e) => {
        console.log('Error releasing claim decision: ', e);
      });
  });
};
