import { PropertyCreateModel } from './propertyCreateModel';

export interface PropertyUpdateModel extends PropertyCreateModel {
  id: string;
  imageIdsDelete?: string[];
}
