import { HttpInterface, HttpMethod, DataType, ObjectField, TypeReference } from '../types/metadata';

interface Props {
  httpInterfaces: HttpInterface[];
  dataTypes: DataType[];
  onChange: (httpInterfaces: HttpInterface[]) => void;
}

export function HttpInterfacesEditor({ httpInterfaces, dataTypes, onChange }: Props) {
  const addInterface = () => {
    const newInterface: HttpInterface = {
      name: 'newApi',
      method: 'GET',
      path: '/api/endpoint'
    };
    onChange([...httpInterfaces, newInterface]);
  };

  const updateInterface = (index: number, updated: HttpInterface) => {
    const newInterfaces = [...httpInterfaces];
    newInterfaces[index] = updated;
    onChange(newInterfaces);
  };

  const deleteInterface = (index: number) => {
    onChange(httpInterfaces.filter((_, i) => i !== index));
  };

  return (
    <div class="section">
      <div class="section-header">
        <h2>HTTP Interfaces</h2>
        <button class="btn btn-primary btn-small" onClick={addInterface}>
          Add Interface
        </button>
      </div>

      {httpInterfaces.length === 0 && (
        <div class="empty-state">
          No HTTP interfaces defined. Click "Add Interface" to get started.
        </div>
      )}

      {httpInterfaces.map((httpInterface, index) => (
        <div key={index} class="card">
          <InterfaceEditor
            httpInterface={httpInterface}
            dataTypes={dataTypes}
            onChange={(updated) => updateInterface(index, updated)}
            onDelete={() => deleteInterface(index)}
          />
        </div>
      ))}
    </div>
  );
}

