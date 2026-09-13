// ===========================================================================
// Tiger Empire Tech Hub — Quick Help Widget
// This is a SCRIPTED keyword-matching FAQ helper, not an AI model. It never
// calls any external API and never sends data anywhere — every answer below
// is written in advance. Anything it can't match falls back to a real human
// via WhatsApp or a phone call.
// ===========================================================================

(function () {
  const FAQS = [
    {
      id: "what-we-do",
      keywords: ["what", "do", "tiger", "empire", "about", "company", "services", "offer"],
      question: "What does Tiger Empire Tech Hub do?",
      answer: "We provide practical digital solutions — CVs and career help, business websites and branding, government service assistance (eCitizen, KRA, NTSA, SHA), printing and document services, AI and technology help, plus a digital skills academy.",
      cta: { text: "See all services", href: "services.html" }
    },
    {
      id: "how-request",
      keywords: ["request", "how", "start", "begin", "order", "book", "get", "help"],
      question: "How do I request a solution?",
      answer: "Use Request a Solution — pick a category, describe what you need, add your contact details, and send it straight to us on WhatsApp. Most requests can start remotely, wherever you are.",
      cta: { text: "Request a Solution", href: "request-a-solution.html" }
    },
    {
      id: "pricing",
      keywords: ["price", "cost", "much", "pricing", "fee", "charge", "expensive", "cheap"],
      question: "How much does it cost?",
      answer: "Pricing depends on exactly what you need, so we confirm it directly rather than quoting a fixed number here. Message us on WhatsApp with the details and we'll give you a straight answer.",
      cta: { text: "Ask on WhatsApp", href: "https://wa.me/254794872444" }
    },
    {
      id: "remote",
      keywords: ["remote", "visit", "location", "far", "nairobi", "mombasa", "online", "distance"],
      question: "Do I need to visit in person?",
      answer: "No — most solutions can start remotely. Choose a solution, send your details, and we work on it and send back the result. This works whether you're in Kisii, Nairobi, Mombasa, or anywhere else in Kenya.",
      cta: { text: "See how it works", href: "index.html#remote" }
    },
    {
      id: "location",
      keywords: ["where", "located", "address", "office", "kisii", "ogembo", "directions"],
      question: "Where are you located?",
      answer: "Opposite Salvador Academy, Omoringamu, Ogembo, Kisii.",
      cta: { text: "Get directions", href: "https://share.google/f1be64bgWxFeCXglC" }
    },
    {
      id: "contact",
      keywords: ["contact", "phone", "call", "number", "whatsapp", "reach", "talk"],
      question: "How do I contact you?",
      answer: "Call or WhatsApp 0794 872 444 or 0710 868 016.",
      cta: { text: "Message us on WhatsApp", href: "https://wa.me/254794872444" }
    },
    {
      id: "cv",
      keywords: ["cv", "resume", "job", "career", "linkedin", "cover", "letter", "application"],
      question: "Do you write CVs?",
      answer: "Yes — CV writing, cover letters, LinkedIn profile setup, and job application support.",
      cta: { text: "Personal & Career Solutions", href: "solutions-personal-career.html" }
    },
    {
      id: "govt",
      keywords: ["ecitizen", "kra", "ntsa", "sha", "helb", "nssf", "government", "tax", "itax", "license", "registration", "good", "conduct"],
      question: "Do you help with eCitizen, KRA, NTSA or SHA?",
      answer: "Yes. We're not a government agency, but we help you navigate eCitizen, KRA/iTax, NTSA, SHA, HELB, NSSF and Good Conduct applications correctly the first time.",
      cta: { text: "Online Service Assistance", href: "solutions-online-services.html" }
    },
    {
      id: "website",
      keywords: ["website", "web", "business", "branding", "logo", "poster", "google", "profile"],
      question: "Do you build websites for businesses?",
      answer: "Yes — business websites, digital branding, posters, and Google Business Profile setup.",
      cta: { text: "Business Solutions", href: "solutions-business.html" }
    },
    {
      id: "ai-tech",
      keywords: ["ai", "chatgpt", "claude", "automation", "technology", "consulting", "artificial", "intelligence"],
      question: "Can you help with AI or technology?",
      answer: "Yes — AI-assisted writing and content, AI training, automation, and technology consulting, applied to real tasks.",
      cta: { text: "AI & Technology", href: "ai-technology.html" }
    },
    {
      id: "print",
      keywords: ["print", "printing", "photocopy", "scan", "scanning", "type", "typing", "laminate", "lamination"],
      question: "Do you offer printing and document services?",
      answer: "Yes — printing, photocopying, scanning, typing/typesetting, and lamination at our Ogembo location.",
      cta: { text: "Documents & Print", href: "solutions-documents.html" }
    },
    {
      id: "academy",
      keywords: ["academy", "course", "learn", "training", "skills", "class", "teach"],
      question: "What is Tiger Empire Academy?",
      answer: "Our practical digital skills training — computer basics, AI tools, web design, digital safety, CV skills, and freelancing.",
      cta: { text: "Explore the Academy", href: "academy.html" }
    },
    {
      id: "products",
      keywords: ["ebook", "guide", "product", "download", "buy", "resource"],
      question: "Do you sell digital guides or products?",
      answer: "Yes — practical guides like the Kenya AI Money Guide, a Digital Skills Starter Guide, and a Freelancing Resource Pack.",
      cta: { text: "Digital Products", href: "digital-products.html" }
    },
    {
      id: "hours",
      keywords: ["hours", "open", "time", "close", "weekend", "sunday"],
      question: "What are your hours?",
      answer: "For current opening hours, it's best to check directly with us — message us on WhatsApp and we'll confirm.",
      cta: { text: "Message us", href: "https://wa.me/254794872444" }
    }
  ];

  const SUGGESTED_IDS = ["what-we-do", "how-request", "pricing", "govt"];
  const STORAGE_KEY = "tigerFAQChatHistory";
  const GREETING = "Hi! I'm the Tiger Empire quick-help assistant. I answer from a fixed set of common questions — for anything else, I'll point you to a real person on WhatsApp. What would you like to know?";

  // ---- state ----
  let messages = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) messages = JSON.parse(saved);
  } catch (e) { messages = []; }

  // ---- DOM refs (elements are injected into every page's HTML) ----
  const bubbleBtn = document.getElementById("faqBubbleBtn");
  const panel = document.getElementById("faqPanel");
  const body = document.getElementById("faqBody");
  const input = document.getElementById("faqInput");
  const sendBtn = document.getElementById("faqSendBtn");
  const clearBtn = document.getElementById("faqClearBtn");

  if (!bubbleBtn || !panel) return; // widget markup not present on this page

  function saveMessages() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch (e) {}
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderMessages() {
    body.innerHTML = "";
    messages.forEach((m) => {
      const bubble = document.createElement("div");
      bubble.className = "faq-msg " + (m.role === "user" ? "user" : "bot");
      bubble.innerHTML = escapeHtml(m.text).replace(/\n/g, "<br>");
      if (m.cta) {
        const a = document.createElement("a");
        a.href = m.cta.href;
        a.className = "faq-cta";
        a.textContent = m.cta.text + " →";
        if (m.cta.href.startsWith("http")) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        bubble.appendChild(document.createElement("br"));
        bubble.appendChild(a);
      }
      body.appendChild(bubble);
    });

    // suggested chips only shown right after the greeting (i.e. one message so far)
    if (messages.length <= 1) {
      const chipRow = document.createElement("div");
      chipRow.className = "faq-chips";
      SUGGESTED_IDS.forEach((id) => {
        const faq = FAQS.find((f) => f.id === id);
        if (!faq) return;
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "faq-chip";
        chip.textContent = faq.question;
        chip.addEventListener("click", () => handleUserMessage(faq.question));
        chipRow.appendChild(chip);
      });
      body.appendChild(chipRow);
    }

    body.scrollTop = body.scrollHeight;
  }

  function matchFaq(text) {
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    let best = null;
    let bestScore = 0;
    FAQS.forEach((faq) => {
      let score = 0;
      words.forEach((w) => {
        if (faq.keywords.includes(w)) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = faq;
      }
    });
    return bestScore > 0 ? best : null;
  }

  function handleUserMessage(text) {
    text = text.trim();
    if (!text) return;
    messages.push({ role: "user", text });

    const match = matchFaq(text);
    if (match) {
      messages.push({ role: "bot", text: match.answer, cta: match.cta });
    } else {
      messages.push({
        role: "bot",
        text: "I don't have a scripted answer for that one — but a real person can help right away.",
        cta: { text: "Message us on WhatsApp", href: "https://wa.me/254794872444" }
      });
    }
    saveMessages();
    renderMessages();
  }

  function initConversation() {
    if (messages.length === 0) {
      messages.push({ role: "bot", text: GREETING });
      saveMessages();
    }
    renderMessages();
  }

  function togglePanel() {
    const isOpen = panel.classList.toggle("open");
    bubbleBtn.classList.toggle("open", isOpen);
    bubbleBtn.setAttribute("aria-expanded", isOpen);
    if (isOpen) {
      initConversation();
      input.focus();
    }
  }

  bubbleBtn.addEventListener("click", togglePanel);

  sendBtn.addEventListener("click", () => {
    handleUserMessage(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleUserMessage(input.value);
      input.value = "";
    }
  });

  clearBtn.addEventListener("click", () => {
    messages = [];
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    initConversation();
  });
})();
