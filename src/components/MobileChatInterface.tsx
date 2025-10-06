import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, Camera, Image, Paperclip, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  image_url?: string;
}

interface ChatUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  is_online?: boolean;
}

interface MobileChatInterfaceProps {
  messages: Message[];
  currentUser: ChatUser;
  otherUser: ChatUser;
  productInfo?: {
    title: string;
    price: number;
    image_url: string;
  };
  onSendMessage: (content: string, image_url?: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const MobileChatInterface = ({
  messages,
  currentUser,
  otherUser,
  productInfo,
  onSendMessage,
  onImageUpload,
}: MobileChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const url = await onImageUpload(file);
      onSendMessage("", url);
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: Record<string, Message[]> = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.created_at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={otherUser.avatar_url} />
                <AvatarFallback>{otherUser.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              {otherUser.is_online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{otherUser.full_name}</h3>
              {otherUser.is_online ? (
                <p className="text-xs text-green-600">Active now</p>
              ) : (
                <p className="text-xs text-muted-foreground">Offline</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Info Bar */}
        {productInfo && (
          <div className="px-4 pb-3">
            <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
              <img
                src={productInfo.image_url}
                alt={productInfo.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{productInfo.title}</p>
                <p className="text-sm text-primary font-semibold">₹{productInfo.price}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <Badge variant="secondary" className="text-xs">
                {date === new Date().toLocaleDateString() ? "Today" : date}
              </Badge>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {msgs.map((msg, index) => {
                const isCurrentUser = msg.sender_id === currentUser.id;
                const showAvatar = index === msgs.length - 1 || 
                  msgs[index + 1]?.sender_id !== msg.sender_id;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex items-end gap-2",
                      isCurrentUser && "flex-row-reverse"
                    )}
                  >
                    {/* Avatar */}
                    {showAvatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={isCurrentUser ? currentUser.avatar_url : otherUser.avatar_url} />
                        <AvatarFallback>
                          {isCurrentUser ? currentUser.full_name.charAt(0) : otherUser.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8" />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "max-w-[70%] px-4 py-2 rounded-2xl",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      )}
                    >
                      {msg.image_url && (
                        <img
                          src={msg.image_url}
                          alt="Shared image"
                          className="max-w-full rounded-lg mb-2"
                        />
                      )}
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {new Date(msg.created_at).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={otherUser.avatar_url} />
              <AvatarFallback>{otherUser.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-sm">
              <motion.div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-card border-t border-border p-4 safe-area-bottom">
        <AnimatePresence>
          {showAttachments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex gap-3">
                <label className="flex flex-col items-center p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-xs">Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="camera"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
                <label className="flex flex-col items-center p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80">
                  <Image className="h-6 w-6 mb-1" />
                  <span className="text-xs">Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowAttachments(!showAttachments)}
            className="flex-shrink-0"
          >
            <Plus className={cn(
              "h-5 w-5 transition-transform",
              showAttachments && "rotate-45"
            )} />
          </Button>

          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-10"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChatInterface;
