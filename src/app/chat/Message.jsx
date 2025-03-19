import { useState } from 'react'
import Image from 'next/image'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const Message = ({ message, user }) => {
  const [imageError, setImageError] = useState(false)

  // Use the correct path to your image
  const botImagePath = '/docs/bot.webp' // This maps to public/docs/bot.webp

  // Fallback image as data URL in case of errors
  const botImageFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Ccircle cx='16' cy='16' r='16' fill='%235A67D8'/%3E%3Cpath d='M16 8C12.7 8 10 10.7 10 14V16C10 19.3 12.7 22 16 22C19.3 22 22 19.3 22 16V14C22 10.7 19.3 8 16 8ZM20 16C20 18.2 18.2 20 16 20C13.8 20 12 18.2 12 16V14C12 11.8 13.8 10 16 10C18.2 10 20 11.8 20 14V16Z' fill='white'/%3E%3Cpath d='M16 24C13.2 24 10.8 22.6 9.6 20.6L8 21.5C9.5 24 12.6 26 16 26C19.4 26 22.5 24.2 24 21.5L22.4 20.6C21.2 22.6 18.8 24 16 24Z' fill='white'/%3E%3C/svg%3E";

  return (
    <div className={`max-w-[70%] flex ${user ? 'flex-row-reverse' : 'flex-row'} ${user ? 'ml-auto' : 'mr-auto'} items-center gap-[8px] my-[8px] `}>
      {/* User avatar or bot avatar */}
      {user ? (
        <div className="h-[32px] w-[32px] bg-[#1E2B56] rounded-full flex items-center justify-center text-white mr-2">
          <span>U</span>
        </div>
      ) : (
        <div className="mr-2">
          <Image
            alt={'bot'}
            src={imageError ? botImageFallback : botImagePath}
            width={32}
            height={32}
            className='rounded-full'
            onError={() => setImageError(true)}
          />
        </div>
      )}

      <div className={`p-[26px] rounded-[8px] ${user ? 'bg-[#1E2B56] text-[#ffffff]' : 'border border-[#1E2B56] bg-[#ffffff] text-[#1e2b56]'}`}>
        {user ? (
          message
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-3" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-3" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 underline" {...props} />,
                code: ({ node, inline, ...props }) =>
                  inline
                    ? <code className="bg-gray-100 px-1 rounded font-mono text-sm" {...props} />
                    : <code className="block bg-gray-100 p-2 rounded font-mono text-sm my-2" {...props} />,
                svg: ({ node, ...props }) => {
                  const fixedProps = {};
                  Object.keys(props).forEach(key => {
                    if (key.includes('-')) {
                      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                      fixedProps[camelCaseKey] = props[key];
                    } else {
                      fixedProps[key] = props[key];
                    }
                  });

                  return <svg {...fixedProps} />;
                },
                path: ({ node, ...props }) => {
                  const fixedProps = {};
                  Object.keys(props).forEach(key => {
                    if (key.includes('-')) {
                      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                      fixedProps[camelCaseKey] = props[key];
                    } else {
                      fixedProps[key] = props[key];
                    }
                  });

                  return <path {...fixedProps} />;
                }
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
