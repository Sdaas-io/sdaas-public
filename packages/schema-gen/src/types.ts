export type FieldType =
  | "string"
  | "integer"
  | "float"
  | "boolean"
  | "date"
  | "datetime"
  | "uuid"
  | "email"
  | "phone"
  | "enum"
  | "text";

export interface FieldSpec {
  name: string;
  type: FieldType;
  nullable?: boolean;
  unique?: boolean;
  description?: string;
  /** For enum fields */
  values?: string[];
  /** Rough cardinality / distinct count hint (for manifest stats) */
  cardinality?: number;
}

export interface SchemaGenInput {
  datasetName: string;
  description?: string;
  fields: FieldSpec[];
  /** Approximate total row count (used in manifest metadata) */
  rowCount?: number;
}

export interface ManifestScaffold {
  dataset_name: string;
  description?: string;
  row_count?: number;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    unique: boolean;
    description?: string;
    values?: string[];
    cardinality?: number;
  }>;
  generated_at: string;
}
