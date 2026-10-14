import Link from 'next/link'
import type { Metadata } from 'next'
import { CanAffordCalculator } from '@/components/CanAffordCalculator'

export default function CanAffordPage() {
  return (
    <main className="tl-wrap">

      <div className="tl-header">
        <div className="tl-inner">
          <nav className="tl-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <span>Tools</span><span>/</span>
            <span aria-current="page">Can You Afford It?</span>
          </nav>
          <div className="tl-badge"><div className="tl-badge-dot" />Live tool · Free</div>
          <h1 className="tl-h1">Can You Afford It?</h1>
          <p className="tl-sub">
            Banks look at your FOIR — Fixed Obligation to Income Ratio — before approving any loan.
            Enter your salary and existing EMIs to see if adding one more pushes you into the danger zone.
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
              <span className="tl-calc-title">Affordability Check</span>
              <span className="tl-calc-live"><span className="tl-live-dot" />Live</span>
            </div>
            <CanAffordCalculator />
          </div>
        </div>
      </div>

      <div className="tl-explainer">
        <div className="tl-inner">
          <div className="tl-sec-eyebrow">
            <span className="tl-eyebrow-line" />
            <span>What is FOIR and why does it matter?</span>
          </div>
          <h2 className="tl-sec-h2">Banks don't care what you earn. They care about what's left.</h2>
          <div className="tl-cards">
            <div className="tl-card tl-card-green">
              <div className="tl-card-num">01</div>
              <div className="tl-card-title">FOIR under 40% — the safe zone</div>
              <p className="tl-card-body">
                Most banks approve loans comfortably when your total EMIs (including the new one) stay
                below 40% of your net monthly salary. At this level, you have real financial headroom
                for emergencies, savings, and lifestyle.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">02</div>
              <div className="tl-card-title">40–50% — the stretch zone</div>
              <p className="tl-card-body">
                Banks may still approve, especially for secured loans (home, car) or high-income
                applicants. But you're stretched. One job change or medical bill can make repayments
                painful. If you're here, avoid adding any more obligations.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">03</div>
              <div className="tl-card-title">Above 50% — rejection territory</div>
              <p className="tl-card-body">
                Most banks will reject loan applications when FOIR exceeds 50%. Even if approved,
                the terms will be worse. No-cost EMI on a gadget here isn't just expensive — it's
                actively harming your future borrowing capacity for things that matter.
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
  title: 'Can You Afford It? — Aceone',
  description: 'Check your FOIR before taking on a new EMI. See if your salary supports the purchase without risking your loan eligibility.',
}
