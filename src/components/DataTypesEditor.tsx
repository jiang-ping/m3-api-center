import { DataType, EnumType, AliasType, ObjectType, ObjectField, TypeReference } from '../types/metadata';

interface Props {
  dataTypes: DataType[];
  onChange: (dataTypes: DataType[]) => void;
}

export function DataTypesEditor({ dataTypes, onChange }: Props) {
  const addEnum = () => {
    const newEnum: EnumType = {
      kind: 'enum',
      name: 'NewEnum',
      values: ['value1', 'value2']
    };
    onChange([...dataTypes, newEnum]);
  };

  const addAlias = () => {
    const newAlias: AliasType = {
      kind: 'alias',
      name: 'NewAlias',
      baseType: 'string'
    };
    onChange([...dataTypes, newAlias]);
  };

  const addObject = () => {
    const newObject: ObjectType = {
      kind: 'object',
      name: 'NewObject',
      fields: []
    };
    onChange([...dataTypes, newObject]);
  };

  const updateDataType = (index: number, updated: DataType) => {
    const newTypes = [...dataTypes];
    newTypes[index] = updated;
    onChange(newTypes);
  };

  const deleteDataType = (index: number) => {
    onChange(dataTypes.filter((_, i) => i !== index));
  };

  return (
    <div class="section">
      <div class="section-header">
        <h2>Data Types</h2>
        <div>
          <button class="btn btn-primary btn-small" onClick={addEnum}>
            Add Enum
          </button>
          {' '}
          <button class="btn btn-primary btn-small" onClick={addAlias}>
            Add Alias
          </button>
          {' '}
          <button class="btn btn-primary btn-small" onClick={addObject}>
            Add Object
          </button>
        </div>
      </div>

      {dataTypes.length === 0 && (
        <div class="empty-state">
          No data types defined. Click "Add Enum", "Add Alias", or "Add Object" to get started.
        </div>
      )}

      {dataTypes.map((dataType, index) => (
        <div key={index} class="card">
          {dataType.kind === 'enum' && (
            <EnumEditor
              enumType={dataType}
              onChange={(updated) => updateDataType(index, updated)}
              onDelete={() => deleteDataType(index)}
            />
          )}
          {dataType.kind === 'alias' && (
            <AliasEditor
              aliasType={dataType}
              onChange={(updated) => updateDataType(index, updated)}
              onDelete={() => deleteDataType(index)}
            />
          )}
          {dataType.kind === 'object' && (
            <ObjectEditor
              objectType={dataType}
              onChange={(updated) => updateDataType(index, updated)}
              onDelete={() => deleteDataType(index)}
              allTypes={dataTypes}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function EnumEditor({ enumType, onChange, onDelete }: {
  enumType: EnumType;
  onChange: (updated: EnumType) => void;
  onDelete: () => void;
}) {
  const addValue = () => {
    onChange({
      ...enumType,
      values: [...enumType.values, 'newValue']
    });
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...enumType.values];
    // Try to parse as number, otherwise keep as string
    newValues[index] = isNaN(Number(value)) ? value : Number(value);
    onChange({ ...enumType, values: newValues });
  };

  const deleteValue = (index: number) => {
    onChange({
      ...enumType,
      values: enumType.values.filter((_, i) => i !== index)
    });
  };

  return (
    <>
      <div class="card-header">
        <div>
          <span class="badge badge-enum">ENUM</span>
          {' '}
          <span class="card-title">{enumType.name}</span>
        </div>
        <button class="btn btn-danger btn-small" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div class="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={enumType.name}
          onInput={(e) => onChange({ ...enumType, name: (e.target as HTMLInputElement).value })}
        />
      </div>

      <div class="form-group">
        <label>Values:</label>
        <div class="list-container">
          {enumType.values.map((value, index) => (
            <div key={index} class="list-item">
              <input
                type="text"
                value={String(value)}
                onInput={(e) => updateValue(index, (e.target as HTMLInputElement).value)}
              />
              <button class="btn btn-danger btn-small" onClick={() => deleteValue(index)}>
                Remove
              </button>
            </div>
          ))}
          <button class="btn btn-secondary btn-small" onClick={addValue}>
            Add Value
          </button>
        </div>
      </div>
    </>
  );
}

function AliasEditor({ aliasType, onChange, onDelete }: {
  aliasType: AliasType;
  onChange: (updated: AliasType) => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div class="card-header">
        <div>
          <span class="badge badge-alias">ALIAS</span>
          {' '}
          <span class="card-title">{aliasType.name}</span>
        </div>
        <button class="btn btn-danger btn-small" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div class="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={aliasType.name}
          onInput={(e) => onChange({ ...aliasType, name: (e.target as HTMLInputElement).value })}
        />
      </div>

      <div class="form-group">
        <label>Base Type:</label>
        <select
          value={aliasType.baseType}
          onChange={(e) => onChange({ ...aliasType, baseType: (e.target as HTMLSelectElement).value as any })}
        >
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
        </select>
      </div>
    </>
  );
}

function ObjectEditor({ objectType, onChange, onDelete, allTypes }: {
  objectType: ObjectType;
  onChange: (updated: ObjectType) => void;
  onDelete: () => void;
  allTypes: DataType[];
}) {
  const addField = () => {
    onChange({
      ...objectType,
      fields: [...objectType.fields, { name: 'newField', type: 'string' }]
    });
  };

  const updateField = (index: number, field: ObjectField) => {
    const newFields = [...objectType.fields];
    newFields[index] = field;
    onChange({ ...objectType, fields: newFields });
  };

  const deleteField = (index: number) => {
    onChange({
      ...objectType,
      fields: objectType.fields.filter((_, i) => i !== index)
    });
  };

  return (
    <>
      <div class="card-header">
        <div>
          <span class="badge badge-object">OBJECT</span>
          {' '}
          <span class="card-title">{objectType.name}</span>
        </div>
        <button class="btn btn-danger btn-small" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div class="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={objectType.name}
          onInput={(e) => onChange({ ...objectType, name: (e.target as HTMLInputElement).value })}
        />
      </div>

      <div class="form-group">
        <label>Fields:</label>
        <div class="field-list">
          {objectType.fields.map((field, index) => (
            <FieldEditor
              key={index}
              field={field}
              allTypes={allTypes}
              onChange={(updated) => updateField(index, updated)}
              onDelete={() => deleteField(index)}
            />
          ))}
          <button class="btn btn-secondary btn-small" onClick={addField}>
            Add Field
          </button>
        </div>
      </div>
    </>
  );
}

function FieldEditor({ field, allTypes, onChange, onDelete }: {
  field: ObjectField;
  allTypes: DataType[];
  onChange: (updated: ObjectField) => void;
  onDelete: () => void;
}) {
  const typeString = typeof field.type === 'string' ? field.type : 
    'kind' in field.type ? 'array' : field.type.name;

  const updateType = (newType: string) => {
    if (newType === 'array') {
      onChange({ ...field, type: { kind: 'array', itemType: 'string' } });
    } else if (['string', 'number', 'boolean'].includes(newType)) {
      onChange({ ...field, type: newType as any });
    } else {
      onChange({ ...field, type: { type: 'reference', name: newType } });
    }
  };

  const updateArrayItemType = (itemType: string) => {
    if ('kind' in field.type && field.type.kind === 'array') {
      const newItemType = ['string', 'number', 'boolean'].includes(itemType)
        ? itemType as any
        : { type: 'reference', name: itemType };
      onChange({ ...field, type: { kind: 'array', itemType: newItemType } });
    }
  };

  return (
    <div class="field-item">
      <input
        type="text"
        placeholder="Field name"
        value={field.name}
        onInput={(e) => onChange({ ...field, name: (e.target as HTMLInputElement).value })}
      />
      <select value={typeString} onChange={(e) => updateType((e.target as HTMLSelectElement).value)}>
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="boolean">boolean</option>
        <option value="array">array</option>
        {allTypes.map(dt => (
          <option key={dt.name} value={dt.name}>{dt.name}</option>
        ))}
      </select>
      {'kind' in field.type && field.type.kind === 'array' && (
        <select
          value={typeof field.type.itemType === 'string' ? field.type.itemType : 
            'type' in field.type.itemType ? field.type.itemType.name : 'string'}
          onChange={(e) => updateArrayItemType((e.target as HTMLSelectElement).value)}
        >
          <option value="string">string[]</option>
          <option value="number">number[]</option>
          <option value="boolean">boolean[]</option>
          {allTypes.map(dt => (
            <option key={dt.name} value={dt.name}>{dt.name}[]</option>
          ))}
        </select>
      )}
      <label class="checkbox-group">
        <input
          type="checkbox"
          checked={field.optional || false}
          onChange={(e) => onChange({ ...field, optional: (e.target as HTMLInputElement).checked })}
        />
        Optional
      </label>
      <button class="btn btn-danger btn-small" onClick={onDelete}>
        ×
      </button>
    </div>
  );
}
