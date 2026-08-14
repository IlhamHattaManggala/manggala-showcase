import React, { useState } from 'react';
import { SchemaForm } from '@manggala31/schema-form-react';
import { mockSchemaForm } from '../mock/demoData';
import { CodeSnippetViewer } from '../components/CodeSnippetViewer';
import { InstallBadge } from '../components/InstallBadge';
import { FormInput, CheckCircle2 } from 'lucide-react';

const reactCode = `import { SchemaForm } from '@manggala31/schema-form-react';
import '@manggala31/schema-form-react/styles.css';

const schema = [
  { name: 'appName', label: 'App Name', type: 'text', required: true },
  { name: 'env', label: 'Environment', type: 'select',
    options: [{ label: 'Production', value: 'prod' }] },
  { name: 'maintenance', label: 'Maintenance Mode', type: 'toggle' }
];

<SchemaForm
  schema={schema}
  initialValues={{ appName: 'My App' }}
  onSubmit={(values) => saveToApi(values)}
  submitText="Save Settings"
/>`;

const phpCode = `<?php
use Manggala\\Settings\\SettingsSchema;
use Manggala\\Settings\\Fields\\Text;
use Manggala\\Settings\\Fields\\Select;

class GeneralSettingsSchema extends SettingsSchema
{
    public function schema(): array
    {
        return [
            Text::make('appName', 'Application Name')->required(),
            Select::make('environment', 'Environment Mode')
                ->options(['production' => 'Production', 'staging' => 'Staging']),
            Toggle::make('maintenanceMode', 'Maintenance Mode'),
        ];
    }
}`;

export const SchemaFormDemoView: React.FC = () => {
  const [output, setOutput] = useState<Record<string, unknown> | null>(null);

  return (
    <div className="space-y-6">
      <div className="view-header">
        <div>
          <div className="view-title">
            <FormInput size={20} style={{ color: 'var(--accent)' }} />
            <h1>Schema Form</h1>
            <span className="tag tag-blue">React</span>
          </div>
          <p className="view-subtitle">JSON Schema-driven dynamic form generator with validation, toggles, selects, and textareas.</p>
        </div>
        <div className="install-row">
          <InstallBadge command="npm i @manggala31/schema-form-react" type="npm" />
          <InstallBadge command="composer require manggala/laravel-settings" type="composer" />
        </div>
      </div>

      <CodeSnippetViewer
        title="Dynamic Form Builder Sandbox"
        reactCode={reactCode}
        laravelCode={phpCode}
        previewContent={
          <div className="grid-5-7" style={{ alignItems: 'start' }}>
            {/* Form */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <SchemaForm
                schema={mockSchemaForm}
                onSubmit={vals => setOutput(vals)}
                submitText="Submit Form"
                initialValues={{ appName: 'Manggala Production SaaS', adminEmail: 'admin@manggala.dev', environment: 'production', enableSpotlight: true }}
              />
            </div>

            {/* Output */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 12 }}>
                <CheckCircle2 size={13} /> Output State
              </div>
              {output ? (
                <pre style={{ fontSize: 11, color: '#7dd3fc', lineHeight: 1.7, margin: 0 }}>
                  {JSON.stringify(output, null, 2)}
                </pre>
              ) : (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.7 }}>
                  Fill out the form and click "Submit Form" to see the real-time output payload.
                </p>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};
