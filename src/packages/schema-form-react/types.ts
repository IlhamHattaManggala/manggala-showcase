export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'toggle'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'date-range';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  options?: SelectOption[];
  colSpan?: number; // 1 to 12
  condition?: (values: Record<string, any>) => boolean;
  validate?: (value: any) => string | undefined;
}

export interface SchemaFormProps {
  schema: FormFieldSchema[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  submitText?: string;
  className?: string;
}
