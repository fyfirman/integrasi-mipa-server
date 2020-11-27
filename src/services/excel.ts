/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import ExcelJS from 'exceljs';
import { INewVoteResult } from '../interfaces/IVote';

@Service()
export default class ExcelService {
  private init(): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'integrasi-mipa';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    return workbook;
  }

  public getTotalWorkbook(data: INewVoteResult[]): ExcelJS.Workbook {
    const workbook = this.init();

    const result = [];

    let acumulateTotal = 0;
    data.forEach((value, index) => {
      acumulateTotal += value.total;
      result.push({
        dayOf: index + 1,
        date: value._id.date,
        verifiedVoteCount: value.totalVerified,
        unverifiedVoteCount: value.totalUnverified,
        voteCount: value.total,
        acumulateVoteCount: acumulateTotal,
      });
    });

    const worksheet = workbook.addWorksheet('total');

    worksheet.columns = [
      { header: 'Hari ke-', key: 'dayOf', width: 8 },
      { header: 'Tanggal', key: 'date', width: 11 },
      { header: 'Jumlah Suara Ditolak/Belum Diverifikasi', key: 'unverifiedVoteCount', width: 10 },
      { header: 'Jumlah Suara Terverifikasi', key: 'verifiedVoteCount', width: 10 },
      { header: 'Jumlah Suara Masuk', key: 'voteCount', width: 10 },
      { header: 'Akumulasi Suara Masuk', key: 'acumulateVoteCount', width: 10 },
    ];

    worksheet.addRows(result);

    return workbook;
  }

  public getBatchYearWorkbook(data: INewVoteResult[]): ExcelJS.Workbook {
    const getExistBatchYear = (): string[] => {
      const batchYears = [];
      data.forEach((value) => {
        if (!batchYears.includes(value._id.batchYear)) {
          batchYears.push(value._id.batchYear);
        }
      });
      return batchYears;
    };

    const formatData = (): any => {
      const result = [];
      let voteResult = {
        dayOf: 0,
        date: '',
        total: 0,
      };

      getExistBatchYear().forEach((batchYear) => {
        Object.assign(voteResult, { [batchYear]: 0 });
      });

      let i = -1;
      data.forEach((value, index) => {
        if (result.length !== 0) {
          if (value._id.date !== result[i].date) {
            voteResult = {
              dayOf: voteResult.dayOf + 1,
              date: value._id.date,
              total: value.totalVerified,
            };
            getExistBatchYear().forEach((batchYear) => {
              Object.assign(voteResult, { [batchYear]: 0 });
            });
            Object.assign(voteResult, { [value._id.batchYear]: value.totalVerified });
            result.push(voteResult);
            i += 1;
          } else {
            Object.assign(voteResult, { [value._id.batchYear]: value.totalVerified });
            voteResult.total += value.totalVerified;
          }
        } else {
          i = 0;
          voteResult = {
            dayOf: index + 1,
            date: value._id.date,
            total: value.totalVerified,
          };
          getExistBatchYear().forEach((batchYear) => {
            Object.assign(voteResult, { [batchYear]: 0 });
          });
          Object.assign(voteResult, { [value._id.batchYear]: value.totalVerified });
          result.push(voteResult);
        }
      });
      return result;
    };

    const setColumn = (): any => {
      const batchYears = getExistBatchYear();
      const columns = [
        { header: 'Hari ke-', key: 'dayOf', width: 8 },
        { header: 'Tanggal', key: 'date', width: 11 },
      ];
      batchYears.forEach((value) => {
        columns.push({ header: `Angkatan ${value}`, key: value, width: 15 });
      });
      columns.push({ header: 'Jumlah Suara Masuk', key: 'total', width: 17 });

      return columns;
    };

    const workbook = this.init();
    const worksheet = workbook.addWorksheet('angkatan');

    worksheet.columns = setColumn();
    worksheet.addRows(formatData());

    return workbook;
  }

  public getHimaWorkbook(data: INewVoteResult[]): ExcelJS.Workbook {
    const getExistHima = (): string[] => {
      const himaList = [];
      data.forEach((value) => {
        if (!himaList.includes(value._id.major)) {
          himaList.push(value._id.major);
        }
      });
      return himaList;
    };

    const formatData = (): any => {
      const result = [];
      let voteResult = {
        dayOf: 0,
        date: '',
        total: 0,
      };

      getExistHima().forEach((hima) => {
        Object.assign(voteResult, { [hima]: 0 });
      });

      let i = -1;
      data.forEach((value, index) => {
        if (result.length !== 0) {
          if (value._id.date !== result[i].date) {
            voteResult = {
              dayOf: voteResult.dayOf + 1,
              date: value._id.date,
              total: value.totalVerified,
            };
            getExistHima().forEach((hima) => {
              Object.assign(voteResult, { [hima]: 0 });
            });
            Object.assign(voteResult, { [value._id.major]: value.totalVerified });
            result.push(voteResult);
            i += 1;
          } else {
            Object.assign(voteResult, { [value._id.major]: value.totalVerified });
            voteResult.total += value.totalVerified;
          }
        } else {
          i = 0;
          voteResult = {
            dayOf: index + 1,
            date: value._id.date,
            total: value.totalVerified,
          };
          getExistHima().forEach((hima) => {
            Object.assign(voteResult, { [hima]: 0 });
          });
          Object.assign(voteResult, { [value._id.major]: value.totalVerified });
          result.push(voteResult);
        }
      });
      return result;
    };

    const setColumn = (): any => {
      const batchYears = getExistHima();
      const columns = [
        { header: 'Hari ke-', key: 'dayOf', width: 8 },
        { header: 'Tanggal', key: 'date', width: 11 },
      ];
      batchYears.forEach((value) => {
        columns.push({ header: `Himpunan ${value}`, key: value, width: 15 });
      });
      columns.push({ header: 'Jumlah Suara Masuk', key: 'total', width: 17 });

      return columns;
    };

    const workbook = this.init();
    const worksheet = workbook.addWorksheet('himpunan');

    worksheet.columns = setColumn();
    worksheet.addRows(formatData());

    return workbook;
  }

  public getCandidateWorkbook(data: INewVoteResult[]): ExcelJS.Workbook {
    const getExistCandidate = (): string[] => {
      const candidates = [];
      data.forEach((value) => {
        if (!candidates.includes(`${value.candidateNumber} - ${value.candidateName}`)) {
          candidates.push(`${value.candidateNumber} - ${value.candidateName}`);
        }
      });
      return candidates;
    };

    const formatData = (): any => {
      const emptyBox = '0 - Kotak Kosong';
      const assignZeroToEach = (result) => {
        getExistCandidate().forEach((candidate) => {
          Object.assign(result, { [candidate]: 0 });
        });
      };

      const result = [];
      let voteResult = {
        dayOf: 0,
        date: '',
        [emptyBox]: 0,
        total: 0,
      };
      assignZeroToEach(voteResult);

      let i = 0;
      data.forEach((value) => {
        const assignResult = () => {
          if (value.candidateNumber !== 0) {
            Object.assign(voteResult, {
              [`${value.candidateNumber} - ${value.candidateName}`]: value.totalVerified,
            });
            voteResult[emptyBox] += value.totalUnverified;
          } else {
            voteResult[emptyBox] += value.total;
          }
        };

        // If date is not exist OR not first value, then create new rows
        if (value._id.date !== (result.length !== 0 ? result[i - 1].date : false)) {
          voteResult = {
            dayOf: i + 1,
            date: value._id.date,
            [emptyBox]: 0,
            total: value.total,
          };
          assignZeroToEach(voteResult);
          assignResult();
          result.push(voteResult);
          i += 1;
        } else {
          // If date is exist, then fill atribute
          assignResult();
          voteResult.total += value.total;
          result[i - 1] = voteResult;
        }
      });
      return result;
    };

    const setColumn = (): any => {
      const candidates = getExistCandidate();
      const columns = [
        { header: 'Hari ke-', key: 'dayOf', width: 8 },
        { header: 'Tanggal', key: 'date', width: 11 },
      ];
      candidates.forEach((candidate) => {
        columns.push({ header: candidate, key: candidate, width: 15 });
      });
      columns.push({ header: 'Jumlah Suara Masuk', key: 'total', width: 17 });

      return columns;
    };

    const workbook = this.init();
    const worksheet = workbook.addWorksheet('calon');

    worksheet.columns = setColumn();
    worksheet.addRows(formatData());

    return workbook;
  }
}
