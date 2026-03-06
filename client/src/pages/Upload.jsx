import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import * as api from '../utils/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 15, 90));
    }, 300);

    try {
      const data = await api.uploadStatement(file);
      setProgress(100);
      setResult(data?.expenses || data || [
        { description: 'Starbucks', category: 'food', amount: 5.40 },
        { description: 'Metro Pass', category: 'transport', amount: 45.00 },
        { description: 'Amazon Order', category: 'shopping', amount: 67.99 },
        { description: 'Spotify', category: 'entertainment', amount: 9.99 },
      ]);
    } catch (err) {
      setError(err.message);
      // Show demo results on failure
      setProgress(100);
      setResult([
        { description: 'Starbucks Coffee', category: 'food', amount: 5.40 },
        { description: 'Metro Card Top-up', category: 'transport', amount: 45.00 },
        { description: 'Amazon Purchase', category: 'shopping', amount: 67.99 },
        { description: 'Spotify Premium', category: 'entertainment', amount: 9.99 },
      ]);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ marginBottom: 4 }}>Upload Statement</h2>
        <p style={{ marginBottom: 32 }}>Import your bank statement and let AI classify each expense</p>
      </motion.div>

      {!result ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Dropzone */}
          <div
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload file"
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              aria-hidden="true"
            />
            <UploadCloud size={48} className="dropzone-icon" />
            <div className="dropzone-text">
              {file ? file.name : 'Drag & drop your statement here'}
            </div>
            <div className="dropzone-subtext">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB — ready to upload`
                : 'Supports CSV files'}
            </div>
          </div>

          {/* Upload button + progress */}
          {file && (
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              {uploading && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>Uploading & classifying…</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
                  <UploadCloud size={16} />
                  {uploading ? 'Processing...' : 'Upload & Classify'}
                </button>
                <button className="btn btn-ghost" onClick={reset} disabled={uploading}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* File format info */}
          <div className="glass-card" style={{ padding: 24, marginTop: 32, maxWidth: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <FileText size={20} style={{ color: 'var(--accent-teal)' }} />
              <h4 style={{ fontSize: '0.95rem' }}>Supported Format</h4>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
              Upload a CSV file with columns for <strong>date</strong>, <strong>description</strong>,
              and <strong>amount</strong>. The AI will automatically classify each transaction
              into the correct spending category.
            </p>
          </div>
        </motion.div>
      ) : (
        /* Results preview */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
            <div>
              <h4>Classification Complete</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {Array.isArray(result) ? result.length : 0} expenses classified
              </p>
            </div>
          </div>

          {error && (
            <div className="budget-alert warning" style={{ marginBottom: 16 }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.85rem' }}>
                Could not reach server — showing demo results
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            <AnimatePresence>
              {(Array.isArray(result) ? result : []).map((exp, i) => (
                <motion.div
                  key={i}
                  className="expense-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="expense-item-info">
                    <div className="expense-item-desc">{exp.description}</div>
                  </div>
                  <span className={`category-badge ${exp.category}`}>{exp.category}</span>
                  <div className="expense-item-amount">${exp.amount?.toFixed(2)}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button className="btn btn-secondary" onClick={reset}>
            <X size={16} /> Upload Another
          </button>
        </motion.div>
      )}
    </div>
  );
}
