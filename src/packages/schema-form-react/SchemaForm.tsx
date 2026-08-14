import React from 'react';
import type { SchemaFormProps, FormFieldSchema } from './types';
import { useSchemaForm } from './useSchemaForm';

export const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  submitText = 'Submit',
  className = '',
}) => {
  const { values, errors, setFieldValue, validate } = useSchemaForm(schema, initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  const renderFieldInput = (field: FormFieldSchema) => {
    const val = values[field.name] ?? '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            className="schema-form-input schema-form-textarea"
            placeholder={field.placeholder}
            value={val}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            className="schema-form-input schema-form-select"
            value={val}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
          >
            <option value="">Select option...</option>
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <label className="schema-form-toggle-wrap">
            <input
              type="checkbox"
              className="schema-form-toggle-checkbox"
              checked={Boolean(values[field.name])}
              onChange={(e) => setFieldValue(field.name, e.target.checked)}
            />
            <span className="schema-form-toggle-slider" />
          </label>
        );

      case 'checkbox':
        return (
          <label className="schema-form-checkbox-wrap">
            <input
              type="checkbox"
              className="schema-form-checkbox"
              checked={Boolean(values[field.name])}
              onChange={(e) => setFieldValue(field.name, e.target.checked)}
            />
            <span>{field.placeholder || field.label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="schema-form-radio-group">
            {field.options?.map((opt) => (
              <label key={String(opt.value)} className="schema-form-radio-label">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={values[field.name] === opt.value}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            id={field.name}
            type={field.type}
            className="schema-form-input"
            placeholder={field.placeholder}
            value={val}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <form className={`schema-form ${className}`} onSubmit={handleSubmit}>
      {schema.map((field) => {
        const hasError = Boolean(errors[field.name]);
        return (
          <div
            key={field.name}
            className={`schema-form-group ${hasError ? 'schema-form-group-error' : ''}`}
          >
            <label htmlFor={field.name} className="schema-form-label">
              {field.label}
              {field.required && <span className="schema-form-required">*</span>}
            </label>

            {field.description && (
              <div className="schema-form-desc">{field.description}</div>
            )}

            <div className="schema-form-control-wrap">{renderFieldInput(field)}</div>

            {hasError && <div className="schema-form-error-msg">{errors[field.name]}</div>}
          </div>
        );
      })}

      <button type="submit" className="schema-form-submit-btn">
        {submitText}
      </button>
    </form>
  );
};
