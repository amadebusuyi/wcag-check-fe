import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

// Interfaces for analysis result data
interface AnalysisIssue {
  issue: string;
  description: string;
  suggestion: string;
  element?: string;
}

interface AnalysisResult {
  complianceScore: number;
  issues: AnalysisIssue[];
}

interface FileUploadProps {
  onResult: (result: AnalysisResult) => void; 
  onError: (error: string) => void;
  onRemove: (error: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onResult, onError, onRemove }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onError('');
    onRemove(true);
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      onError('Please select a file before uploading.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const ApiUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${ApiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errData = await response.json();
        onError(errData.error || 'Upload failed');
      } else {
        const data: AnalysisResult = await response.json();
        onResult(data);
      }
    } catch (err) {
      onError(`${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedFile) onRemove(true);
  }, [onRemove, selectedFile])

  return (
    <Form onSubmit={handleSubmit} aria-label="File Upload Form">
      <Label htmlFor="file-upload">Select an HTML file to analyze:</Label>
      <FileInput
        type="file"
        id="file-upload"
        name="file"
        accept=".html"
        placeholder="Upload file"
        onChange={handleFileChange}
        aria-required="true"
      />
      {selectedFile && <p style={{ width: '100%', position: 'relative' }}>
        <span style={{ color: '#474748', marginBottom: 10 }}>{selectedFile.name}</span>
        <span onClick={() => setSelectedFile(null)} style={{ position: 'absolute', cursor: 'pointer', right: 0, color: 'red' }}>Remove</span>
      </p>}
      <Button type="submit" disabled={loading || !selectedFile}>
        {loading ? 'Analyzing...' : 'Upload and Analyze'}
      </Button>
    </Form>
  );
};

export default FileUpload;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const FileInput = styled.input`
  margin-bottom: 16px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #c4c4c4;
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 12px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;
