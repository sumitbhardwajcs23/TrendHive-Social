import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/client';
import { useAuthStore } from '../../stores/authStore';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
  };
}

export default function ClientChatWidget({ clientId }: { clientId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && clientId) {
      fetchMessages();
    }
  }, [isOpen, clientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/messages/${clientId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');
    
    try {
      const res = await api.post(`/messages/${clientId}`, { content });
      setMessages([...messages, res.data]);
    } catch (error) {
      console.error('Failed to send message', error);
      setNewMessage(content); // Restore on fail
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 h-[500px] max-h-[80vh]"
          >
            <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Agency Chat</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 custom-scrollbar">
              {loading && messages.length === 0 ? (
                <div className="flex justify-center my-4">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-gray-500 my-4">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        {!isMe && (
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {msg.sender.avatar ? (
                              <img src={msg.sender.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-gray-500">{msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-full px-4 py-2 text-sm transition-colors outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-colors"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
