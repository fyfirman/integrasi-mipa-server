import { IKaHimCandidate } from './IKaHimCandidate';
import { IKaBEMcandidate } from './IKaBEMcandidate';
import { IBPMCandidate } from './IBPMCandidate';
import { IUser } from './IUser';

export interface IVote {
  _id: string;
  userId: IUser['_id'];
  candidateId: IKaBEMcandidate['_id'] | IKaHimCandidate['_id'] | IBPMCandidate['_id'];
  type: string;
  isVerified: boolean;
}

export interface IVoteDTO {
  userId: IUser['_id'];
  candidateId: IKaBEMcandidate['_id'] | IKaHimCandidate['_id'] | IBPMCandidate['_id'];
  type: string;
}

export interface IVoteTotalResult {
  _id: IKaBEMcandidate['_id'] | IKaHimCandidate['_id'] | IBPMCandidate['_id'];
  total: number;
  totalUnverified: number;
  totalVerified: number;
}

export interface IVoteResult extends IVoteTotalResult {
  candidate: IKaBEMcandidate | IKaHimCandidate | IBPMCandidate;
}

export interface IVoteStatus {
  bem: boolean;
  bpm: boolean;
  hima: boolean;
}
