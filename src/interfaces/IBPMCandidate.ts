export interface IBPMCandidate {
  _id: string;
  name: string;
  major: string;
  batchYear: number;
  photoPath: string;
}

export interface IBPMCandidateDTO {
  name: string;
  major: string;
  batchYear: number;
  photoPath: string;
}
