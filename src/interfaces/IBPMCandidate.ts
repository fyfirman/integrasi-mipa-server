interface MissionItem {
  title: string;
  desc: string;
}

export interface IBPMCandidate {
  _id: string;
  number: number;
  name: string;
  npm: string;
  major: string;
  vision: string;
  mission: MissionItem[];
  batchYear: number;
  photoPath: string;
}

export interface IBPMCandidateDTO {
  number: number;
  name: string;
  npm: string;
  major: string;
  vision: string;
  mission: MissionItem[];
  batchYear: number;
  photoPath: string;
}
