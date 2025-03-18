# DeepSenseVideo AI - Frontend

AI-Powered Video Analysis Tool

## Overview

DeepSenseVideo AI is a streamlined web application that allows users to upload short videos (up to 10 minutes) and leverages AI to automatically analyze and extract meaningful text information from the content. This tool demonstrates the ability to combine video processing with AI analysis in a practical business application.

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Cloudinary account for video storage
- An API endpoint for video analysis

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rptomar/deepsensevideoAI-frontend.git
   cd deepsensevideoAI-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```plaintext
   NEXT_PUBLIC_BASE_API_URL=http://your-api-url.com/
   your backend server url
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**

   Visit `http://localhost:3000` to view the application.

## Features Implemented

- **Video Upload & Processing:**
  - Users can upload videos up to 10 minutes long.
  - Videos are processed for AI analysis, extracting frames or generating transcripts.
  - Clear loading and processing states are shown.

- **AI Analysis Dashboard:**
  - Automatically generates a comprehensive text analysis including:
    - Transcription of spoken content
    - Summary of key points/topics covered
    - Detection of important objects/activities shown in the video
    - Sentiment analysis of speakers (if applicable)
  - Users can ask questions about the video and receive AI-generated responses.

- **User Experience:**
  - Clean, intuitive interface for uploading and viewing videos.
  - Well-organized presentation of AI-extracted information.
  - Responsive design that works across devices.
  - Thoughtful error handling for failed uploads or processing.

## Technical Decisions and Trade-offs

- **User Management:** Implemented user authentication and authorization for a more secure application.

- **Frontend Framework:**
  - Chose Next.js for its server-side rendering capabilities and built-in routing, which enhances performance and SEO.

- **Video Storage:**
  - Used Cloudinary for video storage due to its robust API and ease of integration with media processing.

- **AI Integration:**
  - Integrated with a hypothetical AI model (e.g., Google gemini 2.0 Flash) for video analysis, assuming access to such a service.

- **Trade-offs:**
  - Opted for simplicity in the initial implementation, focusing on core features rather than optional enhancements like analysis history or export functionality.

## What I Would Improve with More Time

- **Enhanced Analysis Features:**
  - Implement analysis history and export functionality (PDF or text format).
  - Add custom analysis prompts and timestamp navigation.

- **Performance Optimization:**
  - Optimize video processing and AI analysis for faster response times.

- **User Interface Enhancements:**
  - Improve the design and accessibility of the user interface.
  - Add more detailed loading animations and feedback.

- **Testing and Deployment:**
  - Implement comprehensive testing (unit, integration, and end-to-end).
  - Deploy the application to a production environment with CI/CD pipelines.

## Conclusion

DeepSenseVideo AI is a powerful tool for video analysis, combining modern web technologies with AI capabilities. This project showcases the potential of integrating AI into web applications to provide valuable insights and enhance user experiences.

