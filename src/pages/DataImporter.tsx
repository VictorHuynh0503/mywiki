import { useState, useRef } from 'react'
import { Upload, Trash2, Table, CheckCircle } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { useSheetImports, saveSheetImport, deleteSheetImport } from '../hooks/useSheetImports'

export default function DataImporter() {
  const { imports, loading, refresh } = useSheetImports()
  const [preview, setPreview] = useState<{ name: string; headers: string[]; rows: Record<string, string>[] } | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedImport, setSelectedImport] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          const headers = results.meta.fields ?? []
          setPreview({ name: file.name, headers, rows: results.data as Record<string, string>[] })
        }
      })
    } else {
      // Excel
      const reader = new FileReader()
      reader.onload = (ev) => {
        const wb = XLSX.read(ev.target?.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' })
        const headers = data.length > 0 ? Object.keys(data[0]) : []
        setPreview({ name: file.name, headers, rows: data })
      }
      reader.readAsBinaryString(file)
    }
    // reset input
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = async () => {
    if (!preview) return
    setSaving(true)
    await saveSheetImport({ name: preview.name, headers: preview.headers, rows: preview.rows, source: 'file' })
    setSaving(false)
    setPreview(null)
    refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this import?')) return
    await deleteSheetImport(id)
    if (selectedImport === id) setSelectedImport(null)
    refresh()
  }

  const activeImport = imports.find(i => i.id === selectedImport)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sheet Importer</h1>
          <p className="page-subtitle">Import CSV or Excel files as source data</p>
        </div>
        <label className="btn-primary" style={{ cursor: 'pointer' }}>
          <Upload size={16} /> Upload File
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} hidden />
        </label>
      </div>

      {/* Preview */}
      {preview && (
        <div className="preview-card">
          <div className="preview-header">
            <div className="preview-title">
              <Table size={16} />
              <strong>{preview.name}</strong>
              <span className="preview-meta">{preview.rows.length} rows · {preview.headers.length} columns</span>
            </div>
            <div className="preview-actions">
              <button className="btn-ghost" onClick={() => setPreview(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                <CheckCircle size={15} /> {saving ? 'Saving…' : 'Save to Database'}
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>{preview.headers.map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {preview.headers.map(h => <td key={h}>{String(row[h] ?? '')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.rows.length > 10 && (
            <p className="preview-truncated">Showing 10 of {preview.rows.length} rows</p>
          )}
        </div>
      )}

      {/* Saved imports */}
      <div className="data-layout">
        <div className="import-list">
          <h3 className="section-title">Saved Imports</h3>
          {loading ? (
            <div className="loading-rows">
              {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
            </div>
          ) : imports.length === 0 ? (
            <div className="empty-state">
              <p>No imports yet. Upload a CSV or Excel file.</p>
            </div>
          ) : (
            imports.map(imp => (
              <div
                key={imp.id}
                className={`import-item ${selectedImport === imp.id ? 'active' : ''}`}
                onClick={() => setSelectedImport(imp.id)}
              >
                <div className="import-item-info">
                  <Table size={14} />
                  <span className="import-name">{imp.name}</span>
                </div>
                <div className="import-item-meta">
                  <span>{imp.rows.length} rows</span>
                  <button
                    className="btn-icon danger"
                    onClick={e => { e.stopPropagation(); handleDelete(imp.id) }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Data viewer */}
        <div className="data-viewer">
          {activeImport ? (
            <>
              <div className="viewer-header">
                <h3>{activeImport.name}</h3>
                <span className="preview-meta">
                  {activeImport.rows.length} rows · imported {new Date(activeImport.imported_at).toLocaleDateString()}
                </span>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>{activeImport.headers.map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {activeImport.rows.map((row, i) => (
                      <tr key={i}>
                        {activeImport.headers.map(h => <td key={h}>{String(row[h] ?? '')}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Table size={32} />
              <p>Select an import from the left to view its data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
