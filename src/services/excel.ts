/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import ExcelJS from 'exceljs';
import { values } from 'lodash';
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

  // public getBatchYearWorkbook(data: INewVoteResult[]): ExcelJS.Workbook {
  //   const workbook = this.init();

  //   const worksheet = workbook.addWorksheet('angkatan');

  //   const batchYears = [];
  //   data.forEach((value) => {
  //     if (!batchYears.includes(value._id.batchYear)) {
  //       batchYears.push(value._id.batchYear);
  //     }
  //   });

  //   worksheet.columns = [
  //     { header: 'Hari ke-', key: 'dayOf', width: 8 },
  //     { header: 'Tanggal', key: 'date', width: 11 },
  //     { header: 'Angkatan ', key: 'date', width: 11 },
  //   ];

  //   batchYears.forEach((value) => {
  //     worksheet.columns.push({ header: `Angkatan ${value}`, key: value, width: 10 });
  //   });
  //   worksheet.columns.push({ header: 'Jumlah Suara Masuk', key: 'total', width: 10 });

  //   const result = [];
  //   const object = {};
  //   const voteCount = {};
  //   data.forEach((value, index) => {
  //     (object, {
  //       dayOf: index + 1,
  //       date: value._id.date,
  //       result: {},
  //       total: 0,
  //     });
  //     Object.assign(object, { [value._id.batchYear]: value.total });

  //     const expectedObject = {
  //       dayOf: 0,
  //       date: '20-20-2020',
  //       result: {
  //         2017: 62,
  //         2018: 63,
  //       },
  //       total: 125,
  //     };
  //     result.push();
  //   });

  //   worksheet.addRows(result);

  //   return workbook;
  // }
}
