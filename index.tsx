// Fix: Removed unused 'useCallback' import.
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat, Modality, Type } from '@google/genai';

// --- Helper Functions & SVGs ---
const Icon = ({ path, className = '' }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} fill="currentColor" />
    </svg>
);
const PlusIcon = () => <Icon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />;
const ModernMicIcon = () => <Icon path="M12 2C10.34 2 9 3.34 9 5v6c0 1.66 1.34 3 3 3s3-1.34 3-3V5c0-1.66-1.34-2-3-2zm5 9c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z" />;
const SendIcon = () => <Icon path="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />;
const MenuIcon = () => <Icon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />;
const ProfileIcon = () => <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const ArrowRightIcon = () => <Icon path="M10 17l5-5-5-5v10z" />;
const CloseIcon = () => <Icon path="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />;
const StopIcon = () => <Icon path="M6 6h12v12H6z" />;
const SearchIcon = () => <Icon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />;
const ExploreIcon = () => <Icon path="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />;

// --- New Feature Icons ---
const CodeIcon = () => <Icon path="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />;
const ImageIcon = () => <Icon path="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />;
const TextToVideoGenIcon = () => <Icon path="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zM9 15l7-4.5L9 6v9z" />;
const ImageToVideoGenIcon = () => <Icon path="M1 5h2v14H1V5zm4 0h2v14H5V5zm18 0H9v14h14V5zM11 17l2.5-3.15L15.29 16l2.5-3.22L21 17H11z" />;
const UserPlusIcon = () => <Icon path="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const SpeakerIcon = () => <Icon path="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />;
const UpscaleIcon = () => <Icon path="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />;
const SaveIcon = () => <Icon path="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />;
const DownloadIcon = () => <Icon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />;
const YourAppIcon = () => <Icon path="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10zM5 6h14v2H5V6z" />;
const CheckCircleIcon = () => <Icon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />;
const ArrowLeftIcon = () => <Icon path="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />;
const DesktopIcon = () => <Icon path="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />;
const TabletIcon = () => <Icon path="M19 0H5C3.9 0 3 .9 3 2v20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm-5 22h-4v-1h4v1zm7-3H5V3h14v16z" />;
const PhoneIcon = () => <Icon path="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />;

// --- Custom Hook for Keyboard Handling ---
const useVisualViewport = () => {
    const [height, setHeight] = useState(window.visualViewport?.height || window.innerHeight);

    useEffect(() => {
        const visualViewport = window.visualViewport;
        if (!visualViewport) return;

        const handleResize = () => {
            setHeight(visualViewport.height);
        };

        visualViewport.addEventListener('resize', handleResize);
        handleResize(); // Set initial height

        return () => visualViewport.removeEventListener('resize', handleResize);
    }, []);

    return height;
};


// --- Main App Component ---
const App = () => {
    const [apiKeyError, setApiKeyError] = useState('');
    const viewportHeight = useVisualViewport();

    useEffect(() => {
        if (!process.env.API_KEY) {
            setApiKeyError('The API_KEY is missing. Please make sure it is configured correctly.');
        }
    }, []);

    useEffect(() => {
        // This CSS variable is used by the CSS to adjust the layout when the on-screen keyboard appears.
        document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
    }, [viewportHeight]);

    if (apiKeyError) {
        return (
            <div style={{ color: '#d9534f', backgroundColor: '#1e1e1e', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2>Configuration Error</h2>
                <p>{apiKeyError}</p>
            </div>
        );
    }

    return <ChatPage />;
};

let aiInstance: GoogleGenAI | undefined;
function getAiInstance(): GoogleGenAI {
    if (!aiInstance) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("API_KEY is missing.");
            throw new Error("The API_KEY is missing. Please make sure it is configured correctly.");
        }
        try {
            aiInstance = new GoogleGenAI({ apiKey });
        } catch (e) {
            console.error("Failed to initialize GoogleGenAI:", e);
            throw new Error("Failed to initialize the AI service. The API key might be invalid.");
        }
    }
    return aiInstance;
}

