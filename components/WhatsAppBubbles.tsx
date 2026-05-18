import { CheckCheck } from "lucide-react";
import { agent } from "@/lib/mockData";

export function WhatsAppChatFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[#d1d7db] bg-[#ECE5DD] shadow-inner"
      role="region"
      aria-label="WhatsApp conversation"
    >
      <div className="border-b border-[#d1d7db]/80 bg-[#075E54] px-4 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
          WhatsApp Business
        </p>
        <p className="text-sm font-semibold text-white">{agent.name}</p>
      </div>
      <div className="space-y-3 p-4">{children}</div>
    </div>
  );
}

interface SentBubbleProps {
  message: string;
  time: string;
}

export function SentBubble({ message, time }: SentBubbleProps) {
  return (
    <div className="ml-auto max-w-[80%]">
      <div className="rounded-xl rounded-br-[4px] bg-[#DCF8C6] px-3 py-2.5 text-sm leading-relaxed text-gray-900 shadow-sm">
        <p className="whitespace-pre-wrap">{message}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10px] text-gray-500">{time}</span>
          <CheckCheck className="h-3.5 w-3.5 text-gray-400" aria-label="Delivered" />
        </div>
      </div>
    </div>
  );
}

interface ReceivedBubbleProps {
  message: string;
  time: string;
  senderName: string;
}

export function ReceivedBubble({ message, time, senderName }: ReceivedBubbleProps) {
  return (
    <div className="mr-auto max-w-[80%]">
      <p className="mb-1 text-[10px] font-medium text-gray-600">{senderName}</p>
      <div className="rounded-xl rounded-bl-[4px] bg-[#F0F0F0] px-3 py-2.5 text-sm leading-relaxed text-gray-900 shadow-sm">
        <p className="whitespace-pre-wrap">{message}</p>
        <p className="mt-1 text-right text-[10px] text-gray-500">{time}</p>
      </div>
    </div>
  );
}
