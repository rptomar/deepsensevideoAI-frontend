'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [videoFile, setVideoFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  
  const inputRef = useRef(null);
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateVideo = (file) => {
    // Check file size (10 minutes approximated to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('Video must be under 10 minutes long (max 100MB)');
      return false;
    }
    // Check file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file');
      return false;
    }
    return true;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateVideo(file)) {
      await handleVideoUpload(file);
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file && validateVideo(file)) {
      await handleVideoUpload(file);
    }
  };

  const handleVideoUpload = async (file) => {
    setVideoFile(file);
    setUploadStatus('uploading');
    setError('');

    // Simulated upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // Here you would typically:
      // 1. Upload to cloud storage (AWS S3, Firebase, etc.)
      // 2. Send to backend for processing
      // 3. Get analysis results
      
      // Simulated API call
      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadStatus('processing');
        
        // Simulated analysis results
        setTimeout(() => {
          setUploadStatus('completed');
          setAnalysis({
            transcription: "Sample transcription of the video...",
            summary: "This video contains...",
            keyPoints: ["Point 1", "Point 2", "Point 3"],
            sentiment: "Positive",
            objects: ["Person", "Car", "Building"]
          });
        }, 3000);
      }, 5000);

    } catch (err) {
      setError('Failed to upload video. Please try again.');
      setUploadStatus('error');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      // Simulated AI Q&A response
      const response = "This is a simulated answer to your question about the video...";
      setAnswers(prev => [...prev, { question, answer: response }]);
      setQuestion('');
    } catch (err) {
      setError('Failed to get answer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Video Analysis Dashboard
        </h1>

        {/* Upload Section */}
        {uploadStatus === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="text-gray-600 dark:text-gray-300">
                Drag and drop your video here or
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Select File
              </button>
              <div className="text-sm text-gray-500">
                Maximum video length: 10 minutes
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
          <div className="space-y-4">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-center text-gray-600">
              {uploadStatus === 'uploading' ? 'Uploading video...' : 'Processing video...'}
              {uploadStatus === 'uploading' && ` ${uploadProgress}%`}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {uploadStatus === 'completed' && analysis && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Transcription</h3>
                  <p className="text-gray-600 dark:text-gray-400">{analysis.transcription}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Summary</h3>
                  <p className="text-gray-600 dark:text-gray-400">{analysis.summary}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Key Points</h3>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Objects Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.objects.map((object, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                      >
                        {object}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ask Questions</h2>
              
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the video..."
                  className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Ask Question
                </button>
              </form>

              {answers.length > 0 && (
                <div className="mt-4 space-y-4">
                  {answers.map((qa, index) => (
                    <div key={index} className="border-t pt-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300">Q: {qa.question}</p>
                      <p className="text-gray-600 dark:text-gray-400">A: {qa.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-center p-4 bg-red-50 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}