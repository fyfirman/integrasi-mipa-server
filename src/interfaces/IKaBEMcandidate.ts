export interface IKaBEMcandidate {
  _id: string;
  number: number;
  chairman: {
    name: string;
    npm: string;
    batchYear: number;
  };
  viceChairman: {
    name: string;
    npm: string;
    batchYear: number;
  };
  vision: string;
  mission: string[];
  photoPath: string;
}

export interface IKaBEMcandidateDTO {
  number: number;
  chairman: {
    name: string;
    npm: string;
    batchYear: number;
  };
  viceChairman: {
    name: string;
    npm: string;
    batchYear: number;
  };
  vision: string;
  mission: string[];
  photoPath: string;
}
