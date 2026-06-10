import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaRobot, FaUserCircle } from "react-icons/fa";
import styles from "./style.module.css";

const API_URL = "https://careergrambackend.onrender.com/api/fintoo-ai";

const normalizeList = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.trim());
};

const stripMarkdown = (value = "") =>
  value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();

const getStructuredReplyFromText = (text) => {
  if (!text || typeof text !== "string") return null;

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== "---");

  if (!lines.length) return null;

  const result = {
    summary: "",
    keyPoints: [],
    suggestions: [],
    risks: [],
    disclaimer: "",
    extraSections: [],
  };

  const introParagraphs = [];
  let activeSection = null;

  const pushToSection = (line) => {
    if (!activeSection) {
      introParagraphs.push(stripMarkdown(line));
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\)\s+(.+)$/);
    if (bulletMatch) {
      activeSection.items.push(stripMarkdown(bulletMatch[1]));
    } else {
      activeSection.paragraphs.push(stripMarkdown(line));
    }
  };

  lines.forEach((line) => {
    const headingMatch = line.match(/^#{1,6}\s*(.+)$/);
    if (headingMatch) {
      activeSection = {
        title: stripMarkdown(headingMatch[1].replace(/^\d+\.\s*/, "")),
        items: [],
        paragraphs: [],
      };
      result.extraSections.push(activeSection);
      return;
    }

    const standaloneBulletMatch =
      line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/);
    if (standaloneBulletMatch && !activeSection) {
      result.keyPoints.push(stripMarkdown(standaloneBulletMatch[1]));
      return;
    }

    pushToSection(line);
  });

  if (introParagraphs.length) {
    result.summary = introParagraphs.join(" ");
  }

  result.extraSections.forEach((section) => {
    const title = section.title.toLowerCase();
    const combined = [...section.items, ...section.paragraphs].filter(Boolean);
    if (!combined.length) return;

    if (title.includes("risk")) {
      result.risks.push(...combined);
      return;
    }
    if (title.includes("suggest") || title.includes("strategy")) {
      result.suggestions.push(...combined);
      return;
    }
    if (title.includes("key point")) {
      result.keyPoints.push(...combined);
      return;
    }
    if (title.includes("disclaimer")) {
      result.disclaimer = combined.join(" ");
    }
  });

  if (!result.disclaimer) {
    const disclaimerLine = lines.find((line) =>
      line.toLowerCase().includes("disclaimer")
    );
    if (disclaimerLine) {
      result.disclaimer = stripMarkdown(disclaimerLine.replace(/^[-*]\s*/, ""));
    }
  }

  const hasContent =
    result.summary ||
    result.keyPoints.length ||
    result.suggestions.length ||
    result.risks.length ||
    result.disclaimer ||
    result.extraSections.some(
      (section) => section.items.length || section.paragraphs.length
    );

  return hasContent ? result : null;
};

const getStructuredBotReply = (payload) => {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  if (!source || typeof source !== "object") return null;

  const summary = typeof source.summary === "string" ? source.summary.trim() : "";
  const keyPoints = normalizeList(source.key_points);
  const suggestions = normalizeList(source.suggestions);
  const risks = normalizeList(source.risks);
  const disclaimer =
    typeof source.disclaimer === "string" ? source.disclaimer.trim() : "";

  if (!summary && !keyPoints.length && !suggestions.length && !risks.length && !disclaimer) {
    return null;
  }

  return {
    summary,
    keyPoints,
    suggestions,
    risks,
    disclaimer,
    extraSections: [],
  };
};

const getBotReplyText = (payload) => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;

  if (typeof payload?.data?.summary === "string" && payload.data.summary.trim()) {
    return payload.data.summary;
  }

  if (typeof payload?.summary === "string" && payload.summary.trim()) {
    return payload.summary;
  }

  const firstMatch =
    payload.reply ||
    payload.response ||
    payload.message ||
    payload.answer ||
    payload.data?.reply ||
    payload.data?.response ||
    payload.data?.message ||
    payload.data?.answer;

  if (typeof firstMatch === "string") return firstMatch;
  return "";
};

