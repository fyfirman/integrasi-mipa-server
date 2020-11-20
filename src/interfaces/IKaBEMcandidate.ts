interface MissionItem {
  title: string;
  desc: string;
}

interface CandidateProfile {
  name: string;
  npm: string;
  batchYear: number;
}

export interface IKaBEMcandidate {
  _id: string;
  number: number;
  chairman: CandidateProfile;
  viceChairman: CandidateProfile;
  vision: string;
  mission: MissionItem[];
  photoPath: string;
  proker: string[];
}

export interface IKaBEMcandidateDTO {
  number: number;
  chairman: CandidateProfile;
  viceChairman: CandidateProfile;
  vision: string;
  mission: MissionItem[];
  photoPath: string;
  proker: string[];
}
