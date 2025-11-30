"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Plus, Bot, User, MessageSquare, Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



// Background Components
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading, getToken } = useAuth();
  
  // State Management
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For message sending
  
  // File Upload State
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- HOOKS & EFFECTS ---

  // Auth Guard: Redirects if not logged in after auth check is complete
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Data Fetching: Fetches conversations only when auth is confirmed
  useEffect(() => {
    if (!authLoading && user) {
      fetchConversations();
    }
  }, [user, authLoading]);

  // Auto-Scroll: Scrolls to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // --- API & DATA FUNCTIONS ---

  const fetchConversations = async () => {
    const token = await getToken();
    if (!token) return;
    console.log("FETCHING FROM:", `${API_URL}/api/v1/chats`); // <-- ADD THIS
    try {
      const res = await axios.get(`${API_URL}/api/v1/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const createNewChat = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await axios.post(`${API_URL}/api/v1/chats`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations((prev) => [...prev, res.data]);
      setCurrentChatId(res.data._id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const loadChat = (chat: any) => {
    setCurrentChatId(chat._id);
    setMessages(chat.messages || []);
  };

  // --- FILE & MESSAGE SENDING ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachedFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if ((!input.trim() && !attachedFile) || !currentChatId) return;

    const userMessageContent = input;
    const userMsg = { role: "user", content: userMessageContent };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const token = await getToken();
    const formData = new FormData();
    formData.append("message_content", userMessageContent || "Analyze the attached document.");
    if (attachedFile) {
      formData.append("file", attachedFile);
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/chats/${currentChatId}/messages`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add a visible error message in the chat for better UX
      const errorMsg = { role: 'assistant', content: 'Sorry, I failed to send your message. Please try again.' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      removeFile();
    }
  };

  // --- REUSABLE SIDEBAR COMPONENT ---
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-white">
      <div className="p-4 border-b border-zinc-800 md:border-b-0">
        <Button onClick={createNewChat} className="w-full bg-white text-black hover:bg-zinc-200">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {conversations.map((chat) => (
          <div
            key={chat._id}
            onClick={() => loadChat(chat)}
            className={cn( "flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition-all",
              currentChatId === chat._id ? "bg-zinc-800" : "text-zinc-400 hover:bg-zinc-900"
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {chat.messages.length > 0 ? chat.messages[0].content : "New Conversation"}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-zinc-700">
            <AvatarFallback className="bg-zinc-800 text-xs">
              {user?.email?.substring(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">My Account</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER LOGIC ---

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
      <Navbar sidebarContent={<SidebarContent />} />
      <div className="flex h-full pt-16">
        <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex-col hidden md:flex z-20">
          <SidebarContent />
        </div>
        <main className="flex-1 flex flex-col relative">
          <div className="absolute inset-0 z-0 pointer-events-none bg-black">
            <ShootingStars />
            <StarsBackground />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            {currentChatId ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={cn("flex gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                        {msg.role === "assistant" && <Avatar className="h-8 w-8 bg-indigo-600 flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-white" /></Avatar>}
                        <div className={cn("p-4 rounded-2xl max-w-[85%] backdrop-blur-md", msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-zinc-900/80 border border-zinc-700/50 text-zinc-100 rounded-bl-none")}>
                          <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                  ul: ({children}) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                                  li: ({children}) => <li className="pl-1">{children}</li>,
                                  strong: ({children}) => <span className="font-bold text-indigo-300">{children}</span>,
                                  code: ({children}) => <code className="bg-black/50 px-1 py-0.5 rounded text-xs font-mono text-amber-300">{children}</code>,
                                }}
                              >
                                {msg.content}
                            </ReactMarkdown>

                          </div>
                        </div>
                        {msg.role === "user" && <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-zinc-800"><User size={16} /></AvatarFallback></Avatar>}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4 justify-start"><Avatar className="h-8 w-8 bg-indigo-600 flex items-center justify-center"><Loader2 className="h-4 w-4 text-white animate-spin" /></Avatar><div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-700/50"><p className="text-sm text-zinc-400">Thinking...</p></div></div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className="p-4 bg-black/50 backdrop-blur-lg border-t border-zinc-800">
                  <div className="max-w-3xl mx-auto">
                    {attachedFile && (
                      <div className="mb-2 flex items-center justify-between bg-zinc-800/80 border border-zinc-700 text-white text-xs rounded-full px-3 py-1.5 animate-in fade-in">
                        <span className="truncate">{attachedFile.name}</span>
                        <Button onClick={removeFile} size="icon" variant="ghost" className="h-5 w-5 rounded-full"><X className="h-3 w-3" /></Button>
                      </div>
                    )}
                    <div className="relative flex items-center gap-2">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx"/>
                      <Button onClick={() => fileInputRef.current?.click()} size="icon" variant="ghost" className="shrink-0 text-zinc-400 hover:text-white"><Paperclip className="h-5 w-5" /></Button>
                      <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()} placeholder="Ask anything, or attach a document..." disabled={isLoading} className="bg-zinc-900/80 border-zinc-700 text-white pr-12 h-12 rounded-full focus-visible:ring-indigo-500" />
                      <Button onClick={sendMessage} disabled={isLoading || (!input.trim() && !attachedFile)} size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"><Send className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6"><Bot size={48} className="text-white" /></div>
                <h2 className="text-3xl font-bold text-white mb-3">Welcome to LexiBot</h2>
                <p className="text-zinc-400 max-w-md mb-8">Start a new conversation to explore the power of AI.</p>
                <Button onClick={createNewChat} size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8"><Plus className="mr-2 h-5 w-5" /> Start New Chat</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}