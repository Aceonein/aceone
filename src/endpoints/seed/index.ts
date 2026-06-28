import type { Payload, PayloadRequest } from 'payload'

// ── Lexical helpers ───────────────────────────────────────────────────────────

function para(text: string) {
  return {
    type: 'paragraph' as const,
    version: 1,
    children: [{ type: 'text', text, version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  }
}

function heading(text: string, tag: 'h2' | 'h3' = 'h2') {
  return {
    type: 'heading' as const,
    tag,
    version: 1,
    children: [{ type: 'text', text, version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  }
}

function ul(items: string[]) {
  return {
    type: 'list' as const,
    listType: 'bullet' as const,
    start: 1,
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: items.map((text) => ({
      type: 'listitem' as const,
      version: 1,
      children: [{ type: 'text', text, version: 1 }],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      value: 1,
    })),
  }
}

function richDoc(...nodes: object[]) {
  return {
    root: {
      type: 'root',
      children: nodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// Single-para shorthand (for block fields)
function lexical(text: string) {
  return richDoc(para(text))
}

// Table helpers — match block config: headers: {text}[], rows: {cells:{text}[]}[]
function tableHeaders(cols: string[]) {
  return cols.map((text) => ({ text }))
}
function tableRows(rows: string[][]) {
  return rows.map((cells) => ({ cells: cells.map((text) => ({ text })) }))
}

// ── SVG placeholder ───────────────────────────────────────────────────────────

function svgPlaceholder(label: string, bg: string): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${bg}"/>
    <text x="600" y="315" font-family="system-ui" font-size="48" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return Buffer.from(svg)
}

// ── Seed ──────────────────────────────────────────────────────────────────────

export const seed = async ({ payload }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info('Seeding database...')

  // Wipe existing seed data
  for (const col of ['aceone-briefs', 'posts', 'authors', 'categories', 'tags'] as const) {
    const all = await payload.find({ collection: col, limit: 1000, overrideAccess: true, pagination: false })
    for (const doc of all.docs) {
      await payload.delete({ collection: col, id: doc.id as string, overrideAccess: true })
    }
  }

  // ── Tags ─────────────────────────────────────────────────────────────────
  const tagData = [
    'Mutual Funds', 'Index Funds', 'SIP', 'EPF', 'PPF',
    'Tax', 'Budget', 'RBI', 'Inflation', 'Equity', 'Debt',
    'Bitcoin', 'Crypto', 'Retirement', 'Real Estate', 'Insurance',
    'Salary', 'EMI', 'Credit Card', 'SEBI',
  ]
  const tags: Record<string, string> = {}
  for (const name of tagData) {
    const t = await payload.create({ collection: 'tags', data: { name } as any })
    tags[name] = t.id as string
  }

  // ── Media ─────────────────────────────────────────────────────────────────
  const covers = [
    { label: 'Savings vs Inflation', bg: '#022658' },
    { label: 'Index Funds', bg: '#0f172a' },
    { label: 'EPFO Guide', bg: '#1e3a5f' },
    { label: 'Bitcoin ₹85L', bg: '#0c1445' },
    { label: 'RBI Repo Rate', bg: '#052e16' },
    { label: 'Retirement Math', bg: '#1a0533' },
  ]
  const mediaIds: string[] = []
  for (const c of covers) {
    const buf = svgPlaceholder(c.label, c.bg)
    const m = await payload.create({
      collection: 'media',
      data: { alt: c.label },
      file: { data: buf, mimetype: 'image/svg+xml', name: `cover-${c.label.toLowerCase().replace(/\s+/g, '-')}.svg`, size: buf.length },
    })
    mediaIds.push(m.id as string)
  }

  // Brief covers
  const briefCovers = [
    { label: 'Brief #001', bg: '#040508' },
    { label: 'Brief #002', bg: '#040508' },
    { label: 'Brief #003', bg: '#040508' },
  ]
  const briefMediaIds: string[] = []
  for (const c of briefCovers) {
    const buf = svgPlaceholder(c.label, c.bg)
    const m = await payload.create({
      collection: 'media',
      data: { alt: c.label },
      file: { data: buf, mimetype: 'image/svg+xml', name: `brief-${c.label.replace(/\s+/g, '-').toLowerCase()}.svg`, size: buf.length },
    })
    briefMediaIds.push(m.id as string)
  }

  // Avatar
  const avatarBuf = svgPlaceholder('AK', '#022658')
  const avatarMedia = await payload.create({
    collection: 'media',
    data: { alt: 'Aman Khan' },
    file: { data: avatarBuf, mimetype: 'image/svg+xml', name: 'avatar-aman.svg', size: avatarBuf.length },
  })

  // ── User ──────────────────────────────────────────────────────────────────
  const existingUsers = await payload.find({ collection: 'users', where: { email: { equals: 'aman@aceone.in' } }, limit: 1, overrideAccess: true })
  const user = existingUsers.docs[0] ?? await payload.create({
    collection: 'users',
    data: { name: 'Aman Khan', email: 'aman@aceone.in', password: 'Aceone@2024!', role: 'admin' } as any,
  })

  // ── Author ────────────────────────────────────────────────────────────────
  const author = await payload.create({
    collection: 'authors',
    data: {
      name: 'Aman Khan',
      slug: 'aman-khan',
      bio: 'Founder of Aceone. Product manager at Aditya Birla Capital. Writes about money, markets, and the financial decisions young India faces every day.',
      designation: 'Founder & Editor',
      profileImage: avatarMedia.id,
      user: user.id,
      twitter: 'https://twitter.com/aceoneIN',
      linkedin: 'https://linkedin.com/in/aman-khan',
    } as any,
  })

  // ── Categories ────────────────────────────────────────────────────────────
  const catList = [
    { title: 'Personal Finance', key: 'personal-finance', color: 'cobalt' },
    { title: 'Investing', key: 'investing', color: 'emerald' },
    { title: 'Markets', key: 'markets', color: 'amber' },
    { title: 'Policy', key: 'policy', color: 'violet' },
    { title: 'Crypto', key: 'crypto', color: 'teal' },
    { title: 'Deep Dives', key: 'deep-dives', color: 'crimson' },
  ]
  const cats: Record<string, string> = {}
  for (const c of catList) {
    const created = await payload.create({ collection: 'categories', data: { title: c.title, color: c.color } as any })
    cats[c.key] = created.id as string
  }

  // ── Posts ─────────────────────────────────────────────────────────────────
  const postDefs = [
    {
      title: 'Why Your Savings Account Is Making You Poorer Every Year',
      slug: 'savings-account-making-you-poorer',
      excerpt: 'Inflation at 6.5%. Your savings account at 3.5%. Every year you do nothing, you lose 3% of real purchasing power. Here\'s the complete breakdown — and what to do instead.',
      category: 'personal-finance',
      readTime: 6,
      views: 4820,
      upvotes: 312,
      mediaIndex: 0,
      tagNames: ['Inflation', 'Mutual Funds', 'SIP', 'Salary'],
      metaTitle: 'Why Your Savings Account Is Making You Poorer | Aceone',
      metaDesc: 'Inflation runs at 6.5%. Your savings account pays 3.5%. The math means you\'re losing real wealth every year. Here\'s what to do instead.',
      content: [
        { blockType: 'paragraph', content: lexical('Most Indians have one financial habit they learned from their parents: put money in a savings account and forget it. It feels safe. It feels responsible. It is neither. The cruel irony of the modern savings account is that it punishes exactly the kind of disciplined behaviour it was supposed to reward.') },
        { blockType: 'section-marker', label: 'The Math Nobody Shows You' },
        { blockType: 'heading', text: 'Inflation doesn\'t wait for you to be ready', level: 'h2' },
        { blockType: 'paragraph', content: lexical('India\'s Consumer Price Index (CPI) inflation averaged 6.5% over the last three years. The best savings account rate from a major public sector bank? 3.5%. That is a 3% annual gap — every year, in silence, eroding the real value of every rupee parked in your account.') },
        { blockType: 'data-box', title: 'The Real Cost of "Safe" Savings (2024)', dataPoints: [
          { label: 'SBI Savings Rate', value: '3.5%' },
          { label: 'CPI Inflation (3yr avg)', value: '6.5%' },
          { label: 'Real Return', value: '-3.0%', isNegative: true },
          { label: 'Purchasing Power Lost (10yr)', value: '~26%', isNegative: true },
        ]},
        { blockType: 'paragraph', content: lexical('If you had ₹10 lakhs in a savings account in 2014, in real terms you have roughly ₹7.4 lakhs of purchasing power today. The number on your passbook went up. Your actual wealth went down. This is not a hypothetical. This happened to millions of Indians who did the "responsible" thing.') },
        { blockType: 'pull-quote', quote: 'The risk of playing it too safe is the only risk most people never calculate.', attribution: 'Aman Khan, Aceone' },
        { blockType: 'heading', text: 'Why banks offer such low rates', level: 'h2' },
        { blockType: 'paragraph', content: lexical('Banks aren\'t charities. They make money by borrowing from you (your deposits) cheaply and lending to others expensively. The RBI repo rate — currently 6.5% — sets the floor. Banks can borrow from RBI at 6.5%, so why would they pay you more than 3.5%? Your inertia is their margin.') },
        { blockType: 'paragraph', content: lexical('Small Finance Banks (SFBs) offer 7–7.5% on savings accounts because their business model requires attracting deposits aggressively. The same ₹10 lakhs that earns ₹35,000/year at SBI earns ₹70,000–75,000/year at AU Small Finance Bank or Equitas. Same DICGC insurance cover. Same risk.') },
        { blockType: 'section-marker', label: 'Three Moves That Actually Beat Inflation' },
        { blockType: 'heading', text: '1. Liquid mutual funds for your emergency buffer', level: 'h2' },
        { blockType: 'paragraph', content: lexical('Your emergency fund (3–6 months of expenses) doesn\'t need to sit idle. Liquid mutual funds hold commercial papers and treasury bills with maturities under 91 days. Current yields: 6.8–7.5%. Redemption in T+1 business day. No exit load after 7 days. Zero lock-in.') },
        { blockType: 'unordered-list', items: [
          { text: lexical('Returns: 6.8–7.5% (vs 3.5% savings account)') },
          { text: lexical('Liquidity: T+1 redemption (funds in account next business day)') },
          { text: lexical('Tax: Taxed at slab rate (same as FD/savings), but indexation benefits apply for holdings over 3 years under new tax regime for debt MFs') },
          { text: lexical('Best for: Emergency fund, short-term parking of money you\'ll need in <1 year') },
        ]},
        { blockType: 'heading', text: '2. RBI Floating Rate Bonds for your medium-term cash', level: 'h2' },
        { blockType: 'paragraph', content: lexical('If you have money you won\'t touch for 7 years, RBI Floating Rate Bonds are paying 8.05% (as of Q4 2024). Sovereign guarantee — backed by Government of India. No credit risk. Rate resets every 6 months linked to NSC rate. Taxed at slab rate, but the sovereign safety makes it the best risk-free instrument in India for longer horizons.') },
        { blockType: 'heading', text: '3. Nifty 50 index fund SIP for everything else', level: 'h2' },
        { blockType: 'paragraph', content: lexical('For any money with a 10+ year horizon, a Nifty 50 index fund through a monthly SIP remains the single most powerful wealth-building tool available to salaried India. No stock-picking skill required. No timing required. CAGR of 12–14% historically. Expense ratio as low as 0.10% in direct plans.') },
        { blockType: 'paragraph', content: lexical('₹10,000/month SIP for 20 years at 12% CAGR = ₹99 lakhs. The same ₹10,000/month in a savings account for 20 years = ₹28 lakhs. The difference is ₹71 lakhs. That is the real cost of financial inertia.') },
        { blockType: 'table', caption: 'Where to park money based on time horizon', headers: tableHeaders(['Time Horizon', 'Instrument', 'Expected Return', 'Risk', 'Liquidity']), rows: tableRows([
          ['0–3 months', 'SFB Savings Account', '7–7.5%', 'Very Low', 'Instant'],
          ['3–12 months', 'Liquid / Ultra Short MF', '6.8–7.5%', 'Very Low', 'T+1'],
          ['1–3 years', 'Short Duration MF / FD', '7–8%', 'Low', 'Moderate'],
          ['3–7 years', 'RBI Floating Rate Bonds', '8.05%', 'Nil (Sovereign)', 'Low'],
          ['7+ years', 'Equity Index Fund SIP', '12–14%', 'High Short-term', 'T+2'],
        ]) },
        { blockType: 'section-marker', label: 'Bottom Line' },
        { blockType: 'paragraph', content: lexical('Savings accounts have exactly one valid use: your instant-access emergency buffer (30 days of expenses maximum). Everything beyond that should be in instruments that outrun inflation. The good news: you don\'t need a broker, a financial advisor, or a minimum of ₹1 lakh. You need a PAN card, an Aadhaar, and 20 minutes on Zerodha Coin or MF Central.') },
        { blockType: 'disclaimer', content: lexical('This article is for educational purposes only and does not constitute financial advice. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully and consult a SEBI-registered investment advisor before making investment decisions.') },
      ],
    },
    {
      title: 'Nifty 50 vs Nifty Next 50: Which Index Fund Should You Actually Buy?',
      slug: 'nifty-50-vs-next-50-index-fund',
      excerpt: 'Everyone says "just buy index funds" but nobody explains which one. The difference between Nifty 50 and Next 50 goes deeper than returns — it changes your risk profile entirely.',
      category: 'investing',
      readTime: 8,
      views: 7240,
      upvotes: 589,
      mediaIndex: 1,
      tagNames: ['Index Funds', 'Mutual Funds', 'Equity', 'SIP'],
      metaTitle: 'Nifty 50 vs Nifty Next 50: Which Index Fund to Buy? | Aceone',
      metaDesc: 'The index fund debate settled. Nifty 50 or Next 50 — here\'s what the data says, what expense ratios actually cost you, and which one fits your goals.',
      content: [
        { blockType: 'paragraph', content: lexical('The index fund advice is everywhere now. "Just buy Nifty, set SIP, forget it." Great advice. Incomplete advice. Which Nifty? At what expense ratio? From which AMC? These details determine whether you compound at 12% or 13.5% — and over 20 years, that gap is the difference between ₹82 lakhs and ₹1.1 crore on the same SIP amount.') },
        { blockType: 'heading', text: 'What these two indices actually are', level: 'h2' },
        { blockType: 'paragraph', content: lexical('The NSE maintains two indices that most people conflate. They are meaningfully different.') },
        { blockType: 'paragraph', content: lexical('Nifty 50: The 50 largest companies on NSE by free-float market capitalisation. Reliance, TCS, HDFC Bank, Infosys, ICICI Bank make up roughly 45% of the index. It is India\'s blue-chip basket — heavily weighted toward large conglomerates and private banks. Stable. Liquid. Boring. Reliable.') },
        { blockType: 'paragraph', content: lexical('Nifty Next 50: Companies ranked 51st to 100th by market cap. Think Adani Ports, Siemens India, Cholamandalam Finance, Pidilite Industries, Zydus Lifesciences. Slightly smaller companies on the cusp of entering the Nifty 50. More sector diversity. Historically higher returns. Meaningfully higher volatility.') },
        { blockType: 'data-box', title: 'Index Composition Comparison', dataPoints: [
          { label: 'Nifty 50 Stocks', value: '50' },
          { label: 'Next 50 Stocks', value: '50' },
          { label: 'Nifty 50 Top-5 Weight', value: '45%' },
          { label: 'Next 50 Top-5 Weight', value: '28%' },
        ]},
        { blockType: 'heading', text: '10-year performance: the data', level: 'h2' },
        { blockType: 'table', caption: 'Index Performance Comparison (Dec 2024)', headers: tableHeaders(['Index', '3Y CAGR', '5Y CAGR', '10Y CAGR', 'Max Drawdown', 'Std Dev']), rows: tableRows([
          ['Nifty 50', '14.2%', '15.8%', '13.4%', '-38.5%', '17.2%'],
          ['Nifty Next 50', '16.8%', '18.2%', '15.1%', '-44.3%', '22.6%'],
          ['Nifty 500', '15.1%', '16.4%', '13.8%', '-40.1%', '18.4%'],
          ['Nifty Midcap 150', '21.4%', '22.7%', '16.9%', '-47.2%', '25.8%'],
        ]) },
        { blockType: 'paragraph', content: lexical('The Next 50 has outperformed the Nifty 50 over every long horizon — but it has also fallen harder in every crash. The 2020 COVID crash took Nifty 50 down 38.5%. Next 50 fell 44.3%. The 2008 crash saw similar divergence. This is not a reason to avoid it. It is a reason to size it correctly.') },
        { blockType: 'pull-quote', quote: 'The Next 50 is a bet that India\'s next generation of blue chips is already hiding in plain sight.', attribution: 'Aman Khan, Aceone' },
        { blockType: 'heading', text: 'The expense ratio problem nobody talks about', level: 'h2' },
        { blockType: 'paragraph', content: lexical('A 0.5% difference in expense ratio compounds into a massive difference over 20 years. On a ₹10,000/month SIP at 12% gross returns, paying 0.1% ER vs 0.8% ER means the difference of roughly ₹14 lakhs at the 20-year mark. That is not rounding error. That is a car.') },
        { blockType: 'paragraph', content: lexical('Most people pick funds from their bank app. Banks sell regular plans which charge 0.5–1.0% expense ratios versus 0.10–0.20% on direct plans. The difference goes to the distributor (your bank/broker), not to you. Use Zerodha Coin, Groww Direct, or MF Central for direct plans.') },
        { blockType: 'table', caption: 'Best Direct Index Funds by Category (Jan 2025)', headers: tableHeaders(['Fund', 'Tracks', 'ER (Direct)', 'AUM', 'Where to Buy']), rows: tableRows([
          ['UTI Nifty 50 Index Fund', 'Nifty 50', '0.18%', '₹22,800Cr', 'UTI Direct / Zerodha'],
          ['Nippon India Index Fund', 'Nifty 50', '0.20%', '₹8,200Cr', 'Any direct platform'],
          ['UTI Nifty Next 50 Index', 'Nifty Next 50', '0.30%', '₹4,100Cr', 'UTI Direct / Groww'],
          ['ICICI Pru Nifty 500 Index', 'Nifty 500', '0.35%', '₹2,800Cr', 'ICICIDirect / Zerodha'],
        ]) },
        { blockType: 'heading', text: 'My actual recommendation', level: 'h2' },
        { blockType: 'ordered-list', items: [
          { text: lexical('Just starting, under 30: 100% Nifty 50 index fund, direct plan, lowest ER you can find. Build the habit. Simplicity wins early.') },
          { text: lexical('Intermediate investor, 10+ year horizon: 70% Nifty 50 + 30% Next 50. You capture some of the extra return without doubling your volatility.') },
          { text: lexical('Experienced investor, high risk tolerance: 50% Nifty 50 + 30% Next 50 + 20% Midcap 150 index. This is the portfolio that has historically delivered 15–16% CAGR — but be prepared for 45%+ drawdowns.') },
          { text: lexical('Retiree or near-retirement: Nifty 50 only, with a debt allocation to match your needs. Volatility reduction matters more than return maximisation at this stage.') },
        ]},
        { blockType: 'section-marker', label: 'The One-Minute Version' },
        { blockType: 'paragraph', content: lexical('If you just want to start today without reading 800 more words: open MF Central, search "UTI Nifty 50 Index Fund Direct Growth", set up a ₹5,000 monthly SIP, and automate it. You can complicate it later. Starting beats optimising.') },
        { blockType: 'disclaimer', content: lexical('Past performance does not guarantee future results. All CAGR figures are approximate, sourced from NSE and AMC fact sheets. Expense ratios change periodically — verify before investing. This is not financial advice.') },
      ],
    },
    {
      title: 'The EPFO Interest Rate Just Changed: What It Means for Your Retirement',
      slug: 'epfo-interest-rate-retirement-impact',
      excerpt: 'EPFO declared 8.25% for FY24. Sounds great. But there\'s a calculation quirk most employees get wrong that could cost you lakhs at retirement.',
      category: 'policy',
      readTime: 5,
      views: 3180,
      upvotes: 204,
      mediaIndex: 2,
      tagNames: ['EPF', 'PPF', 'Retirement', 'Tax'],
      metaTitle: 'EPFO 8.25% Interest: What It Really Means for You | Aceone',
      metaDesc: 'EPFO declared 8.25% for FY24. Here\'s the calculation most employees get wrong — and the VPF strategy that delivers 12% post-tax equivalent returns.',
      content: [
        { blockType: 'paragraph', content: lexical('The Employees Provident Fund Organisation announced 8.25% interest for FY2023-24. Most employees saw the notification, said "nice," and moved on. Mistake. Understanding how EPF actually works — and doesn\'t work — changes how you think about your retirement planning and whether VPF should be your primary investment vehicle.') },
        { blockType: 'data-box', title: 'EPF FY2024 Key Numbers', dataPoints: [
          { label: 'Interest Rate', value: '8.25%' },
          { label: 'Employee Contribution', value: '12%' },
          { label: 'Employer Contribution', value: '12%' },
          { label: 'Tax Treatment', value: 'EEE' },
        ]},
        { blockType: 'heading', text: 'How EPF interest is actually calculated', level: 'h2' },
        { blockType: 'paragraph', content: lexical('EPF interest is calculated monthly but credited annually. This matters because your balance on April 1 is not the same as your average balance throughout the year. The formula: opening balance each month × monthly interest rate (8.25/12 = 0.6875%).') },
        { blockType: 'paragraph', content: lexical('Here\'s the catch most people miss: contributions made during any given month earn interest only from the following month. So your March contribution — the last month before the interest crediting date — effectively earns zero interest for that year. Contributions made in April earn the full year. This is why EPF\'s effective yield is closer to 7.8–8.0% despite the declared 8.25%.') },
        { blockType: 'heading', text: 'The EEE tax treatment: why it matters at 30% bracket', level: 'h2' },
        { blockType: 'paragraph', content: lexical('EPF falls under the EEE (Exempt-Exempt-Exempt) category: contributions up to ₹1.5 lakh qualify for 80C deduction, returns are tax-free, and maturity proceeds are tax-free. For someone in the 30% tax bracket, an 8.25% tax-free return is equivalent to earning roughly 11.8% in a taxable instrument. That beats most debt mutual funds, FDs, and bonds on a post-tax basis.') },
        { blockType: 'table', caption: 'EPF vs Other Debt Instruments (Post-Tax, 30% Bracket)', headers: tableHeaders(['Instrument', 'Pre-Tax Return', 'Tax Treatment', 'Post-Tax Equivalent']), rows: tableRows([
          ['EPF', '8.25%', 'EEE (fully exempt)', '8.25%'],
          ['PPF', '7.1%', 'EEE (fully exempt)', '7.1%'],
          ['RBI Floating Bond', '8.05%', 'Taxable at slab', '5.6%'],
          ['Bank FD (5yr)', '7.25%', 'Taxable at slab', '5.1%'],
          ['Liquid MF', '7.0%', 'Taxable at slab', '4.9%'],
        ]) },
        { blockType: 'pull-quote', quote: 'For someone in the 30% bracket, EPF is one of the best risk-free instruments in India. Most people hit the mandatory floor and stop. That\'s leaving money on the table.', attribution: 'Aman Khan, Aceone' },
        { blockType: 'heading', text: 'VPF: The most underused retirement tool in India', level: 'h2' },
        { blockType: 'paragraph', content: lexical('Voluntary Provident Fund (VPF) lets you contribute more than the mandatory 12% to your EPF account — up to 100% of basic salary if you want. Same interest rate. Same EEE tax treatment. Same account. No new paperwork beyond a form to your HR department.') },
        { blockType: 'paragraph', content: lexical('For a salaried employee with ₹1 lakh basic salary, contributing an additional ₹20,000/month to VPF means ₹2.4 lakhs/year earning 8.25% tax-free. Over 20 years, that additional contribution compounds to approximately ₹1.18 crore — tax-free. No market risk. No credit risk.') },
        { blockType: 'accordion', items: [
          { title: 'Why is 8.25% not really 8.25% effective?', content: lexical('Interest is calculated on the opening balance of each month. New contributions in a given month count only from the next month. On average, your effective rate is closer to 7.8–8.0%. Still excellent — especially tax-free. But know what you\'re actually getting.'), defaultOpen: true },
          { title: 'What happens to declared-but-uncredited interest?', content: lexical('EPFO declares the rate but Central Government approval is needed before crediting. In FY22, interest was credited 7 months post-declaration. During this period, the declared-but-uncredited amount earns nothing. This is a structural inefficiency in the system.'), defaultOpen: false },
          { title: 'Can I withdraw EPF before retirement?', content: lexical('Partial withdrawals are allowed for medical emergencies (up to 6x monthly salary), home purchase (up to 36x monthly salary), education, and marriage. Full withdrawal is permitted after 2 continuous months of unemployment. Premature withdrawal attracts tax if the account is less than 5 years old.'), defaultOpen: false },
          { title: 'What is the 80C implication of VPF contributions?', content: lexical('VPF contributions qualify for 80C deduction up to the ₹1.5 lakh annual limit — but this is the same bucket as EPF, LIC, ELSS, PPF, etc. If your mandatory EPF contribution already hits ₹1.5 lakh, VPF contributions beyond that offer no additional 80C benefit — though the returns remain tax-free.'), defaultOpen: false },
        ]},
        { blockType: 'disclaimer', content: lexical('EPF rules and interest rates are subject to change. Verify current rates and withdrawal rules on the official EPFO portal (epfindia.gov.in) or with your HR/payroll team. Tax treatment depends on individual circumstances.') },
      ],
    },
    {
      title: 'Bitcoin at ₹85 Lakhs: Should You Buy, Wait, or Run?',
      slug: 'bitcoin-85-lakhs-buy-wait-or-run',
      excerpt: 'BTC crossed ₹85L. Everyone has an opinion. Here\'s a framework for thinking about it clearly — without the hype, without the panic.',
      category: 'crypto',
      readTime: 9,
      views: 12400,
      upvotes: 934,
      mediaIndex: 3,
      tagNames: ['Bitcoin', 'Crypto', 'Tax'],
      metaTitle: 'Bitcoin at ₹85 Lakhs: Buy, Wait or Run? | Aceone',
      metaDesc: 'Bitcoin hit ₹85 lakhs. Here\'s a clear-eyed framework for thinking about crypto allocation — covering fundamentals, tax, sizing, and the case for and against.',
      content: [
        { blockType: 'paragraph', content: lexical('Bitcoin hit ₹85 lakhs in November 2024. Your cousin who bought at ₹25 lakhs won\'t stop texting. Your other cousin who sold at ₹40 lakhs also won\'t stop texting — just with a different tone. Crypto discourse has never been noisier, which is exactly when having a clear framework matters most.') },
        { blockType: 'heading', text: 'What Bitcoin actually is (and isn\'t)', level: 'h2' },
        { blockType: 'paragraph', content: lexical('Bitcoin is a decentralised, fixed-supply digital asset. There will only ever be 21 million BTC. No central bank can print more. No government can dilute the supply. It has no cash flows, no earnings, no P/E ratio. It is not a company. It is not a functioning currency (too volatile for daily commerce). It is not gold (zero industrial use).') },
        { blockType: 'paragraph', content: lexical('It is a speculative store of value — an asset worth exactly what the next buyer will pay. The bull case is that it becomes a global reserve asset, a digital equivalent of gold in a world where major currencies face long-term debasement pressure. The bear case is that it remains a speculative instrument that periodically loses 80% of its value.') },
        { blockType: 'pull-quote', quote: 'Bitcoin is the first provably scarce digital thing in human history. That either matters enormously or doesn\'t matter at all. The honest answer is: we don\'t know which yet.', attribution: 'Aman Khan, Aceone' },
        { blockType: 'heading', text: 'What changed in 2024', level: 'h2' },
        { blockType: 'paragraph', content: lexical('Two structural shifts happened in 2024 that separate this cycle from the 2017 and 2021 retail mania:') },
        { blockType: 'ordered-list', items: [
          { text: lexical('Spot Bitcoin ETFs approved in the US (January 2024): BlackRock, Fidelity, Invesco, and 8 others now offer direct Bitcoin exposure to institutional investors through regulated vehicles. In the first 10 months, these ETFs accumulated over $70 billion AUM — the fastest ETF launch in history.') },
          { text: lexical('The 2024 Halving (April 2024): Every 4 years, the rate of new Bitcoin issuance is cut in half. In April 2024, block rewards dropped from 6.25 BTC to 3.125 BTC per block. Historically, the 12–18 months following a halving have seen significant price appreciation as supply tightens against existing demand.') },
          { text: lexical('Sovereign adoption signals: El Salvador adopted Bitcoin as legal tender. Several US states are exploring Bitcoin reserve bills. This is not mainstream, but the direction of travel matters.') },
        ]},
        { blockType: 'heading', text: 'The case against (India-specific)', level: 'h2' },
        { blockType: 'unordered-list', items: [
          { text: lexical('30% flat tax on every transaction: India imposes a 30% flat tax on all crypto gains — no indexation, no set-off against losses from other crypto assets. On a ₹1 lakh gain, you pay ₹30,000 in tax. You need 43% gross gains just to break even on a bought-and-sold position after Indian tax.') },
          { text: lexical('1% TDS on every sale: Since July 2022, every crypto sale above ₹50,000 (or ₹10,000 for certain users) attracts 1% TDS. This creates immediate cash flow issues for active traders and compounds the tax burden for anyone churning positions.') },
          { text: lexical('No fundamental floor: Unlike equities (which have earnings and assets as a floor) or bonds (which have par value and coupon), Bitcoin has no fundamental floor. In 2011, it fell 93%. In 2014, it fell 85%. In 2018, 84%. In 2022, 77%. Can you hold through that — financially and psychologically?') },
          { text: lexical('Regulatory uncertainty: India\'s crypto regulatory framework remains undefined. The government could change taxation, restrict exchanges, or impose capital controls at any point.') },
        ]},
        { blockType: 'data-box', title: 'Bitcoin India Tax Reality Check (FY2024-25)', dataPoints: [
          { label: 'Flat Tax on Gains', value: '30%' },
          { label: 'TDS on Every Sale', value: '1%' },
          { label: 'Loss Set-off Allowed', value: 'No', isNegative: true },
          { label: 'Break-even Gain Needed', value: '43%+' },
        ]},
        { blockType: 'heading', text: 'If you do decide to allocate: how much?', level: 'h2' },
        { blockType: 'paragraph', content: lexical('The standard framework from institutional investors: allocate only what you can afford to see go to zero. Not 50%. Not 80%. Literally the amount that, if it disappeared tomorrow, would not change your life, your retirement plan, or your relationships.') },
        { blockType: 'table', caption: 'Crypto Allocation by Investor Profile', headers: tableHeaders(['Profile', 'Net Worth', 'Crypto Allocation', 'Reasoning']), rows: tableRows([
          ['Conservative', 'Any', '0–1%', 'Asymmetric option, minimal lifestyle impact if zero'],
          ['Moderate', '₹25L+', '2–3%', 'Meaningful upside, manageable downside'],
          ['Aggressive', '₹50L+', '3–5%', 'High conviction, structured exit strategy'],
          ['Trading', 'Any', 'Separate bucket', 'Never mix speculation with core portfolio'],
          ['Crypto-first', 'Any', '50%+', 'High conviction with written thesis and exit plan'],
        ]) },
        { blockType: 'heading', text: 'Practical notes for Indian investors', level: 'h2' },
        { blockType: 'unordered-list', items: [
          { text: lexical('Use SEBI-registered exchanges: WazirX regulatory status is uncertain post-hack. CoinDCX and Mudrex are currently more compliant options.') },
          { text: lexical('Use a hardware wallet for large holdings: Any crypto on an exchange is custodied by the exchange. If the exchange fails (FTX, Celsius, WazirX), you may lose it. Self-custody via Ledger or Trezor for anything above ₹5 lakhs.') },
          { text: lexical('Track every transaction from day one: India\'s tax department is increasingly sophisticated. ITR-2 requires disclosing virtual digital assets (VDAs). Track cost basis, sale price, and TDS paid. Koinly or CryptoTaxCalculator India work well for this.') },
        ]},
        { blockType: 'disclaimer', content: lexical('Cryptocurrency is highly speculative and largely unregulated in India. Tax treatment is subject to change. Do not invest money you cannot afford to lose entirely. This is not financial advice. Consult a tax professional for crypto-specific tax planning.') },
      ],
    },
    {
      title: 'How the RBI Repo Rate Affects Your EMIs, FDs, and Savings — Explained Simply',
      slug: 'rbi-repo-rate-emis-fds-savings-explained',
      excerpt: 'RBI moved the repo rate again and finance Twitter exploded. Here\'s what it actually means for your EMI, your FD, and your savings — in plain language.',
      category: 'markets',
      readTime: 7,
      views: 5640,
      upvotes: 421,
      mediaIndex: 4,
      tagNames: ['RBI', 'EMI', 'Inflation', 'Debt'],
      metaTitle: 'How RBI Repo Rate Affects Your EMI, FD & Savings | Aceone',
      metaDesc: 'RBI changed the repo rate. Here\'s exactly what that means for your home loan EMI, fixed deposit returns, and savings account — explained without the jargon.',
      content: [
        { blockType: 'paragraph', content: lexical('The RBI Monetary Policy Committee met last week. They announced a repo rate decision. Finance Twitter exploded with hot takes, rate cut victory laps, or doom-and-gloom warnings. You, wisely, wondered what any of it actually means for your money. Let\'s break it down — no economics degree required.') },
        { blockType: 'heading', text: 'What is the repo rate?', level: 'h2' },
        { blockType: 'paragraph', content: lexical('Repo rate is the interest rate at which the RBI lends money to commercial banks for very short periods (usually overnight). Think of it as the wholesale price of money. When the RBI sets the repo rate, it\'s setting the floor for the entire lending ecosystem in India.') },
        { blockType: 'paragraph', content: lexical('When the repo rate goes up: banks pay more to borrow from RBI → they charge you more on loans. When it goes down: banks pay less → they can (eventually) charge you less and offer less on deposits. The word "eventually" matters enormously, and we\'ll come back to it.') },
        { blockType: 'data-box', title: 'Current RBI Policy Rates (Q4 2024)', dataPoints: [
          { label: 'Repo Rate', value: '6.50%' },
          { label: 'Standing Deposit Facility', value: '6.25%' },
          { label: 'Marginal Standing Facility', value: '6.75%' },
          { label: 'CPI Inflation Target', value: '4.0%' },
        ]},
        { blockType: 'heading', text: 'How a repo rate change flows to you', level: 'h2' },
        { blockType: 'table', caption: 'Transmission: From RBI to Your Pocket', headers: tableHeaders(['What Changes', 'Direction', 'Time to Impact', 'Impact on You', 'Action']), rows: tableRows([
          ['Floating Home/Car Loan', 'Same as repo', '1–3 months', 'EMI or tenure changes', 'Check if bank transmitted fully'],
          ['Fixed Rate Loans', 'No impact (fixed)', 'Never', 'No change', 'None required'],
          ['New Loans', 'Same direction', 'Immediate', 'New offers change', 'Compare before taking'],
          ['Bank FD Rates', 'Same direction (loose)', '1–6 months', 'Returns offered change', 'Lock in during rate hike cycle'],
          ['Savings Account Rate', 'Barely moves', 'Slow/Never', 'Usually stays 3–4%', 'Switch to SFB or liquid MF'],
          ['Stock Market', 'Inverse typically', 'Immediate', 'Valuations re-priced', 'Nothing impulsive'],
          ['INR vs USD', 'Complex (flows-driven)', 'Immediate', 'Import costs change', 'None for most investors'],
        ]) },
        { blockType: 'heading', text: 'Specifically: what to do with your home loan', level: 'h2' },
        { blockType: 'paragraph', content: lexical('If you have a floating-rate home loan (most home loans are), a repo rate change should change your EMI or your loan tenure. But banks have a habit of not passing on cuts fully or quickly — while hikes happen immediately. Here\'s what to do:') },
        { blockType: 'ordered-list', items: [
          { text: lexical('Get your loan statement: Check your current EMI and outstanding tenure. Calculate what they should be at the new RLLR (Repo-Linked Lending Rate). Most banks will publish this.') },
          { text: lexical('Request a formal reset: Email your bank\'s home loan department asking them to reset your loan to the current applicable rate. Many banks don\'t do this automatically.') },
          { text: lexical('Consider balance transfer if gap is large: If your existing rate is more than 0.5% above what a competitor is offering, a balance transfer could save lakhs over the loan tenure. Calculate the processing fee against the savings.') },
        ]},
        { blockType: 'heading', text: 'Fixed deposits: the repo rate window', level: 'h2' },
        { blockType: 'paragraph', content: lexical('The best time to lock into FDs is during a rate hike cycle — when rates are high and you expect them to start falling. This is counterintuitive: when rates are rising, wait until they peak, then lock in the highest possible rate for the longest term you can afford.') },
        { blockType: 'paragraph', content: lexical('When rates fall (rate cut cycle), do not lock into long-term FDs at lower rates. Instead, keep funds in liquid mutual funds or short-duration debt funds, which will benefit as bond prices rise when rates fall.') },
        { blockType: 'pull-quote', quote: 'The repo rate is the price of money. Every financial product you touch is downstream of it. Understanding it means you stop being surprised by your EMI statement.', attribution: 'Aman Khan, Aceone' },
        { blockType: 'accordion', items: [
          { title: 'Why do savings account rates barely move even when repo rate changes?', content: lexical('Banks hold massive current and savings account (CASA) deposits that are cheap funding. They have little incentive to raise savings rates aggressively because depositors rarely switch banks. The RBI has no mandate to force savings rate changes (unlike lending rates which have RLLR linkage for home loans). This asymmetry is structural.'), defaultOpen: true },
          { title: 'What is RLLR and how is it different from MCLR?', content: lexical('RLLR (Repo-Linked Lending Rate) links loan rates directly to the RBI repo rate — mandated by RBI since October 2019 for all new floating-rate home and auto loans. MCLR (Marginal Cost of Funds Based Lending Rate) was the older benchmark, calculated by banks internally. MCLR is slower to transmit — banks on MCLR often don\'t pass on cuts for 6–12 months.'), defaultOpen: false },
          { title: 'Does the repo rate affect my credit card interest rate?', content: lexical('No. Credit card interest rates are set by individual banks and are not directly linked to the repo rate. They typically range from 36–48% annually and rarely change with RBI policy. Credit card debt is the most expensive debt in India — pay it off before any investment consideration.'), defaultOpen: false },
        ]},
        { blockType: 'disclaimer', content: lexical('Interest rate impacts depend on individual bank policies and loan agreements. Check your loan documentation and contact your bank for specific information. This is not financial advice.') },
      ],
    },
    {
      title: 'The ₹1 Crore Retirement Number Is Wrong for Most Indians. Here\'s What You Actually Need.',
      slug: 'one-crore-retirement-number-wrong',
      excerpt: '₹1 crore sounds like a lot. At 6.5% inflation and a 3.5% safe withdrawal rate, it sustains ₹35,000/month of expenses. In 2024 rupees. For someone retiring now. The real number is 3–8x higher.',
      category: 'deep-dives',
      readTime: 12,
      views: 9870,
      upvotes: 1102,
      mediaIndex: 5,
      tagNames: ['Retirement', 'Mutual Funds', 'EPF', 'PPF', 'Equity', 'Insurance'],
      metaTitle: 'The Real Retirement Corpus You Need in India | Aceone Deep Dive',
      metaDesc: '₹1 crore retirement target is dangerously wrong. Here\'s the complete calculation — what you actually need, how to get there, and the variables most planners ignore.',
      content: [
        { blockType: 'paragraph', content: lexical('Every financial influencer has a retirement calculator. Every calculator seems to suggest you need ₹1 crore. The number feels big. It isn\'t. And the consequences of underestimating your retirement corpus are not correctable once you\'re 65 and no longer earning.') },
        { blockType: 'paragraph', content: lexical('Let\'s do the actual math. At a 3.5% safe withdrawal rate (the conservative Indian equivalent of the 4% rule) and 6.5% inflation, ₹1 crore today sustains approximately ₹35,000/month. That\'s ₹35,000 in 2024 rupees. For someone retiring at 60 and living until 82, that ₹35,000 becomes ₹12,000 in real purchasing power by year 22 due to inflation. This is not a comfortable retirement for anyone living in an Indian metro.') },
        { blockType: 'data-box', title: 'What ₹1 Crore Actually Buys in Retirement', dataPoints: [
          { label: 'Monthly Income (Year 1)', value: '₹35,000' },
          { label: 'Monthly Income (Year 10)', value: '₹20,600' },
          { label: 'Monthly Income (Year 22)', value: '₹12,000' },
          { label: 'Real Purchasing Power Lost', value: '66%', isNegative: true },
        ]},
        { blockType: 'heading', text: 'The 4% rule — why it doesn\'t fully apply in India', level: 'h2' },
        { blockType: 'paragraph', content: lexical('The 4% rule was derived by financial planner William Bengen in 1994, based on US market data from 1926–1992 with a 60% equity / 40% bond portfolio. The conclusion: withdraw 4% of your corpus annually, adjust for inflation, and you have a 95% probability of your money lasting 30 years.') },
        { blockType: 'paragraph', content: lexical('India\'s situation differs on three critical dimensions. First, Indian inflation is structurally higher (5–7% vs 2–3% in the US). Second, Indian bond yields are higher but equity volatility is also higher. Third, Indian equity market history is shorter (NSE launched in 1992), making statistical confidence intervals wider. Conservative Indian planners use 3–3.5% as the safe withdrawal rate — meaning you need a larger corpus for the same income.') },
        { blockType: 'heading', text: 'The real retirement corpus by lifestyle', level: 'h2' },
        { blockType: 'table', caption: 'Retirement Corpus Required by Lifestyle (2024 Rupees, 3.5% SWR)', headers: tableHeaders(['Lifestyle', 'Monthly Spend (Today)', 'Years in Retirement', 'Base Corpus Needed', 'Healthcare Buffer', 'Total Target']), rows: tableRows([
          ['Frugal (Tier-2 city)', '₹30,000', '22', '₹1.03Cr', '₹50L', '₹1.53Cr'],
          ['Middle (Tier-2 city)', '₹50,000', '22', '₹1.71Cr', '₹50L', '₹2.21Cr'],
          ['Comfortable (Metro)', '₹80,000', '22', '₹2.74Cr', '₹75L', '₹3.49Cr'],
          ['Premium (Metro)', '₹1,50,000', '22', '₹5.14Cr', '₹1Cr', '₹6.14Cr'],
          ['Affluent (Metro)', '₹2,50,000', '25', '₹8.57Cr', '₹1.5Cr', '₹10.07Cr'],
        ]) },
        { blockType: 'heading', text: 'The variables most calculators ignore', level: 'h2' },
        { blockType: 'unordered-list', items: [
          { text: lexical('Healthcare inflation at 14%/year: Medical costs in India are rising at nearly double the CPI. A single hospitalisation today can cost ₹5–20 lakhs. At 14% inflation, the same procedure costs 4x more in 10 years. Your retirement corpus must account for this — either through a dedicated healthcare corpus or a comprehensive super top-up health insurance policy held throughout retirement.') },
          { text: lexical('Sequence of returns risk: If markets crash in your first 3 years of retirement and you\'re withdrawing simultaneously, your corpus may never recover even if markets bounce back. This is why a 2–3 year cash/short-term buffer at retirement is not optional — it prevents forced selling into a down market.') },
          { text: lexical('Longevity: Life expectancy at 60 in urban India has risen to 82 years. That\'s 22 years of retirement minimum. Plan for 25–30 years to be safe. A 95-year-old with ₹0 in their corpus is a catastrophic failure mode.') },
          { text: lexical('Elder care costs: Parents and in-laws living longer means potential financial support obligations. This is a real cost that Indian retirement planning systematically ignores.') },
          { text: lexical('The housing question: Do you own your home debt-free at retirement? If yes, you remove the largest expense variable. If no, rent or EMI must be part of your monthly expense calculation.') },
        ]},
        { blockType: 'pull-quote', quote: 'The most expensive financial mistake is underestimating what retirement actually costs. Unlike most financial mistakes, this one cannot be corrected after the fact.', attribution: 'Aman Khan, Aceone', size: 'large' },
        { blockType: 'section-marker', label: 'Building the Corpus: A Framework' },
        { blockType: 'heading', text: 'Step-by-step: calculating your personal retirement number', level: 'h3' },
        { blockType: 'ordered-list', items: [
          { text: lexical('Estimate retirement monthly expenses in today\'s money: Be realistic. Include rent (if applicable), groceries, utilities, entertainment, travel, family support. Do not project your current salary — project your retirement lifestyle costs.') },
          { text: lexical('Apply the SWR formula: Annual spend ÷ 0.035 = base corpus needed. For ₹80,000/month: (₹80,000 × 12) ÷ 0.035 = ₹2.74 crore.') },
          { text: lexical('Add healthcare buffer: Minimum ₹50 lakhs in a separate, liquid corpus. More if you have a family history of chronic illness or no employer-sponsored health insurance in retirement.') },
          { text: lexical('Inflate to your retirement date: Use a retirement calculator to find how much today\'s corpus target equals in future rupees. At 7% inflation, a ₹3.49 crore target in today\'s money becomes approximately ₹8.7 crore needed by 2044 for someone retiring in 20 years.') },
          { text: lexical('Calculate your gap: Subtract EPF projected balance + PPF corpus + any pension or annuity income (converted to corpus equivalent) from your target. The gap is what your investments need to close.') },
          { text: lexical('Reverse-engineer your SIP: Use the compound interest formula or a SIP calculator. If you need ₹5 crore in 25 years at 12% CAGR, you need a SIP of approximately ₹21,000/month starting now.') },
        ]},
        { blockType: 'heading', text: 'The power of starting early: the math is unforgiving', level: 'h2' },
        { blockType: 'table', caption: 'Monthly SIP Required to Reach ₹5 Crore by Age 60 (12% CAGR)', headers: tableHeaders(['Starting Age', 'Years to Invest', 'Monthly SIP Needed', 'Total Invested', 'Market Gain']), rows: tableRows([
          ['25', '35', '₹6,500', '₹27.3L', '₹4.73Cr'],
          ['30', '30', '₹11,500', '₹41.4L', '₹4.59Cr'],
          ['35', '25', '₹21,000', '₹63L', '₹4.37Cr'],
          ['40', '20', '₹39,500', '₹94.8L', '₹4.05Cr'],
          ['45', '15', '₹82,000', '₹1.48Cr', '₹3.52Cr'],
        ]) },
        { blockType: 'paragraph', content: lexical('A 25-year-old reaching their ₹5 crore goal invests ₹27 lakhs of their own money. A 45-year-old reaching the same goal must invest ₹1.48 crore. Time is the only free input in compounding. Everything else — returns, income, savings rate — can be optimised, but not substituted for time.') },
        { blockType: 'disclaimer', content: lexical('Retirement projections involve significant assumptions about inflation, investment returns, healthcare costs, and lifespan. These figures are illustrative estimates only. Actual outcomes will differ. Consult a SEBI-registered financial planner for personalised retirement planning.') },
      ],
    },
  ]

  // Create posts (collect IDs for cross-referencing)
  const postIds: string[] = []
  const postBySlug: Record<string, string> = {}

  for (const [idx, p] of postDefs.entries()) {
    const created = await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        author: author.id,
        categories: [cats[p.category]],
        tags: p.tagNames.map((n) => tags[n]).filter(Boolean),
        featuredImage: mediaIds[p.mediaIndex],
        featuredImageAlt: p.title,
        readTime: p.readTime,
        views: p.views,
        upvotes: p.upvotes,
        status: 'published',
        publishedAt: new Date(Date.now() - idx * 4 * 24 * 60 * 60 * 1000).toISOString(),
        content: p.content,
        meta: { title: p.metaTitle, description: p.metaDesc },
        createdBy: user.id,
      } as any,
      overrideAccess: true,
    })
    postIds.push(created.id as string)
    postBySlug[p.slug] = created.id as string
    payload.logger.info(`Created post: ${p.title}`)
  }

  // Add related posts cross-references
  const relatedMap: Record<string, string[]> = {
    'savings-account-making-you-poorer': ['nifty-50-vs-next-50-index-fund', 'one-crore-retirement-number-wrong'],
    'nifty-50-vs-next-50-index-fund': ['savings-account-making-you-poorer', 'one-crore-retirement-number-wrong'],
    'epfo-interest-rate-retirement-impact': ['one-crore-retirement-number-wrong', 'savings-account-making-you-poorer'],
    'bitcoin-85-lakhs-buy-wait-or-run': ['rbi-repo-rate-emis-fds-savings-explained', 'nifty-50-vs-next-50-index-fund'],
    'rbi-repo-rate-emis-fds-savings-explained': ['bitcoin-85-lakhs-buy-wait-or-run', 'savings-account-making-you-poorer'],
    'one-crore-retirement-number-wrong': ['savings-account-making-you-poorer', 'epfo-interest-rate-retirement-impact'],
  }
  for (const [slug, relSlugs] of Object.entries(relatedMap)) {
    const id = postBySlug[slug]
    const relIds = relSlugs.map((s) => postBySlug[s]).filter(Boolean)
    if (id && relIds.length) {
      await payload.update({ collection: 'posts', id, data: { relatedPosts: relIds } as any, overrideAccess: true })
    }
  }

  // ── Aceone Briefs (Newsletter Issues) ────────────────────────────────────
  const briefs = [
    {
      title: 'Issue #001 — The Savings Trap: Why Playing It Safe Is the Riskiest Move',
      emailSubject: 'Your savings account is making you poorer (here\'s the math)',
      emailPreviewText: 'Inflation 6.5%. Savings rate 3.5%. Every year you wait, you lose 3% in real terms. Let\'s fix this.',
      tags: [{ tag: 'Savings' }, { tag: 'Inflation' }, { tag: 'Mutual Funds' }],
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      mediaIndex: 0,
      content: richDoc(
        heading('Good Sunday morning.'),
        para('This week I want to talk about something that affects every single working Indian — and costs most of them lakhs over their lifetime without them ever noticing.'),
        para('Your savings account is making you poorer.'),
        para('Not "less rich." Actively poorer. Here\'s the math most banks don\'t want you to think about.'),
        heading('The Inflation-Savings Gap', 'h2'),
        para('CPI inflation in India averaged 6.5% over the last three years. The best savings account rate from SBI, HDFC, or Axis? 3.5%. That\'s a 3% annual gap — meaning every year you park money in a savings account, you lose 3% of its real purchasing power.'),
        para('₹10 lakhs in 2014 has the purchasing power of roughly ₹7.4 lakhs today — even though your passbook says ₹13–14 lakhs (with interest). The number went up. Your wealth went down.'),
        heading('Three Things to Do This Week', 'h2'),
        para('1. Move your emergency fund to a liquid mutual fund. Same-day or next-day access. 6.8–7.5% returns. Zero lock-in. Use Zerodha Coin or MF Central to set it up in 15 minutes.'),
        para('2. If you haven\'t started an SIP yet, start one this Sunday. ₹5,000/month in a Nifty 50 direct plan index fund. Automate it. Forget it. Come back in 10 years.'),
        para('3. If you have money sitting idle for 7+ years with no specific goal, look at RBI Floating Rate Bonds. 8.05% right now. Sovereign guarantee. No credit risk.'),
        heading('The One Number That Changes Everything', 'h2'),
        para('₹10,000/month in a savings account for 20 years = ₹28 lakhs.'),
        para('₹10,000/month SIP in Nifty 50 for 20 years at 12% CAGR = ₹99 lakhs.'),
        para('The difference is ₹71 lakhs. That\'s not financial advice. That\'s arithmetic.'),
        para('See you next Sunday.'),
        para('— Aman'),
      ),
    },
    {
      title: 'Issue #002 — Index Funds Explained: Which Nifty and Why It Matters',
      emailSubject: 'Nifty 50 vs Next 50: the ₹14 lakh difference most people ignore',
      emailPreviewText: 'Not all index funds are equal. The expense ratio difference alone costs ₹14 lakhs over 20 years. Here\'s what to buy and why.',
      tags: [{ tag: 'Index Funds' }, { tag: 'Nifty' }, { tag: 'Expense Ratio' }],
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      mediaIndex: 1,
      content: richDoc(
        heading('Good Sunday morning.'),
        para('"Just buy index funds" is the best financial advice most people give — and the most incomplete. Which index? At what expense ratio? From which platform? These questions determine whether you end up with ₹82 lakhs or ₹1.1 crore on the same SIP amount. Let\'s fix the incomplete advice.'),
        heading('Nifty 50 vs Nifty Next 50: The Actual Difference', 'h2'),
        para('Nifty 50 = India\'s 50 largest companies. Reliance, TCS, HDFC Bank, Infosys. Blue chips. Stable. 13.4% CAGR over 10 years.'),
        para('Nifty Next 50 = Companies ranked 51–100. Smaller, more volatile, historically 15.1% CAGR over 10 years. Falls harder in crashes (44% vs 38% in 2020). Recovers strongly in bull markets.'),
        para('Neither is "better." They serve different roles in your portfolio depending on your time horizon and stomach for volatility.'),
        heading('The Expense Ratio Problem', 'h2'),
        para('A 0.5% difference in expense ratio compounds into ₹14 lakhs on a ₹10,000/month SIP over 20 years. Most people invest through their bank app — which sells regular plans at 0.5–1.0% expense ratio. The same fund in Direct Plan costs 0.10–0.20%.'),
        para('The difference goes to your bank\'s relationship manager, not to you.'),
        heading('This Week\'s Action', 'h2'),
        ul([
          'Switch to direct plans: Open MF Central (mfcentral.com) — it\'s AMFI\'s official platform, no intermediary.',
          'Compare your current fund\'s Direct vs Regular NAV: The gap widens every year.',
          'If you\'re starting fresh: UTI Nifty 50 Index Fund Direct Growth (0.18% ER) is my current go-to for simplicity.',
          'For a 10+ year horizon with higher risk appetite: 70% Nifty 50 + 30% Nifty Next 50.',
        ]),
        heading('Reader Question This Week', 'h2'),
        para('"Should I switch from my regular plan Nifty 50 fund to a direct plan even though I\'ll have to pay exit load?"'),
        para('Usually yes — if you have more than 2 years of investing ahead, the compounding savings from the lower expense ratio outweigh the one-time exit load (typically 1% on units redeemed within 1 year). Do the math on your specific corpus.'),
        para('See you next Sunday.'),
        para('— Aman'),
      ),
    },
    {
      title: 'Issue #003 — The Retirement Number Nobody Tells You',
      emailSubject: '₹1 crore is not enough to retire in India. Here\'s the real number.',
      emailPreviewText: 'At 3.5% safe withdrawal rate, ₹1 crore pays ₹35,000/month. In 2024 rupees. Is that your retirement plan?',
      tags: [{ tag: 'Retirement' }, { tag: 'Corpus' }, { tag: 'SIP' }],
      publishedAt: new Date().toISOString(),
      mediaIndex: 2,
      content: richDoc(
        heading('Good Sunday morning.'),
        para('The most dangerous financial number in India isn\'t your credit card interest rate or your EMI. It\'s the retirement corpus target that most people are working toward — ₹1 crore — which is dangerously, catastrophically insufficient for anyone planning to retire in an Indian metro.'),
        para('I know that\'s a strong statement. Here\'s the math.'),
        heading('What ₹1 Crore Actually Buys in Retirement', 'h2'),
        para('Safe withdrawal rate for India: 3.5% (conservative adjustment from the US 4% rule, accounting for higher inflation and shorter equity market history).'),
        para('₹1 crore × 3.5% = ₹3.5 lakhs/year = ₹29,200/month.'),
        para('That\'s your retirement income. ₹29,200/month in 2024 rupees. Before inflation. In year 10 of your retirement, at 6.5% inflation, that ₹29,200 has the purchasing power of ₹17,200. In year 22, it\'s ₹10,600.'),
        para('This is not a comfortable retirement for anyone living in Bangalore, Mumbai, Delhi, Hyderabad, or Pune.'),
        heading('The Real Numbers by Lifestyle', 'h2'),
        para('Frugal Tier-2 city retirement (₹30,000/month): You need ₹1.53Cr (base ₹1.03Cr + ₹50L healthcare buffer).'),
        para('Comfortable metro retirement (₹80,000/month): You need ₹3.49Cr (base ₹2.74Cr + ₹75L healthcare buffer).'),
        para('Premium metro retirement (₹1.5L/month): You need ₹6.14Cr (base ₹5.14Cr + ₹1Cr healthcare buffer).'),
        heading('The Three Variables Most People Ignore', 'h2'),
        ul([
          'Healthcare inflation at 14%/year: A procedure costing ₹5L today costs ₹20L in 10 years.',
          'Longevity: Life expectancy at 60 in urban India is now 82. Plan for 25–30 years of retirement minimum.',
          'Sequence of returns risk: If markets crash in your first 3 years of retirement, you may deplete your corpus even if you recover later.',
        ]),
        heading('What to Do About It', 'h2'),
        para('Step 1: Define your retirement lifestyle in today\'s rupees. Be honest. Most people underestimate.'),
        para('Step 2: Apply the formula — (monthly spend × 12) ÷ 0.035 = base corpus. Add ₹50L–₹1Cr healthcare buffer.'),
        para('Step 3: Inflate to your retirement date (7% assumption for safety).'),
        para('Step 4: Calculate the SIP needed to reach that number. The Zerodha SIP calculator or Freefincal tools work well for this.'),
        para('Step 5: Automate the SIP today. The difference between starting at 25 vs 35 is ₹1.5L more per month for the same corpus — for the rest of your working life.'),
        heading('A Final Note', 'h2'),
        para('I know this is a heavy Sunday email. But I\'d rather you read this at 30 and adjust your plan than read it at 58 and have no good options left.'),
        para('Next week: We\'re breaking down exactly how the RBI repo rate change affects your EMI, FD, and savings — and what you should actually do about it.'),
        para('See you next Sunday.'),
        para('— Aman'),
      ),
    },
  ]

  for (const brief of briefs) {
    await payload.create({
      collection: 'aceone-briefs',
      data: {
        title: brief.title,
        emailSubject: brief.emailSubject,
        emailPreviewText: brief.emailPreviewText,
        tags: brief.tags,
        publishedAt: brief.publishedAt,
        author: author.id,
        coverImage: briefMediaIds[brief.mediaIndex],
        status: 'draft',
        content: brief.content,
      } as any,
      overrideAccess: true,
    })
    payload.logger.info(`Created brief: ${brief.title}`)
  }

  // ── Legal Pages ───────────────────────────────────────────────────────────
  await createLegalPages(payload)

  payload.logger.info('Seed complete.')
}

async function createLegalPages(payload: Payload) {
  const privacyContent = richDoc(
    heading('1. Who We Are'),
    para('Aceone ("we", "our", "us") operates the website at blog.aceone.in and the newsletter "The Aceone Brief". We are an independent financial media platform based in Mumbai, India.'),
    para('For data-related queries, contact us at: hello@aceone.in'),

    heading('2. Data We Collect'),
    para('We collect only what is necessary to deliver the newsletter and improve the platform:'),
    ul(['Email address — to send The Aceone Brief', 'IP address — captured at signup for DPDP audit trail purposes only; not used for tracking', 'Browser/device metadata (user agent, referrer) — to understand how subscribers find us', 'Consent records — timestamps and scope of consent given at signup']),
    para('We do not collect your name, phone number, payment details, or any government-issued ID.'),

    heading('3. How We Use Your Data'),
    para('Your data is used solely for the purposes you consented to:'),
    ul(['Sending The Aceone Brief to your email address (newsletter consent)', 'Sending occasional product updates about Aceone (marketing consent, only if opted in)', 'Maintaining an audit trail of consent records as required by the DPDP Act 2023', 'Analysing aggregate (non-identifiable) readership trends to improve content']),
    para('We do not sell your data, share it with advertisers, or use it for automated decision-making that affects you.'),

    heading('4. Data Storage and Security'),
    para('Your subscriber data is stored in two systems:'),
    ul(['MongoDB Atlas — subscriber records (email, status, preferences). Cluster hosted in Mumbai, India (ap-south-1 region), in compliance with DPDP data localisation requirements.', 'Supabase — immutable consent audit log. Stores consent type, timestamp, and IP address. Records are never deleted; only marked as revoked on unsubscribe.']),
    para('Emails are sent via Resend (a US-based transactional email service). By subscribing, you acknowledge that your email address is transmitted to Resend for the sole purpose of email delivery.'),
    para('We use HTTPS throughout. Access to subscriber data is restricted to authorised team members only.'),

    heading('5. Your Rights Under DPDP Act 2023'),
    para('As a data principal under the Digital Personal Data Protection Act 2023, you have the right to:'),
    ul(['Access — request a copy of the personal data we hold about you', 'Correction — request correction of inaccurate data', 'Erasure — request deletion of your personal data (right to be forgotten)', 'Withdraw consent — unsubscribe at any time via the link in any email, or by emailing us', 'Grievance redressal — raise a complaint with us before escalating to the Data Protection Board of India']),
    para('To exercise any of these rights, email hello@aceone.in from your subscribed email address. We will respond within 30 days.'),
    para('Note: consent audit logs (Supabase) are maintained as legally required records and cannot be fully deleted, but they will be anonymised on erasure requests.'),

    heading('6. Cookies'),
    para('We use a single first-party localStorage entry (ao_cookie_consent) to remember your cookie consent preference. This contains only your decision (accepted/rejected) and a timestamp. No tracking cookies are set without your explicit consent. If you reject cookies, your experience on the site is not affected.'),

    heading('7. Third-Party Services'),
    para('We use the following third-party services, each with their own privacy policies:'),
    ul(['Resend — email delivery (resend.com/privacy)', 'Vercel — website hosting (vercel.com/legal/privacy-policy)', 'Supabase — consent log storage (supabase.com/privacy)', 'MongoDB Atlas — database (mongodb.com/legal/privacy-policy)']),

    heading('8. Retention'),
    para('We retain your subscriber data for as long as your subscription is active. If you unsubscribe, your email and personal data are deleted from operational systems within 30 days. Consent audit records are anonymised (IP and user agent removed) but the consent event record is retained as required by law.'),

    heading('9. Children'),
    para('Our service is not directed at persons under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has subscribed, contact us immediately.'),

    heading('10. Changes to This Policy'),
    para('We may update this policy periodically. Material changes will be communicated to active subscribers via email before taking effect. The "last updated" date reflects the most recent revision.'),

    heading('11. Contact & Grievance Officer'),
    para('Grievance Officer: Aman Khan'),
    para('Email: hello@aceone.in'),
    para('Address: Mumbai, Maharashtra, India'),
    para('Response time: within 30 days'),
  )

  const termsContent = richDoc(
    heading('1. Acceptance'),
    para('By accessing blog.aceone.in or subscribing to The Aceone Brief, you agree to these Terms of Service. If you do not agree, do not use the service.'),
    para('These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.'),

    heading('2. The Service'),
    para('Aceone operates a financial media platform publishing articles and a weekly newsletter, The Aceone Brief, at blog.aceone.in. The service is free to read and subscribe to.'),
    para('We reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice to active subscribers.'),

    heading('3. Newsletter Subscription'),
    para('By subscribing to The Aceone Brief:'),
    ul(['You consent to receive a weekly email newsletter from Aceone', 'You confirm you are 18 years of age or older', 'You confirm the email address provided belongs to you', 'You understand you can unsubscribe at any time via the link in any email']),
    para('We aim to send one email per week (every Sunday at 12:30 PM IST). We may occasionally send additional emails about significant Aceone updates. We will never send unsolicited commercial emails beyond the scope of your consent.'),

    heading('4. Not Financial Advice'),
    para('All content published by Aceone — including articles, newsletter issues, data boxes, and commentary — is for informational and educational purposes only. It does not constitute financial advice, investment advice, trading advice, or any other form of advice.'),
    para('Aceone is not a SEBI-registered investment adviser, research analyst, or portfolio manager. Nothing published should be construed as a recommendation to buy, sell, or hold any security, mutual fund, or financial product.'),
    para('Past performance discussed in our content does not guarantee future results. All investments carry risk, including the possible loss of principal. Always consult a qualified, SEBI-registered financial adviser before making investment decisions.'),

    heading('5. Intellectual Property'),
    para('All content on blog.aceone.in — including articles, newsletter issues, data analysis, graphics, and design — is the intellectual property of Aceone and its contributors, protected under the Copyright Act, 1957.'),
    para('You may share individual articles with attribution ("Source: Aceone, blog.aceone.in") and a link to the original. You may not reproduce, republish, or distribute content in bulk, commercially, or without attribution.'),

    heading('6. User Conduct'),
    para('You agree not to:'),
    ul(['Use the service for any unlawful purpose', 'Attempt to scrape, crawl, or systematically download content', 'Misrepresent Aceone\'s content as your own', 'Attempt to gain unauthorised access to any part of the platform', 'Use our content to generate AI training datasets without written permission']),

    heading('7. Accuracy of Information'),
    para('We make reasonable efforts to ensure the accuracy of information published. However, financial data, regulations, and market conditions change rapidly. Aceone does not warrant that any information is current, complete, or error-free.'),
    para('Any reliance you place on information from Aceone is strictly at your own risk.'),

    heading('8. Limitation of Liability'),
    para('To the fullest extent permitted by applicable law, Aceone shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the service or any content published — including financial losses arising from investment decisions influenced by our content.'),

    heading('9. Third-Party Links'),
    para('Our content may link to third-party websites for reference. These links are provided for convenience only. Aceone does not endorse, control, or take responsibility for the content, privacy practices, or services of any third-party site.'),

    heading('10. Privacy'),
    para('Your use of the service is also governed by our Privacy Policy (/privacy), which explains how we collect and handle your personal data in compliance with the Digital Personal Data Protection Act 2023.'),

    heading('11. Changes to Terms'),
    para('We may update these terms from time to time. Material changes will be communicated to active subscribers via email at least 14 days before taking effect. Continued use of the service after the effective date constitutes acceptance of the updated terms.'),

    heading('12. Contact'),
    para('Questions about these terms:'),
    para('Email: hello@aceone.in'),
    para('Aceone, Mumbai, Maharashtra, India'),
  )

  const legalPages = [
    {
      title: 'Privacy Policy',
      slug: 'privacy',
      content: privacyContent,
      metaTitle: 'Privacy Policy — Aceone',
      metaDesc: 'How Aceone collects, uses, and protects your personal data under the Digital Personal Data Protection Act, 2023.',
    },
    {
      title: 'Terms of Service',
      slug: 'terms',
      content: termsContent,
      metaTitle: 'Terms of Service — Aceone',
      metaDesc: 'Terms governing your use of Aceone and subscription to The Aceone Brief newsletter.',
    },
  ]

  for (const page of legalPages) {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1, overrideAccess: true })
    if (existing.docs.length > 0) {
      payload.logger.info(`Skipping ${page.slug} page — already exists`)
      continue
    }
    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        hero: { type: 'none' },
        layout: [{
          blockType: 'content',
          columns: [{ size: 'full', richText: page.content }],
        }],
        meta: { title: page.metaTitle, description: page.metaDesc },
        publishedAt: new Date().toISOString(),
        _status: 'published',
      } as any,
      overrideAccess: true,
    })
    payload.logger.info(`Created page: /${page.slug}`)
  }
}
