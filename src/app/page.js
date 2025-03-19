'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Message from './chat/Message';

const prompts = ['Why can’t I edit the annual question?', 'How to reset my password?', 'Why can’t I freeze the data?']

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e, input) => {
        console.log('clicked', input.trim())
        if (!input.trim() || isLoading) return;
        console.log('clicked222')

        const userMessage = { role: 'user', content: input };

        // Add user message to chat
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Call API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                }),
            });

            console.log('@@', response)

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            // For our simplified version, we'll just get the text response
            const text = await response.text(); -

                // Add assistant message to chat
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: text
                }]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    console.log(messages)

    return (
        <main className=" py-[2rem] px-[4rem] h-[100vh] w-[100vw] bg-[#DEEEF3] relative">

            <h1 className="text-[3rem] font-[700] text-center text-[#1E2B56]">Oren Support</h1>
            <p className="text-center mt-[8px] text-[#1E2B56]">
                Welcome to Oren support. Our AI-powered chatbot can help answer your questions about our product.
            </p>

            <div className="h-[70vh] max-h-[70vh] overflow-y-auto my-[1rem]">
                {messages.map((message, index) => (
                    <Message key={index} message={message.content} user={message.role === 'user'} />
                ))}
                {isLoading && <div className="text-[#1E2B56]">Loading...</div>}
            </div>
            <div className="fixed bottom-[2rem] left-[50%] translate-x-[-50%] w-[50%] bg-[#FFFFFF] rounded-[1rem]">
                <textarea
                    type="text"
                    placeholder="Ask a question"
                    className="w-[90%] h-[60px] p-[1rem] rounded-[1rem] resize-none focus:outline-none"
                    value={input}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                <div className="w-[100%] flex flex-row justify-between items-center mt-[12px] p-[1rem]">
                    <div className="flex flex-row items-center gap-[0.5rem]">
                        {prompts.map((prompt, index) => (
                            <div onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e, prompt);
                            }} key={index} className="cursor-pointer bg-[#FFFFFF] text-[#1E2B56] p-[10px] rounded-[4px] z-[999] border border-[#1E2B56]">
                                {prompt}
                            </div>
                        ))}
                    </div>
                    <button
                        className="cursor-pointer bg-[#1E2B56] text-[#FFFFFF] px-[0.5rem] py-[0.5rem] rounded-[4px] z-[999]"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e, input);
                        }}
                        disabled={isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clip-path="url(#clip0_23342_72228)">
                                <path d="M14.3724 1.42236L7.03906 8.7557M14.3724 1.42236L9.70573 14.7557L7.03906 8.7557M14.3724 1.42236L1.03906 6.08903L7.03906 8.7557" stroke="#FAFFFE" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_23342_72228">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>

        </main>
    );
} 