import Link from 'next/link'
import type { Metadata } from 'next'
import { CreditCardCalculator } from '@/components/CreditCardCalculator'

export default function CreditCardPage() {
  return (
    <main className="tl-wrap">

      <div className="tl-header">
        <div className="tl-inner">
          <nav className="tl-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span>Tools</span><span>/</span>
            <span aria-current="page">Credit Card True Cost</span>
          </nav>
          <div className="tl-badge"><div className="tl-badge-dot" />Live tool · Free</div>
          <h1 className="tl-h1">Credit Card True Cost</h1>
          <p className="tl-sub">
            Annual fee vs actual rewards earned. Most premium cards look great in the brochure — but if
            your spending doesn't match the card's reward categories, you're paying for benefits you
            never use. Enter your fee and real monthly spend to find out.
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
              <span className="tl-calc-title">Card Value Check</span>
              <span className="tl-calc-live"><span className="tl-live-dot" />Live</span>
            </div>
            <CreditCardCalculator />
          </div>
        </div>
      </div>

      <div className="tl-explainer">
        <div className="tl-inner">
          <div className="tl-sec-eyebrow">
            <span className="tl-eyebrow-line" />
            <span>Why most premium cards disappoint</span>
          </div>
          <h2 className="tl-sec-h2">Reward rate in the ad. Actual earned rate in your statement.</h2>
          <div className="tl-cards">
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">01</div>
              <div className="tl-card-title">The category trap</div>
              <p className="tl-card-body">
                Most cards advertise high reward rates (5%, 10%, even 20%) — but only on specific
                categories: dining, travel, fuel. Your grocery and utility spend might earn 0.5%. Effective
                reward rate = weighted average across your actual spend categories, not the headline rate.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">02</div>
              <div className="tl-card-title">Points expiry — the silent destroyer</div>
              <p className="tl-card-body">
                Reward points typically expire in 2–3 years, or when you close the card. Many people
                accumulate points they never redeem, making the effective value ₹0. Points redeemed for
                flights or hotel rooms often yield ₹0.25–₹0.35 per point; cash redemption is often
                less. Build your math on conservative estimates.
              </p>
            </div>
            <div className="tl-card tl-card-green">
              <div className="tl-card-num">03</div>
              <div className="tl-card-title">When premium cards win</div>
              <p className="tl-card-body">
                A ₹5,000 fee card pays off if you travel twice a year (lounge access alone = ₹4,000+),
                use the card for high-reward categories, and hit the fee waiver threshold. The math works
                for high spenders with matching lifestyle. For everyone else, a ₹500 fee card with
                consistent 1.5% cashback often wins.
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
            <Link href="/tools/foir" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">FOIR Reality Check</div>
              <div className="tl-mt-desc">Know your borrowing headroom before your bank does.</div>
            </Link>
            <Link href="/tools/salary" className="tl-mt-card tl-mt-card-link">
              <span className="tl-mt-badge tl-mt-badge-live">● Live</span>
              <div className="tl-mt-name">Salary Decoder</div>
              <div className="tl-mt-desc">CTC → what actually lands in your account after all deductions.</div>
            </Link>
          </div>
          <Link href="/#newsletter" className="tl-mt-cta">Get notified when new tools launch →</Link>
        </div>
      </div>

    </main>
  )
}

export const metadata: Metadata = {
  title: 'Credit Card True Cost — Aceone',
  description: 'Annual fee vs actual rewards earned. Find out if your credit card is worth keeping based on what you actually spend.',
}
