import React, { useEffect, useRef } from 'react';
import type { Message } from '../api/sessions';

interface ChatFeedProps {
  messages: Message[];
}

export const ChatFeed: React.FC<ChatFeedProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 italic mt-10">
          Start a conversation...
        </div>
      )}
      
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        return (
          <div 
            key={idx} 
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                isUser 
                  ? 'bg-cyan-900/30 text-cyan-50 border border-cyan-800/50 rounded-br-sm' 
                  : 'bg-gray-800 text-gray-100 border border-gray-700/50 rounded-bl-sm'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1 uppercase font-mono tracking-wider">
                {isUser ? 'You' : 'Victus'}
              </div>
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