function InterfaceEditor({ httpInterface, dataTypes, onChange, onDelete }: {
  httpInterface: HttpInterface;
  dataTypes: DataType[];
  onChange: (updated: HttpInterface) => void;
  onDelete: () => void;
}) {
  const addUrlParam = () => {
    const urlParams = httpInterface.urlParams || [];
    onChange({
      ...httpInterface,
      urlParams: [...urlParams, { name: 'param', type: 'string' }]
    });
  };

  const updateUrlParam = (index: number, param: ObjectField) => {
    const urlParams = [...(httpInterface.urlParams || [])];
    urlParams[index] = param;
    onChange({ ...httpInterface, urlParams });
  };

  const deleteUrlParam = (index: number) => {
    const urlParams = (httpInterface.urlParams || []).filter((_, i) => i !== index);
    onChange({ ...httpInterface, urlParams: urlParams.length > 0 ? urlParams : undefined });
  };

  const addHeader = () => {
    const headers = httpInterface.headers || [];
    onChange({
      ...httpInterface,
      headers: [...headers, 'Header-Name']
    });
  };

  const updateHeader = (index: number, value: string) => {
    const headers = [...(httpInterface.headers || [])];
    headers[index] = value;
    onChange({ ...httpInterface, headers });
  };

  const deleteHeader = (index: number) => {
    const headers = (httpInterface.headers || []).filter((_, i) => i !== index);
    onChange({ ...httpInterface, headers: headers.length > 0 ? headers : undefined });
  };

  const updateBodyType = (typeStr: string) => {
    if (!typeStr) {
      onChange({ ...httpInterface, bodyType: undefined });
    } else if (typeStr === 'array') {
      onChange({ ...httpInterface, bodyType: { kind: 'array', itemType: 'string' } });
    } else if (['string', 'number', 'boolean'].includes(typeStr)) {
      onChange({ ...httpInterface, bodyType: typeStr as any });
    } else {
      onChange({ ...httpInterface, bodyType: { type: 'reference', name: typeStr } });
    }
  };

  const updateResponseType = (typeStr: string) => {
    if (!typeStr) {
      onChange({ ...httpInterface, responseType: undefined });
    } else if (typeStr === 'array') {
      onChange({ ...httpInterface, responseType: { kind: 'array', itemType: 'string' } });
    } else if (['string', 'number', 'boolean'].includes(typeStr)) {
      onChange({ ...httpInterface, responseType: typeStr as any });
    } else {
      onChange({ ...httpInterface, responseType: { type: 'reference', name: typeStr } });
    }
  };

  const updateArrayBodyItemType = (itemType: string) => {
    if (httpInterface.bodyType && 'kind' in httpInterface.bodyType && httpInterface.bodyType.kind === 'array') {
      const newItemType = ['string', 'number', 'boolean'].includes(itemType)
        ? itemType as any
        : { type: 'reference', name: itemType };
      onChange({ ...httpInterface, bodyType: { kind: 'array', itemType: newItemType } });
    }
  };

  const updateArrayResponseItemType = (itemType: string) => {
    if (httpInterface.responseType && 'kind' in httpInterface.responseType && httpInterface.responseType.kind === 'array') {
      const newItemType = ['string', 'number', 'boolean'].includes(itemType)
        ? itemType as any
        : { type: 'reference', name: itemType };
      onChange({ ...httpInterface, responseType: { kind: 'array', itemType: newItemType } });
    }
  };

  const getTypeString = (type?: TypeReference): string => {
    if (!type) return '';
    if (typeof type === 'string') return type;
    if ('kind' in type) return 'array';
    return type.name;
  };

  const bodyTypeStr = getTypeString(httpInterface.bodyType);
  const responseTypeStr = getTypeString(httpInterface.responseType);

  return (
    <>
      <div class="card-header">
        <div>
          <span class={`method-badge method-${httpInterface.method}`}>
            {httpInterface.method}
          </span>
          {' '}
          <span class="card-title">{httpInterface.name}</span>
          {' '}
          <code>{httpInterface.path}</code>
          {httpInterface.isSSE && <span class="badge badge-enum">SSE</span>}
        </div>
        <button class="btn btn-danger btn-small" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div class="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={httpInterface.name}
          onInput={(e) => onChange({ ...httpInterface, name: (e.target as HTMLInputElement).value })}
        />
      </div>

      <div class="form-group">
        <label>Method:</label>
        <select
          value={httpInterface.method}
          onChange={(e) => onChange({ ...httpInterface, method: (e.target as HTMLSelectElement).value as HttpMethod })}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div class="form-group">
        <label>Path:</label>
        <input
          type="text"
          value={httpInterface.path}
          onInput={(e) => onChange({ ...httpInterface, path: (e.target as HTMLInputElement).value })}
          placeholder="/api/resource/:id"
        />
      </div>

      <div class="form-group">
        <label>URL Parameters:</label>
        <div class="field-list">
          {(httpInterface.urlParams || []).map((param, index) => (
            <div key={index} class="field-item">
              <input
                type="text"
                placeholder="Parameter name"
                value={param.name}
                onInput={(e) => updateUrlParam(index, { ...param, name: (e.target as HTMLInputElement).value })}
              />
              <select
                value={typeof param.type === 'string' ? param.type : 
                  'kind' in param.type ? 'array' : param.type.name}
                onChange={(e) => {
                  const val = (e.target as HTMLSelectElement).value;
                  const newType = ['string', 'number', 'boolean'].includes(val) ? val as any :
                    val === 'array' ? { kind: 'array', itemType: 'string' } as const :
                    { type: 'reference', name: val };
                  updateUrlParam(index, { ...param, type: newType });
                }}
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
                {dataTypes.map(dt => (
                  <option key={dt.name} value={dt.name}>{dt.name}</option>
                ))}
              </select>
              <button class="btn btn-danger btn-small" onClick={() => deleteUrlParam(index)}>
                ×
              </button>
            </div>
          ))}
          <button class="btn btn-secondary btn-small" onClick={addUrlParam}>
            Add URL Parameter
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Body Type:</label>
        <select value={bodyTypeStr} onChange={(e) => updateBodyType((e.target as HTMLSelectElement).value)}>
          <option value="">None</option>
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="array">array</option>
          {dataTypes.map(dt => (
            <option key={dt.name} value={dt.name}>{dt.name}</option>
          ))}
        </select>
        {httpInterface.bodyType && 'kind' in httpInterface.bodyType && httpInterface.bodyType.kind === 'array' && (
          <select
            value={typeof httpInterface.bodyType.itemType === 'string' ? httpInterface.bodyType.itemType :
              'type' in httpInterface.bodyType.itemType ? httpInterface.bodyType.itemType.name : 'string'}
            onChange={(e) => updateArrayBodyItemType((e.target as HTMLSelectElement).value)}
          >
            <option value="string">string[]</option>
            <option value="number">number[]</option>
            <option value="boolean">boolean[]</option>
            {dataTypes.map(dt => (
              <option key={dt.name} value={dt.name}>{dt.name}[]</option>
            ))}
          </select>
        )}
      </div>

      <div class="form-group">
        <label>Response Type:</label>
        <select value={responseTypeStr} onChange={(e) => updateResponseType((e.target as HTMLSelectElement).value)}>
          <option value="">None</option>
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="array">array</option>
          {dataTypes.map(dt => (
            <option key={dt.name} value={dt.name}>{dt.name}</option>
          ))}
        </select>
        {httpInterface.responseType && 'kind' in httpInterface.responseType && httpInterface.responseType.kind === 'array' && (
          <select
            value={typeof httpInterface.responseType.itemType === 'string' ? httpInterface.responseType.itemType :
              'type' in httpInterface.responseType.itemType ? httpInterface.responseType.itemType.name : 'string'}
            onChange={(e) => updateArrayResponseItemType((e.target as HTMLSelectElement).value)}
          >
            <option value="string">string[]</option>
            <option value="number">number[]</option>
            <option value="boolean">boolean[]</option>
            {dataTypes.map(dt => (
              <option key={dt.name} value={dt.name}>{dt.name}[]</option>
            ))}
          </select>
        )}
      </div>

      <div class="form-group">
        <label>Headers:</label>
        <div class="list-container">
          {(httpInterface.headers || []).map((header, index) => (
            <div key={index} class="list-item">
              <input
                type="text"
                value={header}
                onInput={(e) => updateHeader(index, (e.target as HTMLInputElement).value)}
                placeholder="Header-Name"
              />
              <button class="btn btn-danger btn-small" onClick={() => deleteHeader(index)}>
                Remove
              </button>
            </div>
          ))}
          <button class="btn btn-secondary btn-small" onClick={addHeader}>
            Add Header
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="checkbox-group">
          <input
            type="checkbox"
            checked={httpInterface.isSSE || false}
            onChange={(e) => onChange({ ...httpInterface, isSSE: (e.target as HTMLInputElement).checked })}
          />
          Server-Sent Events (SSE)
        </label>
      </div>
    </>
  );
}
