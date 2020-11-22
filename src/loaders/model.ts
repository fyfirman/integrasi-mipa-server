import {
  userModel,
  cardVerificationModel,
  kaBEMcandidateModel,
  BPMCandidateModel,
  kaHimCandidateModel,
  voteModel,
  configurationModel,
  dumpPasswordModel,
} from '../models';

const models = [
  {
    name: 'userModel',
    model: userModel,
  },
  {
    name: 'cardVerificationModel',
    model: cardVerificationModel,
  },
  {
    name: 'kaBEMcandidateModel',
    model: kaBEMcandidateModel,
  },
  {
    name: 'BPMCandidateModel',
    model: BPMCandidateModel,
  },
  {
    name: 'kaHimCandidateModel',
    model: kaHimCandidateModel,
  },
  {
    name: 'voteModel',
    model: voteModel,
  },
  {
    name: 'configurationModel',
    model: configurationModel,
  },
  {
    name: 'dumpPasswordModel',
    model: dumpPasswordModel,
  },
];

export default models;
