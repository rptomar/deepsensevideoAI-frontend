'use client';
import { useState, useRef } from 'react';

export default function VideoAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error
  //const [videoFile, setVideoFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [isAsking, setIsAsking] = useState(false);
  
  const inputRef = useRef(null);
  //const router = useRouter();

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
    //setVideoFile(file);
    setUploadStatus('uploading');
    setError('');
    setUploadProgress(0);

    try {
      // Create FormData for Cloudinary upload
      const videoData = new FormData();
      videoData.append('file', file);
      videoData.append('upload_preset', 'modernlane');
      videoData.append('cloud_name', 'djxc36udi');

      // Upload to Cloudinary with progress tracking
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('POST', 'https://api.cloudinary.com/v1_1/djxc36udi/video/upload');
        xhr.send(videoData);
      });

      const video = cloudinaryResponse.url;
      setVideoUrl(video);

      // Update status to analyzing
      setUploadStatus('analyzing');
      setUploadProgress(0); // Reset progress for analysis phase
      const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL+'deepsensevideo/analyze/';
      console.log('apiUrl',apiUrl,process.env.NEXT_PUBLIC_BASE_API_URL);
      // Send video URL to analysis API
      const analysisResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videourl:video }),
      });
      console.log('analysisResponse',analysisResponse);

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze video');
      }

      const analysisData = await analysisResponse.json();
      console.log('analysisResponse analysisData',analysisData);
      // Simply set the entire response as the analysis
      setUploadStatus('completed');
      setAnalysis(analysisData.analysis);

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process video analysis. Please try again.');
      setUploadStatus('error');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !videoUrl) return;

    setIsAsking(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL + 'analyze/ask/';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videourl: videoUrl,
          question: question
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setAnswers(prev => [...prev, { 
        question: question, 
        answer: data.analysis || "No answer available"
      }]);
      setQuestion('');
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get answer. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  console.log('answers',answers);
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
        {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
          <div className="space-y-4">
            {uploadStatus === 'uploading' ? (
              <>
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-center text-gray-600">
                  Uploading video... {uploadProgress}%
                </div>
              </>
            ) : (
              <>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full analyzing-animation"
                  ></div>
                </div>
                <div className="text-center text-gray-600">
                  DeepSenseVideo is analysing...
                </div>
              </>
            )}
          </div>
        )}

        {/* Analysis Results */}
        {uploadStatus === 'completed' && analysis && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Analysis Results
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans">
                  {analysis}
                </pre>
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ask Questions About the Video</h2>
              
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the video..."
                  className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isAsking}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center ${
                    isAsking ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isAsking}
                >
                  {isAsking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Ask Question'
                  )}
                </button>
              </form>

              {answers.length > 0 && (
                <div className="mt-6 space-y-6">
                  {answers.map((qa, index) => (
                    <div 
                      key={index} 
                      className="border-t pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">Q</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">
                          {qa.question}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 mt-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium">A</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {qa.answer}
                        </p>
                      </div>
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

      {/* Add this CSS to your global styles or as a style tag */}
      <style jsx>{`
        @keyframes analyzing {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 30%;
            margin-left: 70%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        
        .analyzing-animation {
          animation: analyzing 2s infinite;
        }
      `}</style>
    </div>
  );
}