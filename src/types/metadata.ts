// Metadata schema types
export type PrimitiveType = 'string' | 'number' | 'boolean';

export interface EnumType {
  kind: 'enum';
  name: string;
  values: (string | number)[];
}

export interface AliasType {
  kind: 'alias';
  name: string;
  baseType: PrimitiveType;
}

export interface ArrayType {
  kind: 'array';
  itemType: TypeReference;
}

export interface ObjectField {
  name: string;
  type: TypeReference;
  optional?: boolean;
}

export interface ObjectType {
  kind: 'object';
  name: string;
  fields: ObjectField[];
}

export type TypeReference = 
  | PrimitiveType 
  | { type: 'reference'; name: string }
  | ArrayType;

export type DataType = EnumType | AliasType | ObjectType;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpInterface {
  name: string;
  method: HttpMethod;
  path: string;
  urlParams?: ObjectField[];
  bodyType?: TypeReference;
  responseType?: TypeReference;
  headers?: string[];
  isSSE?: boolean;
}

export interface Metadata {
  dataTypes: DataType[];
  httpInterfaces: HttpInterface[];
}
