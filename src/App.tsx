import React, { useState } from 'react';
import { FileText, Upload, Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://o27e7panp4vcw4ns4llhf3ob7i0iszcc.lambda-url.eu-north-1.on.aws/upload',{
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Unknown error occurred');
      }

      const data = await response.json();
      setExtractedText(data.body || 'No text found in the response.');
    } catch (err: any) {
      setError(err.message || 'Error: Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">PDF Text Extractor</h1>
          <p className="mt-2 text-gray-600">Upload your PDF file and get extracted text instantly</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label 
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Select any file</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {file.name}
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              !file || isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              'Extract Text'
            )}
          </button>

          {extractedText && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Extracted Text:</h2>
              <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {extractedText}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
