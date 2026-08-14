import { useState, useCallback } from 'react';
import { FormFieldSchema } from './types';

export function useSchemaForm(
  schema: FormFieldSchema[],
  initialValues: Record<string, any> = {}
) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (prev[name]) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return prev;
    });
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    schema.forEach((field) => {
      const val = values[field.name];

      if (field.required && (val === undefined || val === null || val === '')) {
        newErrors[field.name] = `${field.label} is required.`;
        return;
      }

      if (field.type === 'number' && val !== undefined && val !== '') {
        const num = Number(val);
        if (field.min !== undefined && num < field.min) {
          newErrors[field.name] = `${field.label} must be at least ${field.min}.`;
        }
        if (field.max !== undefined && num > field.max) {
          newErrors[field.name] = `${field.label} cannot exceed ${field.max}.`;
        }
      }

      if (field.pattern && val) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(String(val))) {
          newErrors[field.name] = `${field.label} format is invalid.`;
        }
      }

      if (field.validate) {
        const customErr = field.validate(val);
        if (customErr) {
          newErrors[field.name] = customErr;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [schema, values]);

  return {
    values,
    errors,
    setFieldValue,
    validate,
    setValues,
  };
}
