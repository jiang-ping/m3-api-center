import { useState } from 'preact/hooks';
import { Metadata } from '../types/metadata';

interface Props {
  metadata: Metadata;
  onChange: (metadata: Metadata) => void;
}

export function JsonViewer({ metadata, onChange }: Props) {
  const [jsonText, setJsonText] = useState('');
  const [editMode, setEditMode] = useState(false);

  const enterEditMode = () => {
    setJsonText(JSON.stringify(metadata, null, 2));
    setEditMode(true);
  };

  const saveJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onChange(parsed);
      setEditMode(false);
      alert('JSON updated successfully!');
    } catch (e) {
      alert('Invalid JSON: ' + (e as Error).message);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setJsonText('');
  };

  return (
    <div class="section">
      <div class="section-header">
        <h2>JSON View</h2>
        {!editMode ? (
          <button class="btn btn-primary btn-small" onClick={enterEditMode}>
            Edit JSON
          </button>
        ) : (
          <div>
            <button class="btn btn-success btn-small" onClick={saveJson}>
              Save
            </button>
            {' '}
            <button class="btn btn-secondary btn-small" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {editMode ? (
        <div class="form-group">
          <textarea
            class="json-viewer"
            value={jsonText}
            onInput={(e) => setJsonText((e.target as HTMLTextAreaElement).value)}
            style={{ minHeight: '500px' }}
          />
        </div>
      ) : (
        <div class="json-viewer">
          {JSON.stringify(metadata, null, 2)}
        </div>
      )}
    </div>
  );
}
