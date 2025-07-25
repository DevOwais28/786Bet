import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  avatar: string;
}

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    refetchInterval: 2000, // Poll for new messages every 2 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat/send", { message });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
  className="bg-gray-900 p-4 border-r border-gray-800 flex flex-col"
  style={{ width: '100%', maxWidth: 320 }}
>
  {/* Responsive wrapper: full width on mobile, max 320px on desktop */}
      <h3 className="text-lg font-medium mb-4 text-center">Live Chat</h3>
      
      <div
  className="flex-1 bg-gray-800 rounded-xl p-4 mb-4 overflow-y-auto"
  style={{ maxHeight: '60vh', minHeight: 120 }}
>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No messages yet.</p>
            <p className="text-sm">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((message: ChatMessage) => (
            <div key={message.id} className="chat-message mb-3">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black text-sm font-bold">
                  {message.avatar}
                </div>
                <div>
                  <div className="text-sm text-gray-400">{message.username}</div>
                  <div className="text-sm">{message.message}</div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form
  onSubmit={handleSendMessage}
  className="flex flex-col sm:flex-row gap-2"
  style={{ position: 'sticky', bottom: 0, background: 'inherit', zIndex: 10 }}
>
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent w-full"
          maxLength={200}
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
          className="bg-gold hover:bg-emerald text-black px-4 py-2 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
