
import React, { useState } from 'react';

interface ResultDisplayProps {
  promptText: string;
}

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ promptText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-6 flex justify-between items-center bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Generated Prompt</h2>
        <button
          onClick={handleCopy}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-green-500 disabled:cursor-default transition-colors duration-200"
          disabled={copied}
        >
          {copied ? <CheckIcon className="w-5 h-5 mr-2"/> : <CopyIcon className="w-5 h-5 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-6">
        <pre className="whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200 text-base leading-relaxed font-sans">
          {promptText}
        </pre>
      </div>
    </div>
  );
};

export default ResultDisplay;
