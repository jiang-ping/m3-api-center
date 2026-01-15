import { useState, useEffect } from 'preact/hooks';
import { Metadata } from './types/metadata';
import { DataTypesEditor } from './components/DataTypesEditor';
import { HttpInterfacesEditor } from './components/HttpInterfacesEditor';
import { JsonViewer } from './components/JsonViewer';

const defaultMetadata: Metadata = {
  dataTypes: [],
  httpInterfaces: []
};

export function App() {
  const [metadata, setMetadata] = useState<Metadata>(defaultMetadata);
  const [activeTab, setActiveTab] = useState<'dataTypes' | 'httpInterfaces' | 'json'>('dataTypes');

  useEffect(() => {
    // Try to load metadata from localStorage
    const saved = localStorage.getItem('metadata');
    if (saved) {
      try {
        setMetadata(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved metadata', e);
      }
    }
  }, []);

  const saveMetadata = () => {
    localStorage.setItem('metadata', JSON.stringify(metadata, null, 2));
    alert('Metadata saved to localStorage!');
  };

  const loadFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            setMetadata(json);
            alert('Metadata loaded successfully!');
          } catch (err) {
            alert('Failed to parse JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const downloadMetadata = () => {
    const json = JSON.stringify(metadata, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearMetadata = () => {
    if (confirm('Are you sure you want to clear all metadata?')) {
      setMetadata(defaultMetadata);
      localStorage.removeItem('metadata');
    }
  };

  return (
    <div class="app">
      <div class="header">
        <h1>M3 API Center - Metadata Editor</h1>
        <p>Edit metadata for your API center, defining data types and HTTP interfaces</p>
        <div class="header-actions">
          <button class="btn btn-primary" onClick={saveMetadata}>
            Save to LocalStorage
          </button>
          <button class="btn btn-secondary" onClick={loadFromFile}>
            Load from File
          </button>
          <button class="btn btn-success" onClick={downloadMetadata}>
            Download JSON
          </button>
          <button class="btn btn-danger" onClick={clearMetadata}>
            Clear All
          </button>
        </div>
      </div>

      <div class="tabs">
        <button
          class={`tab ${activeTab === 'dataTypes' ? 'active' : ''}`}
          onClick={() => setActiveTab('dataTypes')}
        >
          Data Types
        </button>
        <button
          class={`tab ${activeTab === 'httpInterfaces' ? 'active' : ''}`}
          onClick={() => setActiveTab('httpInterfaces')}
        >
          HTTP Interfaces
        </button>
        <button
          class={`tab ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          JSON View
        </button>
      </div>

      <div class="content">
        {activeTab === 'dataTypes' && (
          <DataTypesEditor
            dataTypes={metadata.dataTypes}
            onChange={(dataTypes) => setMetadata({ ...metadata, dataTypes })}
          />
        )}
        {activeTab === 'httpInterfaces' && (
          <HttpInterfacesEditor
            httpInterfaces={metadata.httpInterfaces}
            dataTypes={metadata.dataTypes}
            onChange={(httpInterfaces) => setMetadata({ ...metadata, httpInterfaces })}
          />
        )}
        {activeTab === 'json' && (
          <JsonViewer metadata={metadata} onChange={setMetadata} />
        )}
      </div>
    </div>
  );
}
