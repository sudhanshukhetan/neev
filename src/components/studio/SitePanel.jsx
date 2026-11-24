import React, { useCallback, useRef, useState } from 'react';
import { useT } from '../../i18n/useT.js';
import { useNeevStore } from '../../store/useNeevStore.js';
import { fetchAuditPreset, fetchAuditPhoto } from '../../lib/api.js';
import { PRESETS } from '@shared/presets.js';
import BaselineForm from './BaselineForm.jsx';
import Skeleton from '../ui/Skeleton.jsx';

export default function SitePanel() {
  const t = useT();
  const setBaseline = useNeevStore((s) => s.setBaseline);
  const setIsAuditing = useNeevStore((s) => s.setIsAuditing);
  const setActivePreset = useNeevStore((s) => s.setActivePreset);
  const showToast = useNeevStore((s) => s.showToast);
  const isAuditing = useNeevStore((s) => s.isAuditing);
  const baseline = useNeevStore((s) => s.baseline);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return t('site_upload_error_type');
    if (file.size > 5 * 1024 * 1024) return t('site_upload_error_size');
    return null;
  };

  const handleFile = async (file) => {
    setUploadError('');
    const err = validateFile(file);
    if (err) { setUploadError(err); return; }

    const url = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoPreview(url);
    setActivePreset(null);

    setIsAuditing(true);
    try {
      const data = await fetchAuditPhoto(file);
      setBaseline(data.baseline);
      showToast(t('toast_audit_ok'));
    } catch (e) {
      showToast(`Upload failed: ${e.message}. Using estimated baseline.`);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePreset = async (preset) => {
    handleRemovePhoto();
    setIsAuditing(true);
    setActivePreset(preset);
    try {
      const data = await fetchAuditPreset(preset.id);
      setBaseline(data.baseline);
      showToast(t('toast_audit_ok'));
    } catch (e) {
      // Even if API fails, use preset data directly
      setBaseline(preset.baseline);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="p-0">
      {/* Panel header */}
      <div className="flex items-center px-4 py-2 border-b border-line">
        <span className="label-mono">{t('site_panel_title')}</span>
      </div>

      {/* Upload area */}
      <div className="p-4 border-b border-line">
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt={t('site_upload_preview_alt')}
              className="w-full h-32 object-cover border border-line"
              style={{ borderRadius: 2 }}
            />
            <button
              onClick={handleRemovePhoto}
              className="absolute top-1 right-1 bg-ink text-white font-mono text-xs px-2 py-0.5 hover:bg-crimson transition-colors"
              style={{ borderRadius: 1 }}
            >
              {t('site_upload_remove')} ×
            </button>
            <div className="mt-1 font-mono text-xs text-muted">
              {photoFile?.name}
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border border-dashed border-line p-4 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-terracotta bg-terracotta-50' : 'hover:border-muted'
            }`}
            style={{ borderRadius: 2 }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label={t('site_upload_label')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          >
            <div className="label-mono text-muted mb-1">{t('site_upload_label')}</div>
            <div className="font-mono text-xs text-muted opacity-70">{t('site_upload_hint')}</div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
          aria-label={t('site_upload_label')}
        />

        {/* Camera capture (mobile) */}
        <div className="mt-2 flex gap-2">
          <label className="cursor-pointer border border-line px-3 py-1 font-mono text-xs text-muted hover:text-ink transition-colors" style={{ borderRadius: 1 }}>
            {t('site_upload_capture')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
          <span className="font-mono text-xs text-muted self-center opacity-50">Mobile only</span>
        </div>

        {/* Inline error */}
        {uploadError && (
          <div className="mt-2 font-mono text-xs text-crimson border border-crimson px-2 py-1" style={{ borderRadius: 1 }}>
            {uploadError}
          </div>
        )}

        {/* AI honesty note */}
        {photoPreview && !isAuditing && (
          <div className="mt-2 font-mono text-xs text-muted opacity-70 italic border-t border-line pt-2">
            {t('baseline_note')}
          </div>
        )}
      </div>

      {/* Preset cards */}
      <div className="p-4">
        <div className="label-mono mb-3 text-slate-300 font-semibold">{t('site_presets_title')}</div>
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset)}
              disabled={isAuditing}
              className="text-left border border-white/10 hud-card p-3 hover:border-orange-500/50 hover:bg-white/5 transition-all disabled:opacity-50 rounded-xl"
            >
              <div className="font-heading text-xs font-semibold text-white mb-0.5">{preset.name}</div>
              <div className="font-mono text-[11px] text-orange-400 mb-1">{preset.ward}</div>
              <div className="font-ui text-xs text-slate-300 leading-snug">{preset.description}</div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="font-mono text-[11px] text-orange-400 font-semibold flex items-center gap-1">
                  {t('site_preset_select')} →
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {preset.baseline.laneWidthM}m width
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Baseline form */}
      {isAuditing && (
        <div className="px-4 pb-4">
          <Skeleton lines={4} />
        </div>
      )}
      {baseline && !isAuditing && (
        <div className="border-t border-line">
          <BaselineForm />
        </div>
      )}
    </div>
  );
}
