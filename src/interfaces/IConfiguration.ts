export interface IConfiguration {
  _id: string;
  configName: string;
  isActive: boolean;
}

export interface IConfigurationDTO {
  configName: string;
  isActive: boolean;
}