export default function Chatbot() {
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I am Fintoo AI. Ask me anything about your finances.",
    },
  ]);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    window.requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const appendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  };

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

    setInputValue("");
    appendMessage({
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    });
    setIsSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: trimmed,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
      const botReply = getBotReplyText(payload);
      const structuredReply =
        getStructuredBotReply(payload) || getStructuredReplyFromText(botReply);

      appendMessage({
        id: `bot-${Date.now()}`,
        role: "assistant",
        text:
          botReply ||
          "I received your message, but couldn’t parse a valid response.",
        structuredReply,
      });
    } catch (error) {
      appendMessage({
        id: `bot-error-${Date.now()}`,
        role: "assistant",
        text: "I’m unable to respond right now. Please try again in a moment.",
      });
      console.error("Chatbot API error:", error);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="tw-rounded-2xl tw-bg-white/60 tw-backdrop-blur-md tw-border tw-border-slate-200 tw-shadow-sm tw-p-4 md:tw-p-6">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4 md:tw-mb-6">
        <div>
          <h2 className="tw-text-xl tw-font-bold tw-text-slate-800 tw-mb-1">
            Fintoo AI Chat
          </h2>
          <p className="tw-text-slate-500 tw-text-sm tw-mb-0">
            Personal finance assistant
          </p>
        </div>
        <div className="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-fintoo-blue tw-text-white tw-flex tw-items-center tw-justify-center">
          <FaRobot />
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`${styles.chatBody} tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-slate-50/80 tw-p-3 md:tw-p-4`}
      >
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`tw-flex tw-items-end tw-gap-2 tw-mb-3 ${
                isUser ? "tw-justify-end" : "tw-justify-start"
              }`}
            >
              {!isUser && (
                <div className="tw-text-fintoo-blue tw-text-lg tw-mb-1">
                  <FaRobot />
                </div>
              )}

              <div
                className={`tw-max-w-[85%] md:tw-max-w-[70%] tw-rounded-2xl tw-px-4 tw-py-2.5 tw-text-sm tw-leading-6 ${
                  isUser
                    ? "tw-bg-fintoo-blue tw-text-white tw-rounded-br-md"
                    : "tw-bg-white tw-text-slate-700 tw-border tw-border-slate-200 tw-rounded-bl-md"
                }`}
              >
                {message.structuredReply ? (
                  <div className="tw-space-y-3">
                    {message.structuredReply.summary && (
                      <p className="tw-mb-0">{message.structuredReply.summary}</p>
                    )}

                    {!!message.structuredReply.keyPoints.length && (
                      <div>
                        <p className="tw-font-semibold tw-text-slate-800 tw-mb-1">
                          Key Points
                        </p>
                        <ul className="tw-list-disc tw-pl-5 tw-mb-0">
                          {message.structuredReply.keyPoints.map((item, index) => (
                            <li key={`kp-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!message.structuredReply.suggestions.length && (
                      <div>
                        <p className="tw-font-semibold tw-text-slate-800 tw-mb-1">
                          Suggestions
                        </p>
                        <ul className="tw-list-disc tw-pl-5 tw-mb-0">
                          {message.structuredReply.suggestions.map((item, index) => (
                            <li key={`sug-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!message.structuredReply.risks.length && (
                      <div>
                        <p className="tw-font-semibold tw-text-slate-800 tw-mb-1">
                          Risks
                        </p>
                        <ul className="tw-list-disc tw-pl-5 tw-mb-0">
                          {message.structuredReply.risks.map((item, index) => (
                            <li key={`risk-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {message.structuredReply.disclaimer && (
                      <p className="tw-text-xs tw-text-slate-500 tw-mb-0 tw-border-t tw-border-slate-200 tw-pt-2">
                        {message.structuredReply.disclaimer}
                      </p>
                    )}

                    {Array.isArray(message.structuredReply.extraSections) &&
                      message.structuredReply.extraSections.map((section, index) => {
                        const hasItems =
                          section.items?.length || section.paragraphs?.length;
                        if (!hasItems) return null;

                        return (
                          <div key={`extra-${index}`}>
                            <p className="tw-font-semibold tw-text-slate-800 tw-mb-1">
                              {section.title}
                            </p>

                            {!!section.items?.length && (
                              <ul className="tw-list-disc tw-pl-5 tw-mb-0">
                                {section.items.map((item, itemIndex) => (
                                  <li key={`extra-item-${itemIndex}`}>{item}</li>
                                ))}
                              </ul>
                            )}

                            {!!section.paragraphs?.length &&
                              section.paragraphs.map((paragraph, pIndex) => (
                                <p key={`extra-p-${pIndex}`} className="tw-mb-0">
                                  {paragraph}
                                </p>
                              ))}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  message.text
                )}
              </div>

              {isUser && (
                <div className="tw-text-fintoo-blue tw-text-lg tw-mb-1">
                  <FaUserCircle />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="tw-flex tw-items-center tw-gap-2 tw-text-slate-500 tw-text-sm tw-px-1">
            <FaRobot className="tw-text-fintoo-blue" />
            <span>Fintoo AI is typing...</span>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="tw-mt-4">
        <div className="tw-flex tw-items-center tw-gap-2 tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-p-2">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Type your question..."
            className="tw-flex-1 tw-border-0 tw-bg-transparent tw-text-sm tw-text-slate-700 focus:tw-outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            className="tw-bg-fintoo-blue tw-text-white tw-w-10 tw-h-10 tw-rounded-lg tw-flex tw-items-center tw-justify-center disabled:tw-opacity-60"
            disabled={isSending || !inputValue.trim()}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
}