// --- Explore Modal ---
const ExploreModal = ({ isOpen, onClose, onSelectFeature }) => {
    if (!isOpen) return null;

    const features = [
        { name: 'Build Website', icon: <CodeIcon />, key: 'build-website' },
        { name: 'Text to Image', icon: <ImageIcon />, key: 'text-to-image' },
        { name: 'Text to Video', icon: <TextToVideoGenIcon />, key: 'text-to-video' },
        { name: 'Image to Video', icon: <ImageToVideoGenIcon />, key: 'image-to-video' },
        { name: 'Image Upscaling', icon: <UpscaleIcon />, key: 'image-upscaling' },
        { name: 'Text to Speech', icon: <SpeakerIcon />, key: 'text-to-speech' },
    ];

    return (
        <div className="explore-modal-overlay" onClick={onClose}>
            <div className="explore-modal" onClick={(e) => e.stopPropagation()}>
                <div className="explore-header">
                    <h2 className="gradient-text">Explore Features</h2>
                    <button className="icon-btn close-btn" onClick={onClose} aria-label="Close explore modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="explore-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" role="button" tabIndex={0} aria-label={`Explore ${feature.name}`} onClick={() => onSelectFeature(feature.key)}>
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <span>{feature.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// Helper function for basic syntax highlighting
const highlightSyntax = (code, language) => {
    if (!code) return { __html: '' };

    let highlightedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    switch (language) {
        case 'html':
            highlightedCode = highlightedCode
                .replace(/(&lt;!--.*?--&gt;)/g, '<span class="token-comment">$1</span>') // comments
                .replace(/(&lt;\/?)([a-zA-Z0-9\-:]+)/g, '$1<span class="token-tag">$2</span>') // tags
                .replace(/([a-zA-Z-]+)=(".*?")/g, '<span class="token-attr-name">$1</span>=<span class="token-string">$2</span>'); // attributes
            break;
        case 'css':
            highlightedCode = highlightedCode
                .replace(/(\/\*.*?\*\/)/g, '<span class="token-comment">$1</span>') // comments
                .replace(/(?:\b|@)([a-zA-Z-]+)(?=\s*:)/g, '<span class="token-property">$1</span>') // properties
                .replace(/(?<=:)(.*?)(?=;|\})/g, '<span class="token-property-value">$1</span>') // values
                .replace(/(?:[#.]|::?)[a-zA-Z0-9\-_]+/g, '<span class="token-selector">$1</span>') // selectors
                .replace(/@media|@keyframes|@font-face/g, '<span class="token-keyword">$1</span>'); // at-rules
            break;
        case 'js':
        case 'backend':
            highlightedCode = highlightedCode
                .replace(/(\/\*.*?\*\/|\/\/.*)/g, '<span class="token-comment">$1</span>') // comments
                .replace(/(['"`]).*?\1/g, '<span class="token-string">$&</span>') // strings
                .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|new|async|await|class|extends|super|try|catch|finally)\b/g, '<span class="token-keyword">$1</span>') // keywords
                .replace(/\b(true|false|null|undefined|this|document|window|console)\b/g, '<span class="token-boolean">$1</span>')
                .replace(/([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="token-function">$1</span>'); // function calls
            break;
    }

    return { __html: highlightedCode };
};

// --- Code View for Website Builder ---
const CodeView = ({ code }) => {
    const [activeFile, setActiveFile] = useState('html');

    const handleDownload = (filename, content) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    const files = [
        { name: 'index.html', key: 'html' },
        { name: 'style.css', key: 'css' },
        { name: 'script.js', key: 'js' },
        { name: 'server.js', key: 'backend' },
    ];

    const currentCode = code[activeFile] || 'No content available.';
    const lines = currentCode.split('\n');

    return (
        <div className="code-view-container">
            <div className="file-list">
                <p className="file-list-title">Files</p>
                {files.map(file => (
                    <div
                        key={file.key}
                        className={`file-item ${activeFile === file.key ? 'active' : ''}`}
                    >
                        <span className="file-name" onClick={() => setActiveFile(file.key)}>{file.name}</span>
                        <button className="icon-btn" onClick={() => handleDownload(file.name, code[file.key])} aria-label={`Download ${file.name}`}>
                            <DownloadIcon />
                        </button>
                    </div>
                ))}
            </div>
            <div className="code-editor">
                 <div className="line-numbers" aria-hidden="true">
                    {lines.map((_, index) => (
                        <span key={index}>{index + 1}</span>
                    ))}
                </div>
                <pre><code dangerouslySetInnerHTML={highlightSyntax(currentCode, activeFile)}></code></pre>
            </div>
        </div>
    );
};


// --- Responsive Checker View Component ---
const ResponsiveCheckerView = ({ app, onClose }) => {
    const [device, setDevice] = useState('desktop');

    const createPreviewDoc = () => {
        if (!app?.code) return '';
        const { html, css, js } = app.code;
        return html
            .replace(/<link\s+[^>]*href\s*=\s*["']style\.css["'][^>]*>/i, `<style>${css}</style>`)
            .replace(/<script\s+[^>]*src\s*=\s*["']script\.js["'][^>]*>\s*<\/script>/i, `<script>${js}</script>`);
    };

    if (!app) return null;

    return (
        <div className="responsive-checker-overlay">
            <div className="responsive-checker-view">
                <header className="responsive-checker-header">
                    <button className="back-button" onClick={onClose}>
                        <ArrowLeftIcon />
                        <span>Back to Apps</span>
                    </button>
                    <h2>{app.name}</h2>
                    <div className="device-controls">
                        <button onClick={() => setDevice('desktop')} className={device === 'desktop' ? 'active' : ''} aria-label="Desktop view"><DesktopIcon /></button>
                        <button onClick={() => setDevice('tablet')} className={device === 'tablet' ? 'active' : ''} aria-label="Tablet view"><TabletIcon /></button>
                        <button onClick={() => setDevice('mobile')} className={device === 'mobile' ? 'active' : ''} aria-label="Mobile view"><PhoneIcon /></button>
                    </div>
                </header>
                <main className="responsive-checker-main">
                    <div className={`iframe-wrapper device-${device}`}>
                        <iframe srcDoc={createPreviewDoc()} title="Responsive Preview" sandbox="allow-scripts" />
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- Feature View Components ---
const YourAppView = ({ apps, onEdit, onCheckResponsiveness }) => {
    return (
        <div className="your-app-view">
            {apps.length === 0 ? (
                <div className="placeholder-content">
                    <YourAppIcon />
                    <h2>No Saved Apps Yet</h2>
                    <p>Apps you create and save will appear here.</p>
                </div>
            ) : (
                <div className="app-card-list">
                    {apps.map(app => (
                        <div key={app.id} className="app-card">
                            <div className="app-card-info">
                                <h3 className="app-card-title">{app.name}</h3>
                                <p className="app-card-date">Saved on {new Date(app.id).toLocaleDateString()}</p>
                            </div>
                            <div className="app-card-actions">
                                <button className="secondary-btn" onClick={() => onCheckResponsiveness(app)}>Check Responsiveness</button>
                                <button onClick={() => onEdit(app.id)}>Edit App</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AppNameModal = ({ isOpen, onClose, onSave, appName, setAppName }) => {
    if (!isOpen) return null;

    const handleSave = () => {
        if (appName.trim()) {
            onSave(appName.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>Set Your Website Name</h2>
                <p>Give your new project a name to save it.</p>
                <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., My Portfolio"
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className="modal-actions">
                    <button className="secondary-btn" onClick={onClose}>Cancel</button>
                    <button className="primary-btn" onClick={handleSave} disabled={!appName.trim()}>Save</button>
                </div>
            </div>
        </div>
    );
};


const BuildWebsiteView = ({ initialData, onSave }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentView, setCurrentView] = useState('assistant');
    const [generatedCode, setGeneratedCode] = useState(null);
    const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
    const [isAppNameModalOpen, setIsAppNameModalOpen] = useState(false);
    const [initialPrompt, setInitialPrompt] = useState('');
    const [appName, setAppName] = useState('');
    const [generationProgress, setGenerationProgress] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [isSaved, setIsSaved] = useState(true);
    const [appId, setAppId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const messageListRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const recordingTimerRef = useRef<number | null>(null);
    const errorTimeoutRef = useRef<number | null>(null);
    

    useEffect(() => {
        if (initialData) {
            setGeneratedCode(initialData.code);
            setChatMessages([]);
            setAppName(initialData.name);
            setAppId(initialData.id);
            setIsSaved(true);
        } else {
            setGeneratedCode(null);
            setChatMessages([]);
            setAppName('');
            setAppId(null);
            setIsSaved(true);
        }
         // Cleanup function for speech recognition and timers
        return () => {
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [initialData]);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [chatMessages, generationProgress]);
    
    const setAndClearError = (message) => {
        setError(message);
        if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = window.setTimeout(() => setError(''), 5000);
    };

    const createPreviewDoc = () => {
        if (!generatedCode) return '';
        const { html, css, js } = generatedCode;
        return html
            .replace(/<link\s+[^>]*href\s*=\s*["']style\.css["'][^>]*>/i, `<style>${css}</style>`)
            .replace(/<script\s+[^>]*src\s*=\s*["']script\.js["'][^>]*>\s*<\/script>/i, `<script>${js}</script>`);
    };

    const handleSaveProject = () => {
        if (!generatedCode || !appName) return;
        const appData = {
            id: appId,
            name: appName,
            code: generatedCode,
        };
        const savedApp = onSave(appData);
        setAppId(savedApp.id);
        setIsSaved(true);
    };
    
    const handleSaveFromModal = (newAppName) => {
        setAppName(newAppName);
        const appData = { id: appId, name: newAppName, code: generatedCode };
        const savedApp = onSave(appData);
        setAppId(savedApp.id);
        setIsSaved(true);
        setIsAppNameModalOpen(false);

        const confirmationMessage = { role: 'model', text: `Great! I've saved your project as "${newAppName}". What would you like to add next?` };
        setChatMessages(prev => [...prev, confirmationMessage]);
        generateSuggestions();
    };


    const handleUserRequest = async () => {
        const userMessageText = inputValue.trim();
        if (!userMessageText || isLoading) return;
        
        const newUserMessage = { role: 'user', text: userMessageText };
        setInputValue('');
        setIsLoading(true);
        setError('');
        setSuggestions([]);
        
        setChatMessages(prev => [...prev, newUserMessage]);
        
        if (generatedCode) {
            handleModification(userMessageText);
        } else {
            handleAnalysis(userMessageText);
        }
    };

    const handleAnalysis = async (userMessageText) => {
        try {
            setInitialPrompt(userMessageText);
            const ai = getAiInstance();
            const analysisPrompt = `You are a web development planning assistant. A user wants a website with this description: "${userMessageText}". Analyze this and propose a bulleted list of key features and sections. **Crucially, the plan must be for a modern, fully responsive website designed with a mobile-first approach.** This means the layout should work perfectly on a small screen and then adapt for larger screens using CSS media queries. Keep the plan concise. End your response with a question asking for confirmation to start building, like "Does this plan look good to you?". Do not generate any code.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: analysisPrompt,
                config: {
                    temperature: 0.7,
                },
            });
            
            const botResponseText = response.text;
            const newBotMessage = { role: 'model', text: botResponseText };
            setChatMessages(prev => [...prev, newBotMessage]);
            setIsAwaitingConfirmation(true);
        } catch (err) {
            console.error("Website Analysis Error:", err);
            let errorMessage = "Sorry, I couldn't process that request. Please try again.";
            if (err instanceof Error && (err.message.includes('PERMISSION_DENIED') || err.message.includes('API key not valid'))) {
                errorMessage = "There seems to be an issue with the API key. Please ensure it's configured correctly and has the necessary permissions.";
            }
            setAndClearError(errorMessage);
            setChatMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleModification = async (userMessageText) => {
        setIsLoading(true);
        try {
            const ai = getAiInstance();
            const modificationPrompt = `You are an expert web developer AI. A user wants to modify their existing website. 
**Your primary goal is to ensure the website remains or becomes fully responsive across all device sizes (mobile, tablet, desktop).** Use a mobile-first approach and appropriate media queries.

Here is the current code:
HTML:
\`\`\`html
${generatedCode.html}
\`\`\`

CSS:
\`\`\`css
${generatedCode.css}
\`\`\`

JavaScript:
\`\`\`javascript
${generatedCode.js}
\`\`\`

Backend (Node.js):
\`\`\`javascript
${generatedCode.backend}
\`\`\`

The user's request is: "${userMessageText}".

**Instructions:**
1.  Incorporate the user's change request while prioritizing responsiveness. If adding a new element, ensure it is styled correctly for all screen sizes.
2.  Ensure the final result is fully responsive across all screen sizes, from mobile to desktop.
3.  If they ask to remove a feature, remove the corresponding code from all relevant files.
4.  Maintain the existing Google Fonts Material Symbols integration for icons.
5.  Format all code with proper indentation, with each HTML tag on its own line.
6.  Respond ONLY with the JSON object containing the complete, updated code for all four parts (html, css, js, backend).`;

            const response = await ai.models.generateContent({
                 model: "gemini-2.5-flash",
                 contents: modificationPrompt,
                 config: { responseMimeType: "application/json", responseSchema: getCodeSchema(true) },
            });
            const jsonStr = response.text.trim();
            const parsedCode = JSON.parse(jsonStr);
            setGeneratedCode(parsedCode);
            setIsSaved(false);
            
            const botResponse = { role: 'model', text: "I've updated your website with the requested changes. Check out the preview!" };
            setChatMessages(prev => [...prev, botResponse]);
            generateSuggestions();

        } catch (err) {
            console.error("Website Modification Error:", err);
            let errorMessage = "An error occurred while modifying the code. Please try again.";
             if (err instanceof Error && (err.message.includes('PERMISSION_DENIED') || err.message.includes('API key not valid'))) {
                errorMessage = "API Key Error: Could not modify the website. Please check your key configuration.";
            }
            setAndClearError(errorMessage);
            setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I couldn't make that change." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getCodeSchema = (isFullHtml = false) => ({
        type: Type.OBJECT,
        properties: {
            html: { type: Type.STRING, description: isFullHtml ? 'The complete, responsive HTML document, from <!DOCTYPE> to </html>, linking to style.css and script.js and including Google Fonts Material Symbols.' : 'The HTML code for inside the <body> tag.' },
            css: { type: Type.STRING, description: 'The complete, responsive CSS code using modern techniques like flexbox or grid and a mobile-first approach with media queries.' },
            js: { type: Type.STRING, description: 'The complete JavaScript code.' },
            backend: { type: Type.STRING, description: 'A simple Node.js/Express server script.' }
        },
        required: ["html", "css", "js", "backend"]
    });

    const handleConfirmGeneration = async () => {
        setIsAwaitingConfirmation(false);
        setIsLoading(true);
        setError('');
        setSuggestions([]);
        setGenerationProgress({ html: 'generating', css: 'generating', js: 'generating', backend: 'generating' });

        try {
            const ai = getAiInstance();
            const generationPrompt = `Generate a complete, production-quality, and fully responsive website based on the description: "${initialPrompt}". The design must be strictly mobile-first. This means the base CSS should be for mobile screens, and you must use media queries (e.g., min-width: 768px for tablets, min-width: 1024px for desktops) to adapt the layout for larger screens. Use modern CSS like Flexbox or Grid.
**Instructions:**
1.  **Code Structure:** Provide four complete, self-contained code blocks: a full HTML document (from <!DOCTYPE> to </html>, with a viewport meta tag, linking to 'style.css' and a deferred 'script.js'), CSS, JavaScript, and a simple Node.js Express server.
2.  **Icons:** Integrate Google Fonts Material Symbols by adding this link tag to the HTML head: \`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />\`. Use the icons where appropriate in the HTML, for example: \`<span class="material-symbols-outlined">menu</span>\`.
3.  **Formatting:** Format the HTML with each tag on its own line for maximum readability. Format the CSS with each rule and declaration on a new line. Ensure all code is well-indented.
4.  **Responsiveness is mandatory:** Every element and layout must be tested for responsiveness. The final result should look great on all devices.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: generationPrompt,
                config: { responseMimeType: "application/json", responseSchema: getCodeSchema(true) },
            });

            const jsonStr = response.text.trim();
            const parsedCode = JSON.parse(jsonStr);

            setTimeout(() => setGenerationProgress(p => ({ ...p, html: 'complete' })), 500);
            setTimeout(() => setGenerationProgress(p => ({ ...p, css: 'complete' })), 1000);
            setTimeout(() => setGenerationProgress(p => ({ ...p, js: 'complete' })), 1500);
            setTimeout(() => {
                setGenerationProgress(p => ({ ...p, backend: 'complete' }));
                setGeneratedCode(parsedCode);
                setIsSaved(false);
                setAppName(''); // Reset app name for the modal
                setIsAppNameModalOpen(true);
                setIsLoading(false);
            }, 2000);

        } catch (err) {
            console.error("Website Generation Error:", err);
            let errorMessage = "An error occurred while generating the code. Please try again.";
             if (err instanceof Error && (err.message.includes('PERMISSION_DENIED') || err.message.includes('API key not valid'))) {
                errorMessage = 'There is an issue with your API key. Please ensure it is configured correctly.';
            }
            setAndClearError(errorMessage);
            setGenerationProgress(null);
            setIsLoading(false);
        }
    };

    const generateSuggestions = async () => {
        try {
            const ai = getAiInstance();
            const suggestionsPrompt = `Based on the website just generated for the prompt "${initialPrompt}", provide exactly 4 brief, actionable suggestions for new features or improvements. Examples: "Add a contact form", "Create a photo gallery", "Implement a dark mode toggle". Return these as a JSON object with a key "suggestions" containing an array of 4 strings.`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: suggestionsPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } },
                        required: ["suggestions"]
                    },
                },
            });
            const suggestionsJson = JSON.parse(response.text.trim());
            if (suggestionsJson.suggestions && suggestionsJson.suggestions.length > 0) {
                 setSuggestions(suggestionsJson.suggestions);
            }
        } catch (err) {
            console.error("Failed to generate suggestions:", err);
        }
    };
    
    const handleMicClick = () => { isRecording ? stopRecording() : startRecording(); };
    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    const startRecording = () => {
        // Fix: Cast window to 'any' to access non-standard SpeechRecognition properties
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!navigator.onLine) { setAndClearError("You seem to be offline. Check your internet connection."); return; }
        if (!SpeechRecognition) { setAndClearError("Speech recognition is not supported in your browser."); return; }

        setIsRecording(true);
        setRecordingTime(0);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event) => {
            let final_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) final_transcript += event.results[i][0].transcript;
            }
            if (final_transcript) setInputValue(prev => prev + final_transcript);
        };
        recognitionRef.current.onend = () => stopRecording(false);
        recognitionRef.current.onerror = (event) => {
            let msg = `An unknown recording error occurred: ${event.error}`;
            if (event.error.match(/network|not-allowed|service-not-allowed|no-speech|audio-capture/)) {
                msg = {
                    'network': "Speech recognition failed due to a network error.",
                    'not-allowed': "Microphone access denied. Please allow microphone permissions.",
                    'service-not-allowed': "Microphone access denied. Please allow microphone permissions.",
                    'no-speech': "No speech was detected. Make sure your microphone is working.",
                    'audio-capture': "Could not start microphone. Ensure it's not in use elsewhere."
                }[event.error];
            }
            setAndClearError(msg);
            stopRecording(false);
        };
        recognitionRef.current.start();
        recordingTimerRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    };

    const stopRecording = (manual = true) => {
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        if (recognitionRef.current && manual) recognitionRef.current.stop();
        setIsRecording(false);
    };


    const handleSuggestionClick = (suggestion) => {
        const newPrompt = `Please add the following feature to my website: ${suggestion}.`;
        setInputValue(newPrompt);
        setSuggestions([]);
        inputRef.current?.focus();
    };
    
    const GenerationProgress = () => {
        if (!generationProgress) return null;
        const files = [
            { key: 'html', name: 'index.html' },
            { key: 'css', name: 'style.css' },
            { key: 'js', name: 'script.js' },
            { key: 'backend', name: 'server.js' },
        ];
        return (
            <div className="generation-progress-container">
                <h3>Building your website...</h3>
                <ul className="generation-file-list">
                    {files.map(file => (
                        <li key={file.key} className={`file-status ${generationProgress[file.key]}`}>
                            <span>{file.name}</span>
                            <div className="status-indicator">
                                {generationProgress[file.key] === 'generating' && <div className="loader-small"></div>}
                                {generationProgress[file.key] === 'complete' && <CheckCircleIcon />}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="build-website-view">
            <AppNameModal isOpen={isAppNameModalOpen} onClose={() => setIsAppNameModalOpen(false)} onSave={handleSaveFromModal} appName={appName} setAppName={setAppName}/>
             <div className="website-builder-header">
                <div className="website-view-tabs">
                    <button onClick={() => setCurrentView('assistant')} className={currentView === 'assistant' ? 'active' : ''}>Code Assistant</button>
                    <button onClick={() => setCurrentView('preview')} className={currentView === 'preview' ? 'active' : ''} disabled={!generatedCode}>Preview</button>
                    <button onClick={() => setCurrentView('code')} className={currentView === 'code' ? 'active' : ''} disabled={!generatedCode}>Code</button>
                </div>
                {generatedCode && (
                    <div className="website-save-area">
                        <button className={`save-project-btn ${isSaved ? 'saved' : 'unsaved'}`} onClick={handleSaveProject} disabled={isSaved}>
                            <span>{isSaved ? 'Saved' : 'Unsaved'}</span>
                            <SaveIcon />
                        </button>
                    </div>
                )}
            </div>
            <div className="website-builder-content">
                {currentView === 'assistant' && (
                    <div className="assistant-chat-view">
                        <div className="message-list" ref={messageListRef}>
                            {chatMessages.length === 0 && !generationProgress ? (
                                <div className="welcome-container">
                                    {initialData ? (
                                        <>
                                            <h2 className="assistant-title">Editing "{appName}"</h2>
                                            <p className="feature-description">Describe the changes or new features you'd like to add.</p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="assistant-title">Build Your Website with AI</h2>
                                            <p className="feature-description">Describe the website you want to create below.</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                chatMessages.map((msg, index) => (
                                    <div key={index} className={`message-container ${msg.role}`}>
                                        <div className="message-bubble"><p>{msg.text}</p></div>
                                    </div>
                                ))
                            )}
                            {isLoading && !generationProgress && (
                                 <div className="message-container model">
                                     <div className="message-bubble loading-bubble">
                                         <div className="loader-small"></div>
                                     </div>
                                 </div>
                            )}
                            {generationProgress && <GenerationProgress />}
                            {error && <div className="feature-error-message">{error}</div>}
                        </div>
                        <div className="assistant-input-area">
                            {isAwaitingConfirmation && (
                                <div className="confirmation-buttons">
                                    <button onClick={handleConfirmGeneration}>Confirm & Build</button>
                                    <button onClick={() => { setIsAwaitingConfirmation(false); setChatMessages(prev => [...prev, {role: 'user', text: "Cancel."}]) }}>Cancel</button>
                                </div>
                            )}
                             {suggestions.length > 0 && (
                                <div className="suggestion-chips">
                                    {suggestions.map((suggestion, index) => (
                                        <button key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="website-builder-input-controls">
                                <div className="website-builder-input-wrapper">
                                    <button className={`icon-btn mic-btn ${isRecording ? 'recording' : ''}`} onClick={handleMicClick} aria-label={isRecording ? 'Stop recording' : 'Record voice'} disabled={isLoading || isAwaitingConfirmation}><ModernMicIcon /></button>
                                    {isRecording ? (
                                        <div className="recording-indicator" onClick={() => stopRecording()}>
                                            <div className="voice-wave">
                                                <span></span><span></span><span></span><span></span>
                                            </div>
                                            <span className="recording-timer">{formatTime(recordingTime)}</span>
                                        </div>
                                    ) : (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUserRequest()}
                                            placeholder="Type or record a message..."
                                            disabled={isLoading || isAwaitingConfirmation}
                                        />
                                    )}
                                    <button className="icon-btn" aria-label="Attach file" disabled={isLoading || isAwaitingConfirmation || isRecording}><PlusIcon /></button>
                                </div>
                                <button className="send-btn" onClick={handleUserRequest} disabled={!inputValue.trim() || isLoading || isAwaitingConfirmation || isRecording}>
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {currentView === 'preview' && generatedCode && <iframe srcDoc={createPreviewDoc()} title="Website Preview" sandbox="allow-scripts" className="website-preview-iframe" />}
                {currentView === 'code' && generatedCode && <CodeView code={generatedCode} />}
            </div>
        </div>
    );
};

const TextToImageView = () => (
    <>
        <p className="feature-description">Describe the image you want to create.</p>
        <div className="feature-input-area">
            <textarea placeholder="e.g., A photo of a surrealist painting of a cat playing chess..." rows={3}></textarea>
            <button className="feature-action-btn">Generate Image</button>
        </div>
    </>
);

const TextToVideoView = () => (
    <>
        <p className="feature-description">Describe the video you want to create.</p>
        <div className="feature-input-area">
            <textarea placeholder="e.g., A cinematic shot of a futuristic city at night, with flying cars..." rows={3}></textarea>
            <button className="feature-action-btn">Generate Video</button>
        </div>
    </>
);

const ImageToVideoView = () => (
    <>
        <p className="feature-description">Upload an image and describe how you want to animate it.</p>
        <div className="feature-input-area column">
             <div className="upload-box">
                <p>Click or drag to upload an image</p>
            </div>
            <textarea placeholder="e.g., Make the clouds in the image move slowly..." rows={2}></textarea>
            <button className="feature-action-btn">Generate Video</button>
        </div>
    </>
);

const ImageUpscalingView = () => {
    const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
    const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file.');
                return;
            }
            setError('');
            setUpscaledImage(null);
            const base64 = await fileToBase64(file);
            setOriginalImage({ file, base64 });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpscale = async () => {
        if (!originalImage) return;
        setIsLoading(true);
        setError('');
        setUpscaledImage(null);

        try {
            const ai = getAiInstance();
            const imagePart = {
                inlineData: {
                    data: originalImage.base64.split(',')[1],
                    mimeType: originalImage.file.type,
                },
            };
            const textPart = {
                text: 'Upscale this image to a higher resolution, enhancing its details and clarity without changing the original content or style.',
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    setUpscaledImage(imageUrl);
                    foundImage = true;
                    break;
                }
            }
            if (!foundImage) {
                throw new Error("The AI did not return an upscaled image. It might have refused the request.");
            }

        } catch (err) {
            console.error("Image Upscaling Error:", err);
            let errorMessage = "An error occurred while upscaling the image.";
            if (err instanceof Error) {
                if (err.message.includes('PERMISSION_DENIED') || err.message.includes('API key not valid')) {
                    errorMessage = 'There seems to be an issue with your API key. Please check its configuration and permissions.';
                } else if (err.message.includes("did not return an upscaled image")) {
                    errorMessage = "The AI did not return an upscaled image. It might have refused the request due to safety policies.";
                } else if (err.message) {
                    errorMessage = `An error occurred: ${err.message}`;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <p className="feature-description">Upload an image, and the AI will attempt to increase its resolution and enhance details.</p>
            <div className="feature-input-area column">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    aria-hidden="true"
                />
                {!originalImage && (
                    <div className="upload-box" onClick={handleUploadClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}>
                        <p>Click to upload an image</p>
                        <span className="upload-box-subtitle">PNG, JPG, WEBP recommended</span>
                    </div>
                )}

                {originalImage && (
                    <div className="image-preview-container">
                        <div className="image-preview-box">
                            <h3>Original</h3>
                            <img src={originalImage.base64} alt="Original user upload" />
                        </div>
                        {isLoading && (
                            <div className="image-preview-box loading">
                               <h3>Upscaling...</h3>
                               <div className="loader"></div>
                               <p>This may take a moment.</p>
                            </div>
                        )}
                        {upscaledImage && (
                            <div className="image-preview-box">
                                <h3>Upscaled</h3>
                                <img src={upscaledImage} alt="AI upscaled result" />
                                <a href={upscaledImage} download="upscaled-image.png" className="download-btn">
                                    Download Image
                                </a>
                            </div>
                        )}
                    </div>
                )}
                 <div className="feature-actions">
                    <button className="feature-action-btn" onClick={handleUpscale} disabled={!originalImage || isLoading}>
                        {isLoading ? 'Processing...' : 'Upscale Image'}
                    </button>
                    {originalImage && (
                         <button className="feature-secondary-btn" onClick={() => { setOriginalImage(null); setUpscaledImage(null); setError(''); }} disabled={isLoading}>
                            Clear Image
                        </button>
                    )}
                </div>
                 {error && <div className="feature-error-message">{error}</div>}
            </div>
        </>
    );
};


const TextToSpeechView = () => {
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = () => {
        if (!text.trim() || !('speechSynthesis'in window)) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <>
            <p className="feature-description">Enter any text below, and the AI will read it aloud for you using your browser's speech engine.</p>
            <div className="feature-input-area">
                <textarea 
                    placeholder="e.g., Hello world! This is a test of the text-to-speech feature." 
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className="feature-action-btn" onClick={isSpeaking ? handleStop : handleSpeak} disabled={!text.trim()}>
                    {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </button>
            </div>
        </>
    );
};


// --- Fullscreen Feature Page Component ---
// Fix: Refactored FeaturePage to use a switch statement for rendering components.
// This ensures that components are only rendered when they are active and receive the correct props,
// resolving the TypeScript errors about missing properties.
const FeaturePage = ({ featureKey, onClose, apps, onEdit, onCheckResponsiveness, initialData, onSave }) => {
    const features = {
        'your-app': { title: 'Your App' },
        'build-website': { title: 'Build a Website' },
        'text-to-image': { title: 'Text to Image' },
        'text-to-video': { title: 'Text to Video' },
        'image-to-video': { title: 'Image to Video' },
        'image-upscaling': { title: 'Image Upscaling' },
        'text-to-speech': { title: 'Text to Speech' },
    };

    const currentFeature = features[featureKey];
    if (!currentFeature) return null;

    const renderComponent = () => {
        switch (featureKey) {
            case 'your-app':
                return <YourAppView apps={apps} onEdit={onEdit} onCheckResponsiveness={onCheckResponsiveness} />;
            case 'build-website':
                return <BuildWebsiteView initialData={initialData} onSave={onSave} />;
            case 'text-to-image':
                return <TextToImageView />;
            case 'text-to-video':
                return <TextToVideoView />;
            case 'image-to-video':
                return <ImageToVideoView />;
            case 'image-upscaling':
                return <ImageUpscalingView />;
            case 'text-to-speech':
                return <TextToSpeechView />;
            default:
                return null;
        }
    };

    return (
        <div className="feature-page-overlay">
            <div className="feature-page-container">
                <header className="feature-page-header">
                    <h1 className="gradient-text">{currentFeature.title}</h1>
                    <div className="feature-header-actions">
                        <button className="icon-btn close-btn" onClick={onClose} aria-label="Close feature">
                            <CloseIcon />
                        </button>
                    </div>
                </header>
                <div className="feature-page-content">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};


// --- Chat Page Component ---
const ChatPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);
    const [chatKey, setChatKey] = useState(Date.now());
    const [savedApps, setSavedApps] = useState([]);
    const [appToEdit, setAppToEdit] = useState(null);
    const [appForResponsiveCheck, setAppForResponsiveCheck] = useState(null);

    const handleRegisterClick = () => {
        // Placeholder for registration logic
        console.log("Register button clicked.");
        // Maybe open a registration modal in the future
    };

    const handleFeatureSelect = (featureType) => {
        setIsExploreModalOpen(false);
        if (featureType !== 'build-website') {
             setAppToEdit(null); // Clear any app being edited if we switch to another feature
        }
        setActiveFeature(featureType);
    };
    
    const handleCloseFeature = (closedFeatureKey) => {
        setActiveFeature(null);
        setAppToEdit(null); // Always clear edited app on close
        if (closedFeatureKey === 'your-app') {
            setIsSidebarOpen(true);
        } else {
            setIsExploreModalOpen(true);
        }
    };
    
    const handleSaveApp = (appData) => {
        let savedApp = { ...appData };
        setSavedApps(prevApps => {
            const existingIndex = prevApps.findIndex(app => app.id === appData.id);
            if (existingIndex > -1) {
                // Update existing app
                const updatedApps = [...prevApps];
                updatedApps[existingIndex] = appData;
                savedApp = appData;
                return updatedApps;
            } else {
                // Add new app
                const newApp = { ...appData, id: Date.now() };
                savedApp = newApp;
                return [...prevApps, newApp];
            }
        });
        return savedApp; // Return the app with its ID
    };

    const handleEditApp = (appId) => {
        const app = savedApps.find(app => app.id === appId);
        if (app) {
            setAppToEdit(app);
            setActiveFeature('build-website');
        }
    };

    const handleCheckResponsiveness = (app) => {
        setActiveFeature(null); // Close the 'Your App' page
        setAppForResponsiveCheck(app); // Open the checker
    };

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-title-close">
                        <h3 className="gradient-text">Pro Nex Ai</h3>
                        <button className="icon-btn close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
                            <CloseIcon />
                        </button>
                    </div>
                     <div className="input-wrapper sidebar-search">
                        <SearchIcon/>
                        <input type="text" placeholder="Search..." className="sidebar-search-input"/>
                    </div>
                     <div className="profile-item" onClick={() => { setIsSidebarOpen(false); setIsExploreModalOpen(true); }}>
                        <div className="profile-item-left">
                           <ExploreIcon/>
                           <span>Explore</span>
                        </div>
                        <ArrowRightIcon />
                    </div>
                    <div className="profile-item" onClick={() => { setIsSidebarOpen(false); handleFeatureSelect('your-app'); }}>
                        <div className="profile-item-left">
                           <YourAppIcon/>
                           <span>Your App</span>
                        </div>
                        <ArrowRightIcon />
                    </div>
                </div>
                <div className="sidebar-content">
                    {/* Future chat history can go here */}
                </div>
                <div className="sidebar-footer">
                    <div className="profile-item">
                        <div className="profile-item-left">
                            <div className="profile-icon-wrapper">
                                <ProfileIcon />
                            </div>
                            <span>My Profile</span>
                        </div>
                        <ArrowRightIcon />
                    </div>
                </div>
            </aside>
            
            <ExploreModal isOpen={isExploreModalOpen} onClose={() => setIsExploreModalOpen(false)} onSelectFeature={handleFeatureSelect} />
            
            <ResponsiveCheckerView app={appForResponsiveCheck} onClose={() => { setAppForResponsiveCheck(null); handleFeatureSelect('your-app'); }} />

            {activeFeature && (
                <FeaturePage
                    featureKey={activeFeature}
                    onClose={() => handleCloseFeature(activeFeature)}
                    // Props for 'your-app'
                    apps={savedApps}
                    onEdit={handleEditApp}
                    onCheckResponsiveness={handleCheckResponsiveness}
                    // Props for 'build-website'
                    initialData={appToEdit}
                    onSave={(appData) => {
                        const savedApp = handleSaveApp(appData);
                        if (savedApp.id !== appToEdit?.id) {
                            setAppToEdit(savedApp);
                        }
                        return savedApp;
                    }}
                />
            )}

            <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="main-content">
                <header>
                    <div className="header-left">
                        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                            <MenuIcon />
                        </button>
                        <h3 className="gradient-text">Pro Nex Ai</h3>
                    </div>
                    <button className="new-chat-btn" onClick={handleRegisterClick}>
                        <span>Register</span>
                    </button>
                </header>
                <main>
                    <ChatView key={chatKey} />
                </main>
            </div>
        </div>
    );
};

// --- Chat View Component ---
const ChatView = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);

    const chatRef = useRef<Chat | null>(null);
    const stopGenerationRef = useRef(false);
    const errorTimeoutRef = useRef<number | null>(null);
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const recordingTimerRef = useRef<number | null>(null);

    useEffect(() => {
        try {
            const ai = getAiInstance();
            chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });
        } catch (e: any) {
             setAndClearError(e.message || "An unknown error occurred during AI initialization.");
        }
        return () => { // Cleanup function
            if (errorTimeoutRef.current) window.clearTimeout(errorTimeoutRef.current);
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            if (recognitionRef.current) recognitionRef.current.stop();
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        if (textareaRef.current && !isRecording) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [inputValue, isRecording]);

    const setAndClearError = (message: string) => {
        setError(message);
        if (errorTimeoutRef.current) window.clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = window.setTimeout(() => setError(''), 5000);
    };
    
    const handleStopGeneration = () => {
        stopGenerationRef.current = true;
        setIsLoading(false);
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };
    
    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!navigator.onLine) {
            setAndClearError("You seem to be offline. Please check your internet connection.");
            return;
        }
        if (!SpeechRecognition) {
            setAndClearError("Speech recognition is not supported in your browser.");
            return;
        }
        setIsRecording(true);
        setRecordingTime(0);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
            let final_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                }
            }
             if (final_transcript) {
                setInputValue(prev => prev + final_transcript);
            }
        };

        recognitionRef.current.onend = () => {
            stopRecording(false);
        };
        
        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            let errorMessage = `An unknown recording error occurred: ${event.error}`;
            switch (event.error) {
                case 'network':
                    errorMessage = "Speech recognition failed due to a network error. Please check your internet connection.";
                    break;
                case 'not-allowed':
                case 'service-not-allowed':
                    errorMessage = "Microphone access denied. Please allow microphone permissions in your browser settings to use this feature.";
                    break;
                case 'no-speech':
                    errorMessage = "No speech was detected. Make sure your microphone is working and try again.";
                    break;
                case 'audio-capture':
                    errorMessage = "Could not start microphone. Please ensure it's connected and not in use by another application.";
                    break;
            }
            setAndClearError(errorMessage);
            stopRecording(false);
        };

        recognitionRef.current.start();
        recordingTimerRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };
    
    const stopRecording = (manual = true) => {
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        if (recognitionRef.current && manual) recognitionRef.current.stop();
        setIsRecording(false);
    };
    
    const handleHardcodedResponse = (userText, botText) => {
        const userMessage = { role: 'user', text: userText, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage, { role: 'model', text: '', timestamp: new Date() }]);
        setInputValue('');
        setIsLoading(true);

        setTimeout(() => {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'model') {
                    lastMessage.text = botText;
                }
                return newMessages;
            });
            setIsLoading(false);
        }, 800);
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        
        const originalMessage = messageText.trim();
        const lowerCaseMessage = originalMessage.toLowerCase();
        
        window.speechSynthesis.cancel();
        setSpeakingMessageIndex(null);

        if (lowerCaseMessage.includes('your name')) {
            handleHardcodedResponse(originalMessage, "My name is Pro Nex Ai.");
            return;
        }
        if (lowerCaseMessage.includes('who created you') || lowerCaseMessage.includes('who made you')) {
            handleHardcodedResponse(originalMessage, "I was created by Imtiaz Ali jamali.");
            return;
        }
        
        setIsLoading(true);
        setError('');
        setInputValue('');
        stopGenerationRef.current = false;

        const userMessage = { role: 'user', text: originalMessage, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage, { role: 'model', text: '', timestamp: new Date() }]);

        try {
            if (!chatRef.current) throw new Error("Chat not initialized.");
            
            const result = await chatRef.current.sendMessageStream({ message: originalMessage });

            let streamedText = '';
            for await (const chunk of result) {
                if (stopGenerationRef.current) break;
                streamedText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        lastMessage.text = streamedText;
                    }
                    return newMessages;
                });
            }
        } catch (err) {
            console.error('Gemini API Error:', err);
            let errorMessage = 'Sorry, something went wrong. Please try again.';
            if (err instanceof Error) {
                if (err.message.includes('API key not valid') || err.message.includes('PERMISSION_DENIED')) {
                    errorMessage = 'Your API key appears to be invalid or missing permissions. Please check your configuration.';
                } else if (err.message.includes('400') || err.message.includes('500') || err.message.includes('http status code: 0')) {
                    errorMessage = 'Network issue: Could not connect to the AI. This may be due to an invalid API key or a network problem.';
                }
            }
            setAndClearError(errorMessage);
            setMessages(prev => prev.slice(0, -1)); // Remove placeholder
        } finally {
            setIsLoading(false);
            stopGenerationRef.current = false;
        }
    };

    const handleReadAloud = (text: string, index: number) => {
        if (!('speechSynthesis' in window)) {
            setAndClearError("Sorry, your browser doesn't support text-to-speech.");
            return;
        }

        if (speakingMessageIndex === index) {
            window.speechSynthesis.cancel();
            setSpeakingMessageIndex(null);
            return;
        }
        
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setSpeakingMessageIndex(index);
        utterance.onend = () => setSpeakingMessageIndex(null);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setAndClearError("An error occurred during speech synthesis.");
            setSpeakingMessageIndex(null);
        };
        
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = () => {
        sendMessage(inputValue);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="chat-view">
            <div className="message-list" ref={messageListRef}>
                {messages.length === 0 ? (
                    <div className="welcome-container">
                        <h1 className="welcome-title">
                            <span>Hi, I am </span>
                            <span className="welcome-gradient-text">Pro Nex</span>
                        </h1>
                        <p className="welcome-subtitle">How can I help you today?</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message-container ${msg.role}`}>
                            <div className="message-content-wrapper">
                                <div className="message-bubble">
                                    <p>{msg.text}</p>
                                    {isLoading && msg.role === 'model' && index === messages.length - 1 && <span className="typing-cursor">|</span>}
                                </div>
                                <div className="message-meta">
                                    <span className="timestamp">{msg.timestamp.toLocaleTimeString()}</span>
                                    {msg.role === 'model' && msg.text && !isLoading && (
                                         <button
                                             className="icon-btn tts-btn"
                                             onClick={() => handleReadAloud(msg.text, index)}
                                             aria-label={speakingMessageIndex === index ? "Stop reading" : "Read aloud"}
                                         >
                                             {speakingMessageIndex === index ? <StopIcon /> : <SpeakerIcon />}
                                         </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="input-area">
                {error && <div className="error-message">{error}</div>}
                <div className="input-controls">
                     <div className="input-wrapper">
                        <button className={`icon-btn mic-btn ${isRecording ? 'recording' : ''}`} onClick={handleMicClick} disabled={isLoading} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
                            <ModernMicIcon />
                        </button>
                        {isRecording ? (
                            <div className="recording-indicator" onClick={() => stopRecording()}>
                                <div className="voice-wave">
                                    <span></span><span></span><span></span><span></span>
                                </div>
                                <span className="recording-timer">{formatTime(recordingTime)}</span>
                            </div>
                        ) : (
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                // Fix: The 'rows' attribute expects a number, not a string.
                                rows={1}
                                disabled={isLoading}
                            />
                        )}
                         <button className="icon-btn" disabled={isLoading || isRecording} aria-label="Attach file">
                             <PlusIcon />
                         </button>
                    </div>
                    <button 
                        className="send-btn" 
                        onClick={isLoading ? handleStopGeneration : handleSend} 
                        disabled={!isLoading && (!inputValue.trim() || isRecording)}
                        aria-label={isLoading ? 'Stop generation' : 'Send message'}
                    >
                        {isLoading ? <StopIcon/> : <SendIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
};


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);