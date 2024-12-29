import React, { useState, useRef } from 'react';
import { Send, FileUp, Download, Bot, User, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    file?: File;
}

function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = async () => {
        if (!input.trim() && !selectedFile) return;

        const formData = new FormData();
        formData.append('input', input);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
            file: selectedFile || undefined
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsLoading(true);

        try {

            const token = localStorage.getItem('authToken');
            // Llamada al backend
            const response = await fetch('http://localhost:8080/api/edu-assistant/example', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en la comunicación con el servidor');
            }

            const data = await response.json();

            // Manejar la respuesta del bot
            const botMessage: Message = {
                id: crypto.randomUUID(),
                text: data.message.text || 'No se recibió una respuesta del servidor',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                text: 'Hubo un error al procesar tu mensaje.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const exportToPDF = async () => {
        if (!chatRef.current) return;

        const canvas = await html2canvas(chatRef.current);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`chat-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Bot className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-xl font-semibold text-gray-800">Chat Assistant</h1>
                </div>
                <button
                    onClick={exportToPDF}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                </button>
            </div>

            {/* Chat Messages */}
            <div
                ref={chatRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`flex items-start space-x-2 max-w-[80%] ${
                                message.sender === 'user'
                                    ? 'flex-row-reverse space-x-reverse'
                                    : 'flex-row'
                            }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    message.sender === 'user'
                                        ? 'bg-indigo-100'
                                        : 'bg-gray-100'
                                }`}
                            >
                                {message.sender === 'user' ? (
                                    <User className="w-5 h-5 text-indigo-600" />
                                ) : (
                                    <Bot className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                            <div
                                className={`rounded-lg px-4 py-2 ${
                                    message.sender === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white border border-gray-200'
                                }`}
                            >
                                <div className="text-sm">{message.text}</div>
                                {message.file && (
                                    <div className="mt-2 flex items-center text-sm">
                                        <Paperclip className="w-4 h-4 mr-1" />
                                        <span>{message.file.name}</span>
                                    </div>
                                )}
                                <div
                                    className={`text-xs mt-1 ${
                                        message.sender === 'user'
                                            ? 'text-indigo-200'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {format(message.timestamp, 'HH:mm')}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex flex-col space-y-2">
                    {selectedFile && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <Paperclip className="w-4 h-4" />
                            <span>{selectedFile.name}</span>
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="text-red-500 hover:text-red-700 ml-auto"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <div className="flex items-end space-x-4">
                        <div className="flex-1">
              <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full resize-none rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-sm"
                  rows={1}
              />
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="relative group">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <FileUp className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="absolute bottom-full mb-2 hidden group-hover:block">
                                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                        Adjuntar archivo
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() && !selectedFile}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;