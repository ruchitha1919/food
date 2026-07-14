/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, ChevronRight } from 'lucide-react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_TOPICS = [
  {
    q: 'How can I track my delivery order?',
    a: 'All Syamala deliveries can be tracked using the unique tracking code (starting with SY-XXXXXX) generated on checkout. Go to the "Account" section in the bottom bar or header to view real-time shipping progress!'
  },
  {
    q: 'Can I do bulk corporate custom gifting?',
    a: 'Absolutely! We specialize in tailored corporate dry fruit baskets and custom wood engravings for festivals/weddings. Please email sales@syamala.co.in or call +91 9959334007 for exclusive bulk discounts.'
  },
  {
    q: 'What is your free shipping policy?',
    a: 'We offer complimentary express delivery across India on all orders of ₹999/- and above. For orders under ₹999/-, a nominal standard flat delivery fee of ₹150/- applies.'
  },
  {
    q: 'What makes your harvests premium?',
    a: 'Syamala Dry Fruits was established in 1993. We source directly from private global orchards, using traditional cold-shelling, gentle slow-roasting, and immediate secure packaging to preserve high natural oils.'
  }
];

export default function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Syamala Dry Fruits Premium Concierge Support. How may we assist you in savoring nature’s finest harvests today?',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot replying
    setTimeout(() => {
      let replyText = 'Thank you for reaching out. A premium gifting concierge representative will review your message immediately. For prompt support, you can also dial +91 9959334007 or email sales@syamala.co.in!';
      
      // Check if user clicked a preset topic or searched keywords
      const matched = PRESET_TOPICS.find(topic => 
        textToSend.toLowerCase().includes(topic.q.toLowerCase()) || 
        topic.q.toLowerCase().split(' ').some(word => word.length > 4 && textToSend.toLowerCase().includes(word))
      );
      
      if (matched) {
        replyText = matched.a;
      }

      const botMsg: Message = {
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-surface/90 backdrop-blur-md border border-outline-variant shadow-2xl z-[100] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border border-white rounded-full animate-ping" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm leading-tight">Syamala Concierge</h4>
            <span className="text-[10px] text-green-300 font-semibold tracking-wide block">● Online Support Agent</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          id="close-chat-widget"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages body */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed font-sans ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-surface-container border border-outline-variant text-on-surface rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
            </div>
            <span className="text-[9px] text-on-surface-variant/60 mt-1 px-1 font-medium">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 bg-surface-container text-[11px] text-on-surface-variant max-w-[70px] justify-center rounded-full">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended presets */}
      {messages.length < 3 && (
        <div className="p-2 bg-surface-container border-t border-outline-variant/60 space-y-1 max-h-[140px] overflow-y-auto">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">
            Suggested Assistance Topics
          </p>
          {PRESET_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSend(topic.q)}
              className="w-full text-left p-1.5 hover:bg-white text-[11px] text-primary font-medium flex items-center justify-between border-b border-outline-variant/30 last:border-b-0"
              id={`chat-preset-${i}`}
            >
              <span className="truncate">{topic.q}</span>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="p-3 bg-surface border-t border-outline-variant flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-white border border-outline-variant px-3 py-2 text-xs focus:outline-none focus:border-primary font-sans rounded-none"
          id="chat-input-field"
        />
        <button
          type="submit"
          className="bg-primary text-white p-2 hover:bg-primary-container transition-colors rounded-none"
          id="chat-send-btn"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
