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
        voteCount: value.total,
        acumulateVoteCount: acumulateTotal,
      });
    });

    const worksheet = workbook.addWorksheet('total');

    worksheet.columns = [
      { header: 'Hari ke-', key: 'dayOf', width: 8 },
      { header: 'Tanggal', key: 'date', width: 11 },
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
              total: value.total,
            };
            getExistBatchYear().forEach((batchYear) => {
              Object.assign(voteResult, { [batchYear]: 0 });
            });
            Object.assign(voteResult, { [value._id.batchYear]: value.total });
            result.push(voteResult);
            i += 1;
          } else {
            Object.assign(voteResult, { [value._id.batchYear]: value.total });
            voteResult.total += value.total;
          }
        } else {
          i = 0;
          voteResult = {
            dayOf: index + 1,
            date: value._id.date,
            total: value.total,
          };
          getExistBatchYear().forEach((batchYear) => {
            Object.assign(voteResult, { [batchYear]: 0 });
          });
          Object.assign(voteResult, { [value._id.batchYear]: value.total });
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
              total: value.total,
            };
            getExistHima().forEach((hima) => {
              Object.assign(voteResult, { [hima]: 0 });
            });
            Object.assign(voteResult, { [value._id.major]: value.total });
            result.push(voteResult);
            i += 1;
          } else {
            Object.assign(voteResult, { [value._id.major]: value.total });
            voteResult.total += value.total;
          }
        } else {
          i = 0;
          voteResult = {
            dayOf: index + 1,
            date: value._id.date,
            total: value.total,
          };
          getExistHima().forEach((hima) => {
            Object.assign(voteResult, { [hima]: 0 });
          });
          Object.assign(voteResult, { [value._id.major]: value.total });
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
}
