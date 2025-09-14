
import React, { useState, useCallback } from 'react';
import { generateAnswersFromImage } from './services/geminiService';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

// Helper function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // We only want the base64 part after "data:mime/type;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};


const UploadIcon: React.FC = () => (
    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
    </svg>
);


const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedAnswers, setGeneratedAnswers] = useState<string | null>(null);
    const [selectedMark, setSelectedMark] = useState<string>('2'); // Default to '2 Marks'

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return; // User cancelled file selection
        }
        
        if (file.type.startsWith('image/')) {
            setImageFile(file);
            setError(null);
            setGeneratedAnswers(null);
            setSelectedMark('2');
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Invalid image format. Please upload a valid image file (e.g., PNG, JPG).');
            setImageFile(null);
            setImagePreview(null);
        }
    };
    
    const handleReset = useCallback(() => {
        setImageFile(null);
        setImagePreview(null);
        setIsLoading(false);
        setError(null);
        setGeneratedAnswers(null);
        setSelectedMark('2');
    }, []);

    const handleSubmit = async () => {
        if (!imageFile || isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedAnswers(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const mimeType = imageFile.type;
            const result = await generateAnswersFromImage(base64Image, mimeType, selectedMark);
            
            // Extract content from the fenced code block to ensure clean output
            const codeBlockMatch = result.match(/```(?:\w*\n)?([\s\S]*?)```/);
            setGeneratedAnswers(codeBlockMatch ? codeBlockMatch[1].trim() : result.trim());

        } catch (err) {
            console.error("Error during AI generation:", err);
            if (err instanceof Error) {
                if (err.message.toLowerCase().includes('network') || err.message.toLowerCase().includes('failed to fetch')) {
                    setError('Network error. Please check your internet connection and try again.');
                } else {
                    setError('AI generation failed, please try again. The image may be blurry or contain unsupported content.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
            <main className="max-w-4xl w-full mx-auto flex-grow flex flex-col">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-600 dark:text-primary-400">
                        Math Exam Practice Tool
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                        Upload your question paper and get AI-powered answers.
                    </p>
                </header>

                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl flex-grow flex flex-col p-6 sm:p-8">
                    {!generatedAnswers ? (
                        <div className="flex flex-col items-center justify-center w-full">
                            {!imagePreview ? (
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP, or other image formats</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="w-full text-center">
                                    <h2 className="text-xl font-semibold mb-4">Question Paper Preview</h2>
                                    <img src={imagePreview} alt="Question paper preview" className="max-w-full max-h-[50vh] rounded-lg shadow-md mx-auto" />
                                    
                                    <div className="w-full max-w-md mx-auto mt-6">
                                        <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">Select Marks per Question</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {['1', '2', '5', '8'].map((mark) => (
                                                <div key={mark}>
                                                    <input
                                                        type="radio"
                                                        id={`mark-option-${mark}`}
                                                        name="mark-option"
                                                        value={mark}
                                                        className="hidden peer"
                                                        checked={selectedMark === mark}
                                                        onChange={() => setSelectedMark(mark)}
                                                        required
                                                    />
                                                    <label
                                                        htmlFor={`mark-option-${mark}`}
                                                        className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <div className="block">
                                                            <div className="w-full text-base font-semibold">{mark} Mark{mark !== '1' ? 's' : ''}</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-center space-x-4">
                                        <button onClick={handleReset} type="button" className="px-6 py-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
                                            Change Image
                                        </button>
                                        <button onClick={handleSubmit} disabled={isLoading} className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                                            {isLoading && <LoadingSpinner />}
                                            {isLoading ? 'Generating...' : 'Generate Answers'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <ResultDisplay promptText={generatedAnswers} />
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                                >
                                    Start Over
                                </button>
                            </div>
                        </div>
                    )}
                    {error && <p className="mt-4 text-center text-red-500 dark:text-red-400">{error}</p>}
                </div>

                <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                    <p>Powered by AI. Always double-check critical information.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
