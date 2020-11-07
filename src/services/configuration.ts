import { Service, Inject } from 'typedi';
import { IConfiguration, IConfigurationDTO } from '../interfaces/IConfiguration';
import { RestError } from '../helpers/error';

@Service()
export default class ConfigurationService {
  @Inject('configurationModel') private configurationModel;

  public async getAll(): Promise<IConfiguration[]> {
    try {
      return this.configurationModel.find({});
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async get(id: IConfiguration['_id']): Promise<IConfiguration> {
    try {
      return this.configurationModel.findById(id);
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async getByName(configName: IConfiguration['configName']): Promise<IConfiguration> {
    try {
      return this.configurationModel.findOne({ configName });
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async create(configuration: IConfigurationDTO): Promise<IConfiguration> {
    try {
      return this.configurationModel.create(configuration);
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async edit(configuration: IConfigurationDTO): Promise<IConfiguration> {
    try {
      const result = await this.configurationModel.updateOne(
        { configName: configuration.configName },
        { $set: configuration },
      );
      if (result.ok === 0) {
        throw new RestError(404, 'Configuration record not found');
      }

      return this.getByName(configuration.configName);
    } catch (error) {
      throw new RestError(500, `An error occured : ${error.message}`);
    }
  }

  public async delete(_id: string): Promise<boolean> {
    try {
      const result = await this.configurationModel.deleteOne({ _id });
      if (result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (error) {
      throw new RestError(400, error.message);
    }
  }
}
