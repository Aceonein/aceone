import Link from 'next/link'
import type { Metadata } from 'next'
import { FoirCalculator } from '@/components/FoirCalculator'

export default function FoirPage() {
  return (
    <main className="tl-wrap">

      <div className="tl-header">
        <div className="tl-inner">
          <nav className="tl-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span>Tools</span><span>/</span>
            <span aria-current="page">FOIR Reality Check</span>
          </nav>
          <div className="tl-badge"><div className="tl-badge-dot" />Live tool · Free</div>
          <h1 className="tl-h1">FOIR Reality Check</h1>
          <p className="tl-sub">
            Your Fixed Obligation to Income Ratio is the number every bank checks before lending you money.
            Enter your salary and all your running EMIs to see exactly where you stand — and how much headroom
            you have before the next loan.
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
              <span className="tl-calc-title">FOIR Checker</span>
              <span className="tl-calc-live"><span className="tl-live-dot" />Live</span>
            </div>
            <FoirCalculator />
          </div>
        </div>
      </div>

      <div className="tl-explainer">
        <div className="tl-inner">
          <div className="tl-sec-eyebrow">
            <span className="tl-eyebrow-line" />
            <span>How banks use your FOIR</span>
          </div>
          <h2 className="tl-sec-h2">FOIR is the single most important number for your loan eligibility.</h2>
          <div className="tl-cards">
            <div className="tl-card tl-card-green">
              <div className="tl-card-num">01</div>
              <div className="tl-card-title">What counts in FOIR</div>
              <p className="tl-card-body">
                All fixed monthly obligations: home loan EMI, car loan EMI, personal loan EMI, and credit
                card minimum payments. Even "no-cost EMIs" count. The numerator is the total of all these;
                the denominator is your net monthly income (gross, before tax, for some banks).
              </p>
            </div>
            <div className="tl-card tl-card-green">
              <div className="tl-card-num">02</div>
              <div className="tl-card-title">The 40% rule</div>
              <p className="tl-card-body">
                Most banks use 40% as the conservative threshold for unsecured loans (personal, education).
                For secured loans (home, car), some lenders stretch to 50% since the asset backs the loan.
                Above 50%, expect rejections — or worse, a loan with punishing terms.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">03</div>
              <div className="tl-card-title">The hidden FOIR trap</div>
              <p className="tl-card-body">
                Credit card minimum payment is only 5% of outstanding balance — but it still counts in
                FOIR. A ₹2L card balance adds ₹10,000 to your monthly obligations. Many people are close
                to the limit without realising it, until their home loan application gets rejected.
              </p>
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
            <Link href="/tools/salary" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">Salary Decoder</div>
              <div className="tl-mt-desc">CTC → what actually lands in your account after all deductions.</div>
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
  title: 'FOIR Reality Check — Aceone',
  description: 'Calculate your Fixed Obligation to Income Ratio. Know your loan eligibility headroom before you apply.',
}
