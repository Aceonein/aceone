import Link from 'next/link'
import type { Metadata } from 'next'
import { SalaryDecoder } from '@/components/SalaryDecoder'

export default function SalaryPage() {
  return (
    <main className="tl-wrap">

      <div className="tl-header">
        <div className="tl-inner">
          <nav className="tl-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span>Tools</span><span>/</span>
            <span aria-current="page">Salary Decoder</span>
          </nav>
          <div className="tl-badge"><div className="tl-badge-dot" />Live tool · Free</div>
          <h1 className="tl-h1">Salary Decoder</h1>
          <p className="tl-sub">
            CTC is what your company pays. Take-home is what you live on. The gap between them — PF,
            gratuity, professional tax, TDS — is what nobody explains at the offer stage. Enter your
            CTC to see the real number.
          </p>
        </div>
      </div>

      <div className="tl-calc-section">
        <div className="tl-inner">
          <div className="tl-calc-card">
            <div className="tl-calc-bar">
              <div className="tl-calc-dots">
                <div className="tl-cdot" style={{ background: '#ef4444' }} />
                <div className="tl-cdot" style={{ background: '#f59e0b' }} />
                <div className="tl-cdot" style={{ background: '#22c55e' }} />
              </div>
              <span className="tl-calc-title">Salary Decoder</span>
              <span className="tl-calc-live"><span className="tl-live-dot" />Live</span>
            </div>
            <SalaryDecoder />
          </div>
        </div>
      </div>

      <div className="tl-explainer">
        <div className="tl-inner">
          <div className="tl-sec-eyebrow">
            <span className="tl-eyebrow-line" />
            <span>What's eating your salary</span>
          </div>
          <h2 className="tl-sec-h2">You agreed to ₹12L. Here's what actually arrives.</h2>
          <div className="tl-cards">
            <div className="tl-card tl-card-green">
              <div className="tl-card-num">01</div>
              <div className="tl-card-title">PF is your money, but not now</div>
              <p className="tl-card-body">
                12% of your basic salary goes to Provident Fund — employer and employee both contribute.
                The employer's share is usually inside your CTC. Both amounts sit in EPFO until you
                resign or retire. Legally yours, but illiquid. Basic is typically 40–50% of CTC,
                so PF is effectively 5–6% of your total package, locked away.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">02</div>
              <div className="tl-card-title">Gratuity — 5 years to earn it</div>
              <p className="tl-card-body">
                4.81% of basic is set aside as gratuity — but you receive it only after completing 5
                continuous years at the company. Leave before that and you get nothing. It's in your
                CTC, shrinks your take-home, and vanishes if you job-hop. Many people in their 20s
                lose this entirely without realising.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">03</div>
              <div className="tl-card-title">TDS — the biggest variable</div>
              <p className="tl-card-body">
                Income tax (TDS) is deducted monthly and varies based on which regime you choose, your
                declared investments, and HRA exemption. Declaring ₹1.5L in 80C + home loan interest
                can make a meaningful difference. This tool uses the new tax regime with no investment
                declarations — declare investments to reduce TDS.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tl-example-section">
        <div className="tl-inner">
          <div className="tl-example">
            <div className="tl-ex-title">
              Worked example — ₹12,00,000 CTC · Metro · New tax regime · No investments declared
            </div>
            <div className="tl-ex-rows">
              <div className="tl-ex-row">
                <span>Annual CTC</span><span>₹12,00,000</span>
              </div>
              <div className="tl-ex-row tl-ex-sub">
                <span>Gross monthly (CTC ÷ 12)</span><span>₹1,00,000</span>
              </div>
              <div className="tl-ex-sep" />
              <div className="tl-ex-row tl-ex-green">
                <span>Basic (40%)</span><span>₹40,000 <span className="tl-ex-note">in hand</span></span>
              </div>
              <div className="tl-ex-row tl-ex-green">
                <span>HRA (50% of basic)</span><span>₹20,000 <span className="tl-ex-note">in hand</span></span>
              </div>
              <div className="tl-ex-row tl-ex-green">
                <span>Special allowance (residual)</span><span>₹25,760 <span className="tl-ex-note">in hand</span></span>
              </div>
              <div className="tl-ex-row tl-ex-sub">
                <span>PF employer (12% of basic, in CTC)</span><span>₹4,800 <span className="tl-ex-note">not in hand</span></span>
              </div>
              <div className="tl-ex-row tl-ex-sub">
                <span>Gratuity (4.81% of basic, in CTC)</span><span>₹1,924 <span className="tl-ex-note">not in hand</span></span>
              </div>
              <div className="tl-ex-sep" />
              <div className="tl-ex-row tl-ex-red">
                <span>PF employee deduction (12% of basic)</span><span>−₹4,800 <span className="tl-ex-note">you pay</span></span>
              </div>
              <div className="tl-ex-row tl-ex-red">
                <span>Professional tax</span><span>−₹200 <span className="tl-ex-note">you pay</span></span>
              </div>
              <div className="tl-ex-row tl-ex-red">
                <span>TDS (new regime, no investments)</span><span>−₹0 <span className="tl-ex-note">87A rebate applies ≤₹12L</span></span>
              </div>
              <div className="tl-ex-sep" />
              <div className="tl-ex-row tl-ex-total">
                <span>Monthly take-home</span><span>₹80,760 · 80.8% of gross</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tl-more-tools">
        <div className="tl-inner">
          <div className="tl-mt-label">More tools</div>
          <div className="tl-mt-grid">
            <Link href="/tools/emi" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">No-Cost EMI Exposer</div>
              <div className="tl-mt-desc">See the real cost of "0% interest" EMI before you tap Confirm.</div>
            </Link>
            <Link href="/tools/can-afford" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">Can You Afford It?</div>
              <div className="tl-mt-desc">Salary + existing EMIs + price → honest yes, stretch, or no.</div>
            </Link>
            <Link href="/tools/foir" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">FOIR Reality Check</div>
              <div className="tl-mt-desc">Know your borrowing headroom before your bank does.</div>
            </Link>
            <Link href="/tools/credit-card" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">Credit Card True Cost</div>
              <div className="tl-mt-desc">Annual fee vs actual rewards earned. Is your card worth keeping?</div>
            </Link>
          </div>
          <Link href="/#newsletter" className="tl-mt-cta">Get notified when new tools launch →</Link>
        </div>
      </div>

    </main>
  )
}

export const metadata: Metadata = {
  title: 'Salary Decoder — Aceone',
  description: 'Enter your CTC to see the exact monthly take-home after PF, gratuity, professional tax, and TDS.',
}
