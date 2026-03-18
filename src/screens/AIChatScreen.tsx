import { useState, useEffect, useRef } from 'react';
import type { Screen, ChatMessage, AgeGroup } from '../types';
import { getAIResponse } from '../utils/aiService';
import { getChatMessages, saveChatMessage, generateId } from '../utils/storage';
import styles from './AIChatScreen.module.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  initialMoodId?: string | null;
  ageGroup: AgeGroup;
}

const INITIAL_MSG: ChatMessage = {
  id: 'init',
  role: 'ai',
  content: '你好！我是岛岛 🐧 你的心情小助手。今天感觉怎么样？',
  timestamp: Date.now(),
};

/** Minimum visible "typing" delay in ms so the reply doesn't feel instant. */
const MIN_REPLY_DELAY = 800;

export default function AIChatScreen({ onNavigate, initialMoodId, ageGroup }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getChatMessages();
    return saved.length > 0 ? saved : [INITIAL_MSG];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    saveChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Run AI call and minimum delay in parallel; whichever takes longer wins
    const [reply] = await Promise.all([
      getAIResponse(text, ageGroup, initialMoodId, messages),
      new Promise<void>((res) => setTimeout(res, MIN_REPLY_DELAY)),
    ]);

    const aiMsg: ChatMessage = {
      id: generateId(),
      role: 'ai',
      content: reply,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    saveChatMessage(aiMsg);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => onNavigate('home')}>←</button>
        <div className={styles.headerInfo}>
          <span className={styles.headerEmoji}>🐧</span>
          <div>
            <div className={styles.headerName}>岛岛</div>
            <div className={styles.headerStatus}>随时在线，陪伴你</div>
          </div>
        </div>
        <div className={styles.headerSpacer} />
      </div>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}
          >
            {msg.role === 'ai' && <span className={styles.aiAvatar}>🐧</span>}
            <div className={styles.bubbleText}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.bubble} ${styles.bubbleAi}`}>
            <span className={styles.aiAvatar}>🐧</span>
            <div className={styles.typingIndicator}>
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.quickReplies}>
        {['我今天很开心 😊', '有点难过...', '帮我放松一下', '我想聊聊'].map((q) => (
          <button
            key={q}
            className={styles.quickBtn}
            onClick={() => setInput(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="和岛岛说说话..."
          rows={1}
          maxLength={500}
        />
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
