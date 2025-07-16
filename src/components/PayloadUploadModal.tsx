import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X } from 'lucide-react';

interface PayloadUploadModalProps {
  onClose: () => void;
  onUpload: (payloads: any[]) => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const PayloadUploadModal: React.FC<PayloadUploadModalProps> = ({ onClose, onUpload }) => {
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedPayloads, setUploadedPayloads] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Required fields for payload schema validation
  const requiredFields = ['name', 'payload', 'category'];
  const optionalFields = [
    'id', 'description', 'tags', 'source', 'owasp', 'mitreAtlas', 'aiSystem',
    'technique', 'successRate', 'bypassMethods', 'isEditable', 'version',
    'lastModified', 'createdBy', 'expectedOutput', 'successIndicators', 'failureIndicators'
  ];

  const validatePayload = (payload: any, index: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    requiredFields.forEach(field => {
      if (!payload[field] || (typeof payload[field] === 'string' && !payload[field].trim())) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate field types
    if (payload.tags && !Array.isArray(payload.tags)) {
      errors.push('Tags must be an array');
    }
    
    if (payload.owasp && !Array.isArray(payload.owasp)) {
      errors.push('OWASP must be an array');
    }

    if (payload.category && !['prompt-injection', 'jailbreak', 'data-extraction', 'role-confusion', 'custom'].includes(payload.category)) {
      warnings.push(`Unknown category: ${payload.category}`);
    }

    // Check for unknown fields
    Object.keys(payload).forEach(key => {
      if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
        warnings.push(`Unknown field: ${key}`);
      }
    });

    // Auto-generate missing optional fields
    if (!payload.id) {
      payload.id = `custom-${Date.now()}-${index}`;
      warnings.push('Auto-generated ID');
    }

    if (!payload.isEditable) {
      payload.isEditable = true;
    }

    if (!payload.createdBy) {
      payload.createdBy = 'user-upload';
    }

    if (!payload.lastModified) {
      payload.lastModified = new Date().toISOString();
    }

    if (!payload.version) {
      payload.version = '1.0';
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleFileUpload = async (files: FileList) => {
    setIsProcessing(true);
    const results: any[] = [];
    const validations: ValidationResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();

        try {
          let payloads: any[];
          
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(text);
            payloads = Array.isArray(parsed) ? parsed : [parsed];
          } else if (file.name.endsWith('.txt')) {
            // Handle plain text files - create basic payload structure
            const lines = text.split('\n').filter(line => line.trim());
            payloads = lines.map((line, index) => ({
              name: `Text Payload ${index + 1}`,
              payload: line.trim(),
              category: 'custom',
              description: `Uploaded from ${file.name}`,
              tags: ['user-upload', 'text-import']
            }));
          } else {
            throw new Error(`Unsupported file type: ${file.name}`);
          }

          // Validate each payload
          payloads.forEach((payload, index) => {
            const validation = validatePayload(payload, results.length + index);
            validations.push(validation);
            if (validation.isValid) {
              results.push(payload);
            }
          });

        } catch (error) {
          validations.push({
            isValid: false,
            errors: [`Failed to parse ${file.name}: ${error}`],
            warnings: []
          });
        }
      }

      setUploadedPayloads(results);
      setValidationResults(validations);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const downloadTemplate = () => {
    try {
      const template = uploadMode === 'single' ? {
        name: "Example Payload",
        description: "Description of what this payload does",
        category: "prompt-injection",
        payload: "Your payload text here",
        tags: ["example", "template"],
        source: "User Upload",
        owasp: ["LLM01"],
        technique: "direct-approach",
        expectedOutput: "Expected response pattern",
        successIndicators: ["keyword1", "keyword2"],
        failureIndicators: ["sorry", "cannot", "refuse"]
      } : [
        {
          name: "Example Payload 1",
          description: "First example payload",
          category: "prompt-injection",
          payload: "First payload text",
          tags: ["example", "bulk"]
        },
        {
          name: "Example Payload 2", 
          description: "Second example payload",
          category: "jailbreak",
          payload: "Second payload text",
          tags: ["example", "bulk"]
        }
      ];

      const jsonString = JSON.stringify(template, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `payload-template-${uploadMode}.json`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Template download initiated successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  const handleUploadConfirm = () => {
    if (uploadedPayloads.length > 0) {
      onUpload(uploadedPayloads);
      onClose();
    }
  };

  const validPayloads = validationResults.filter(r => r.isValid).length;
  const totalPayloads = validationResults.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] mx-4 border border-gray-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-white">Upload Payloads</h2>
            <p className="text-gray-400 text-sm">Import payloads from JSON or text files</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-3">Upload Mode</label>
            <div className="flex gap-4">
              <button
                onClick={() => setUploadMode('single')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  uploadMode === 'single'
                    ? 'border-purple-500 bg-purple-900/20 text-purple-200'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                }`}
              >
                Single Payload
              </button>
              <button
                onClick={() => setUploadMode('bulk')}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  uploadMode === 'bulk'
                    ? 'border-purple-500 bg-purple-900/20 text-purple-200'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                }`}
              >
                Bulk Import
              </button>
            </div>
          </div>

          {/* Template Download */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download {uploadMode === 'single' ? 'Template' : 'Bulk Template'}
            </button>
            <p className="text-xs text-gray-400 mt-1">
              Download a template file to see the expected format
            </p>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-purple-500 bg-purple-900/10'
                : 'border-gray-600 bg-gray-800/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={uploadMode === 'bulk'}
              accept=".json,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">
              {uploadMode === 'single' ? 'Drop a JSON or text file here' : 'Drop JSON or text files here'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Supported formats: .json, .txt
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Select Files'}
            </button>
          </div>

          {/* Validation Results */}
          {validationResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Validation Results ({validPayloads}/{totalPayloads} valid)
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {validationResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.isValid
                        ? 'border-green-700 bg-green-900/20'
                        : 'border-red-700 bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-sm font-medium text-white">
                        Payload {index + 1} {result.isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                    
                    {result.errors.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-red-300 mb-1">Errors:</p>
                        <ul className="text-xs text-red-200 space-y-1">
                          {result.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.warnings.length > 0 && (
                      <div>
                        <p className="text-xs text-yellow-300 mb-1">Warnings:</p>
                        <ul className="text-xs text-yellow-200 space-y-1">
                          {result.warnings.map((warning, i) => (
                            <li key={i}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payload Preview */}
          {uploadedPayloads.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Preview ({uploadedPayloads.length} payloads)
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploadedPayloads.map((payload, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-white">{payload.name}</span>
                      <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                        {payload.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{payload.description}</p>
                    <div className="text-xs font-mono bg-gray-900 p-2 rounded text-gray-300">
                      {payload.payload ? (
                        <>
                          {payload.payload.substring(0, 100)}
                          {payload.payload.length > 100 && '...'}
                        </>
                      ) : (
                        <span className="text-red-400">No payload content</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUploadConfirm}
            disabled={uploadedPayloads.length === 0}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            Upload {uploadedPayloads.length} Payload{uploadedPayloads.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayloadUploadModal; 