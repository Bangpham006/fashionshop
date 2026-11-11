import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, X, Sparkles, RefreshCw, Bot } from 'lucide-react';
import './Chatbot.css';

const AI_API_URL = process.env.REACT_APP_AI_URL || 'https://fashionshop-ai.onrender.com/api/chat/recommend';

const QUICK_PROMPTS = [
  "Quần jeans retro vintage đi cafe",
  "Giày sneaker dạo phố dễ phối đồ",
  "Set thể thao nam năng động",
  "Mẫu giày hot trend hiện nay"
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Xin chào! Mình là AI Stylist của FashionShop ✨. Bạn đang muốn tìm trang phục theo phong cách nào (ví dụ: quần jeans suông retro, giày sneaker vintage, áo thể thao...) hay chuẩn bị đi đâu? Hãy miêu tả cho mình nhé!",
  products: []
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, loading]);

  const handleSend = async (messageToSend = null) => {
    const text = (messageToSend !== null ? messageToSend : inputMessage).trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      // Chuẩn bị lịch sử hội thoại gần nhất (loại bỏ trường products phụ)
      const historyPayload = newMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await axios.post(AI_API_URL, {
        message: text,
        history: historyPayload
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply || "Dưới đây là một số gợi ý phù hợp dành cho bạn:",
        products: response.data.products || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.warn("AI service fallback to backend product search:", error);
      try {
        const prodRes = await axios.get('https://fashionshop-e972.onrender.com/api/products/filter?size=50');
        const allProducts = prodRes.data?.content || prodRes.data || [];
        
        const textLower = text.toLowerCase();
        const keywords = textLower.split(/\s+/).filter(w => w.length > 1);
        
        const matched = allProducts.map(p => {
          let score = 0;
          const pName = (p.name || '').toLowerCase();
          const pType = (p.type || '').toLowerCase();
          const pDesc = (p.description || '').toLowerCase();
          
          keywords.forEach(kw => {
            if (pName.includes(kw)) score += 4;
            if (pType.includes(kw)) score += 3;
            if (pDesc.includes(kw)) score += 1;
          });
          if (p.isFeatured) score += 1;
          return { ...p, score };
        })
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

        const candidates = matched.length > 0 ? matched : allProducts.slice(0, 3);
        const productCards = candidates.map(p => ({
          id: p.productId || p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand || 'FashionShop',
          type: p.type || 'Thời trang',
          basePrice: p.basePrice || 0,
          image: (p.images && p.images[0]) || '',
          matchReason: `Phù hợp với phong cách "${text}"`
        }));

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Chào bạn! Dựa trên phong cách "${text}", AI Stylist đã chọn lọc những mẫu sản phẩm phù hợp nhất từ bộ sưu tập FashionShop dưới đây:`,
            products: productCards
          }
        ]);
      } catch (fallbackErr) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: "Chào bạn! Hiện tại hệ thống đang đồng bộ kho hàng, bạn hãy xem các mẫu sản phẩm mới nhất trên trang chủ nhé!",
            products: []
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const handleProductClick = (slug) => {
    if (slug) {
      navigate(`/product/${slug}`);
      if (window.innerWidth <= 480) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Nút bật tắt nổi (Floating Action Button) */}
      {!isOpen && (
        <button
          className="ai-chatbot-fab"
          onClick={() => setIsOpen(true)}
          title="Tư vấn thời trang cùng AI"
        >
          <div className="fab-icon-wrapper">
            <Sparkles size={20} className="fab-sparkle" />
            <MessageSquare size={22} />
          </div>
          <span>AI Stylist</span>
        </button>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="ai-chatbot-modal">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="header-left">
              <div className="header-avatar">
                <Bot size={22} />
              </div>
              <div className="header-title-box">
                <h3>Fashion AI Stylist</h3>
                <div className="header-status">
                  <span className="status-dot"></span>
                  <span>Trợ lý thời trang trực tuyến</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="header-btn"
                onClick={handleClearChat}
                title="Làm mới cuộc trò chuyện"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="header-btn"
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Khung tin nhắn */}
          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.content}</p>

                  {/* Gợi ý nhanh ở tin nhắn đầu */}
                  {index === 0 && messages.length === 1 && (
                    <div className="quick-prompts-wrapper">
                      <span className="quick-prompts-label">Gợi ý câu hỏi nhanh:</span>
                      <div className="quick-prompts-list">
                        {QUICK_PROMPTS.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            className="prompt-pill"
                            onClick={() => handleSend(prompt)}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Danh sách thẻ sản phẩm gợi ý */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="recommended-products-grid">
                      {msg.products.map((prod, pIdx) => (
                        <div
                          key={prod.id || pIdx}
                          className="product-recommend-card"
                          onClick={() => handleProductClick(prod.slug)}
                        >
                          <img
                            src={prod.image || 'https://via.placeholder.com/100'}
                            alt={prod.name}
                            className="rec-card-image"
                          />
                          <div className="rec-card-details">
                            <div>
                              <span className="rec-card-brand">{prod.brand || 'FashionShop'}</span>
                              <h4 className="rec-card-name">{prod.name}</h4>
                            </div>
                            <div>
                              <span className="rec-card-price">
                                {new Intl.NumberFormat('vi-VN').format(prod.basePrice || 0)}₫
                              </span>
                              {prod.matchReason && (
                                <div>
                                  <span className="rec-card-reason">💡 {prod.matchReason}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row assistant">
                <div className="message-bubble">
                  <div className="typing-dots">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="ai-chat-input-area">
            <form
              className="input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Miêu tả phong cách của bạn (vd: quần jeans retro...)"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!inputMessage.trim() || loading}
                title="Gửi"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
