'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Trash2 } from 'lucide-react';

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
    currentPhoto?: string | null;
    onDelete?: () => void;
    mealName: string;
    day: string;
    mealType: string;
}

export default function PhotoUploadModal({
    isOpen,
    onClose,
    onUpload,
    currentPhoto,
    onDelete,
    mealName,
    day,
    mealType
}: PhotoUploadModalProps) {
    const [preview, setPreview] = useState<string | null>(currentPhoto || null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            await onUpload(file);
        } catch (error) {
            alert('Failed to upload photo');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleDelete = () => {
        if (onDelete && confirm('Delete this photo?')) {
            onDelete();
            setPreview(null);
            onClose();
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#113e53',
                            marginBottom: '0.25rem'
                        }}>
                            {mealName}
                        </h3>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#113e53',
                            opacity: 0.7
                        }}>
                            {day.charAt(0).toUpperCase() + day.slice(1)} - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            color: '#113e53'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Photo Preview or Upload Area */}
                {preview ? (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <img
                            src={preview}
                            alt="Meal"
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                marginBottom: '1rem'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                style={{
                                    flex: 1,
                                    background: '#113e53',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Upload size={18} />
                                Replace Photo
                            </button>
                            {onDelete && (
                                <button
                                    onClick={handleDelete}
                                    style={{
                                        background: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragActive ? '#113e53' : 'rgba(17, 62, 83, 0.3)'}`,
                            borderRadius: '12px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            marginBottom: '1.5rem',
                            background: dragActive ? 'rgba(17, 62, 83, 0.05)' : 'rgba(17, 62, 83, 0.02)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Camera size={48} style={{ color: '#113e53', opacity: 0.5, margin: '0 auto 1rem' }} />
                        <p style={{ color: '#113e53', marginBottom: '0.5rem', fontWeight: 500 }}>
                            {dragActive ? 'Drop photo here' : 'Click or drag photo here'}
                        </p>
                        <p style={{ color: '#113e53', opacity: 0.6, fontSize: '0.875rem' }}>
                            JPG, PNG up to 10MB
                        </p>
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            handleFileSelect(e.target.files[0]);
                        }
                    }}
                    style={{ display: 'none' }}
                />

                {uploading && (
                    <p style={{ textAlign: 'center', color: '#113e53', opacity: 0.7 }}>
                        Uploading...
                    </p>
                )}
            </div>
        </div>
    );
}
