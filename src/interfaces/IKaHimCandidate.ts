interface MissionItem {
  title: string;
  desc: string;
}

interface CandidateProfile {
  name: string;
  npm: string;
  batchYear: number;
}

export interface IKaHimCandidate {
  _id: string;
  number: number;
  major: string;
  chairman: CandidateProfile;
  vision: string;
  mission: MissionItem[];
  photoPath: string;
}

export interface IKaHimCandidateDTO {
  number: number;
  major: string;
  chairman: CandidateProfile;
  vision: string;
  mission: MissionItem[];
  photoPath: string;
}
