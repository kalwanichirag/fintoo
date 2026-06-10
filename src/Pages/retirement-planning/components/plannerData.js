import { brand } from "./PlannerShared";

export const trustItems = [
  { label: "SEBI Registered RIA", icon: "shieldCheck" },
  { label: "Unbiased Advice", icon: "chat" },
  { label: "Fiduciary Advisors Only", icon: "screen" },
];

export const whyPoints = [
  {
    title: "Power of Compounding",
    text: "Starting 10 years earlier can potentially double your retirement corpus — with the same monthly investment amount, harnessing time as your greatest asset.",
    icon: "spark",
  },
  {
    title: "Beat Inflation Head-On",
    text: "India's inflation averages 6–7% annually. Without an active plan, the rupee you save today buys only half as much in 12 years.",
    icon: "money",
  },
  {
    title: "Financial Independence",
    text: "A well-funded retirement means you never have to be financially dependent on family — maintaining your dignity, choices, and lifestyle on your own terms.",
    icon: "home",
  },
  {
    title: "Healthcare Costs Are Rising",
    text: "Medical inflation in India runs at 14% per year. A robust retirement corpus ensures your health needs never compromise your financial wellbeing.",
    icon: "pulse",
  },
];

export const benefits = [
  {
    icon: "income",
    title: "Lifelong Income Security",
    text: "Structure your corpus across instruments that generate steady income for 30+ years post-retirement, adjusted for inflation and your evolving lifestyle.",
  },
  {
    icon: "tax",
    title: "Tax-Efficient Growth",
    text: "Leverage NPS, PPF, ELSS, and other instruments strategically to minimise tax outgo while maximising long-term wealth accumulation.",
  },
  {
    icon: "target",
    title: "Goal-Based Investing",
    text: "Align each investment to a specific retirement milestone — whether it's your dream travel plan, child's wedding, or healthcare fund.",
  },
  {
    icon: "stack",
    title: "Risk-Managed Portfolio",
    text: "Diversify intelligently across equity, debt, and alternative assets that match your risk appetite at every life stage — aggressive early, balanced later.",
  },
  {
    icon: "legacy",
    title: "Estate & Legacy Planning",
    text: "Ensure your wealth is passed on seamlessly to your loved ones with proper nomination, will, and trust structures — zero ambiguity, zero disputes.",
  },
  {
    icon: "shieldCheck",
    title: "Peace of Mind, Always",
    text: "With a robust plan in place, you stop worrying about market crashes, inflation spikes, or medical emergencies. Your plan accounts for all of it.",
  },
];

export const steps = [
  ["1", "Share Your Details", "Fill the quick calculator to tell us about your age, expenses, and goals — takes under 2 minutes."],
  ["2", "Talk to an Expert", "Schedule a free session with a SEBI-registered advisor who deep-dives into your plan and plugs any gaps."],
    ["3", "Get Your Corpus Number", "Instantly see your personalised retirement corpus target based on your unique financial situation."],
  ["4", "Execute & Grow", "Receive a written, actionable roadmap with specific instruments, SIP amounts, and review milestones."],
];

export const whyFintoo = [
  ["SEBI Registered Investment Advisors", "All advisors are SEBI-certified, operating under a fiduciary standard — meaning they are legally obligated to put your interests first, always.", "shield"],
  ["Conflict-Free Advice, Always", "We are fee-only advisors. We don't earn commissions from products we recommend, so our advice is never influenced by incentives.", "check"],
  ["Technology-Powered Planning", "Our proprietary platform aggregates all your investments, runs projections, and flags risks — giving you a real-time 360° view of your retirement readiness.", "clock"],
  ["Dedicated Advisor for Life", "You get one advisor who knows your complete financial picture and is available when you need them — not a different person every call.", "users"],
];

export const testimonials = [
  {
    initials: "RS",
    name: "Rajesh Sharma",
    meta: "IT Professional, Pune · Retired at 57",
    quote:
      "\"I had zero clarity on how much I needed to retire comfortably. Fintoo's advisor helped me realise I was severely under-saving. 18 months later, I'm on track and sleeping better.\"",
    color: brand.blue,
  },
  {
    initials: "PD",
    name: "Priya Dasgupta",
    meta: "Consultant, Mumbai · Planning retirement at 55",
    quote:
      "\"As a self-employed consultant, I had no employer PF. Fintoo built a complete retirement plan using NPS + mutual funds. The clarity I got was priceless.\"",
    color: brand.blue,
  },
  {
    initials: "AK",
    name: "Arun Kumar",
    meta: "Business Owner, Hyderabad",
    quote:
      "\"My wife and I had very different risk appetites. Fintoo created a joint plan that respected both our comfort levels while hitting our combined retirement goal. Exceptional service.\"",
    color: brand.orange,
  },
];

export const faqs = [
  {
    question: "How much corpus do I actually need for retirement?",
    answer:
      "It depends on your current monthly expenses, lifestyle expectations, and the age you wish to retire. As a thumb rule, aim for 25–30x your annual expenses. Use our calculator above for a personalised estimate — it accounts for inflation and expected investment returns.",
  },
  {
    question: "I'm 45 — is it too late to start retirement planning?",
    answer:
      "Absolutely not. Starting at 45 with an aggressive savings rate and smart allocation can still build a sizeable corpus by 60. The key is to start immediately, maximise contributions, and review your plan regularly. Our advisors specialise in accelerated retirement planning for late starters.",
  },
  {
    question: "What is the best investment for retirement in India?",
    answer:
      "There's no single best investment — the optimal mix depends on your age, risk appetite, tax bracket, and time horizon. Typically, a combination of NPS, equity mutual funds, and debt funds or PPF works well. Our advisors build the right blend for you.",
  },
  {
    question: "Is the advisory session really free?",
    answer:
      "Yes — your first 30-minute retirement planning consultation is completely free with no obligation. We believe in demonstrating value before asking for anything. After the session, you decide if you'd like to engage us for a comprehensive financial plan.",
  },
  {
    question: "How is Fintoo different from other financial advisors?",
    answer:
      "Fintoo is a SEBI-registered fee-only RIA. We don't sell products or earn commissions — so our advice is purely in your interest. We combine certified human advisors with technology that gives you real-time tracking, making us both trustworthy and transparent.",
  },
];

export const chartData = [
  { value: "₹18.5k", label: "Start at 30", height: 55, color: "rgba(221, 115, 0, 0.7)" },
  { value: "₹32k", label: "Start at 35", height: 80, color: "rgba(221, 115, 0, 0.75)" },
  { value: "₹52k", label: "Start at 40", height: 105, color: "rgba(221, 115, 0, 0.85)" },
  { value: "₹98k", label: "Start at 45", height: 118, color: "rgba(221, 115, 0, 1)" },
];
