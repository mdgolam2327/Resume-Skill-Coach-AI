import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  CornerDownLeft, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { ChatMessage, AnalysisResult } from '../types';

interface ChatCoachSectionProps {
  targetRole: string;
  result?: AnalysisResult | null;
}

export const ChatCoachSection: React.FC<ChatCoachSectionProps> = ({ targetRole, result }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content: `Hi there! I'm your AI Career & Resume Coach. I've evaluated your background for the **${targetRole}** role.\n\nAsk me anything! For example, which skills to prioritize, what project to build this weekend, or how to explain your college projects to a recruiter.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'What skills am I missing for this career?',
    'What project should I build?',
    'How can I improve my summary?',
    'How do I handle having no professional experience?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            targetRole,
            resumeSummary: result?.summary,
            skillsHave: result?.skillGap?.have,
            skillsMissing: result?.skillGap?.develop,
            matchScore: result?.matchScore,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get coach response.');
      }

      const data = await response.json();
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Let me know what else you would like to know!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: 'I had trouble connecting to the coach service. Please try again in a moment!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Helper to format simple markdown-like bold text and bullet points
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, lIdx) => {
          if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
          
          // Bullet lines
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const bulletText = line.trim().substring(2);
            return (
              <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{renderFormattedInline(bulletText)}</span>
              </div>
            );
          }

          return <p key={lIdx}>{renderFormattedInline(line)}</p>;
        })}
      </div>
    );
  };

  const renderFormattedInline = (str: string) => {
    // Basic bold parsing: **bold**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                AI Career Coach Chat
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized guidance for {targetRole} aspirants
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="py-2.5 shrink-0 overflow-x-auto flex gap-1.5 no-scrollbar">
        {sampleQuestions.map((q, qIdx) => (
          <button
            key={qIdx}
            id={`suggested-question-btn-${qIdx}`}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-[11px] font-medium text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 hover:text-indigo-900 px-3 py-1.5 rounded-full border border-indigo-200/60 whitespace-nowrap transition-colors shrink-0"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-100/90 text-slate-800 rounded-tl-xs'
                }`}
              >
                {renderMessageContent(msg.content)}
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            id="chat-user-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question (e.g. 'What project should I build next?')..."
            className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl pl-3.5 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
          />
          <button
            type="submit"
            id="chat-send-btn"
            disabled={isLoading || !input.trim()}
            className={`absolute right-1.5 p-2 rounded-lg text-white transition-all ${
              isLoading || !input.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-xs'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 text-center">
          Coach AI responds with concise, actionable suggestions for freshers.
        </p>
      </form>
    </div>
  );
};
