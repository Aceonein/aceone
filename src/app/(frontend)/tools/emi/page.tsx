import Link from 'next/link'
import type { Metadata } from 'next'
import { EmiExposer } from '@/components/EmiExposer'

export default function EmiToolPage() {
  return (
    <main className="tl-wrap">

      {/* ── Header ── */}
      <div className="tl-header">
        <div className="tl-inner">
          <nav className="tl-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Tools</span>
            <span>/</span>
            <span aria-current="page">No-Cost EMI</span>
          </nav>
          <div className="tl-badge">
            <div className="tl-badge-dot" />
            Live tool · Free
          </div>
          <h1 className="tl-h1">No-Cost EMI Exposer</h1>
          <p className="tl-sub">
            "Zero interest" EMI is never actually free. The store absorbs the bank's interest —
            but GST on that interest and the processing fee still come out of your pocket.
            Enter any price to see the real numbers.
          </p>
        </div>
      </div>

      {/* ── Calculator ── */}
      <div className="tl-calc-section">
        <div className="tl-inner">
          <div className="tl-calc-card">
            <div className="tl-calc-bar">
              <div className="tl-calc-dots">
                <div className="tl-cdot" style={{ background: '#ef4444' }} />
                <div className="tl-cdot" style={{ background: '#f59e0b' }} />
                <div className="tl-cdot" style={{ background: '#22c55e' }} />
              </div>
              <span className="tl-calc-title">EMI Exposer</span>
              <span className="tl-calc-live">
                <span className="tl-live-dot" />
                Live
              </span>
            </div>
            <EmiExposer />
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="tl-explainer">
        <div className="tl-inner">
          <div className="tl-sec-eyebrow">
            <span className="tl-eyebrow-line" />
            <span>How no-cost EMI actually works</span>
          </div>
          <h2 className="tl-sec-h2">The store pays the bank. But not everything.</h2>

          <div className="tl-cards">
            <div className="tl-card tl-card-green">
              <div className="tl-card-num">01</div>
              <div className="tl-card-title">The merchant discount</div>
              <p className="tl-card-body">
                RBI prohibits 0% interest loans — banks always charge interest, typically 14–16%
                p.a. on a reducing balance. For "no-cost" EMI, the store pays the bank an upfront
                discount equal to the total interest. You pay the MRP in equal parts; the store
                absorbs the interest cost from their margin.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">02</div>
              <div className="tl-card-title">GST on interest — the real leak</div>
              <p className="tl-card-body">
                The merchant discount covers the base bank interest. But 18% GST on that interest
                is charged to you, not the store. On a ₹50,000 purchase at 15% for 12 months,
                that's ~₹760 extra. This GST is the primary hidden cost in most no-cost EMI
                transactions — and almost no one talks about it.
              </p>
            </div>
            <div className="tl-card tl-card-red">
              <div className="tl-card-num">03</div>
              <div className="tl-card-title">Processing fee + GST</div>
              <p className="tl-card-body">
                Banks charge ₹99–₹999 to initiate an EMI plan, plus 18% GST on that fee. On short
                tenures (3 months), this fee can push the effective rate above 20% p.a. Always
                check whether a cash discount is available — sometimes it exceeds the total fee
                + GST cost of the EMI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Worked example ── */}
      <div className="tl-example-section">
        <div className="tl-inner">
          <div className="tl-example">
            <div className="tl-ex-title">
              Worked example — ₹50,000 phone · 12 months · 15% bank rate · ₹299 processing fee
            </div>
            <div className="tl-ex-rows">
              <div className="tl-ex-row">
                <span>Product price</span>
                <span>₹50,000</span>
              </div>
              <div className="tl-ex-row tl-ex-green">
                <span>Bank interest on ₹50,000 at 15% for 12 months (reducing balance)</span>
                <span>≈ ₹4,239 <span className="tl-ex-note">store absorbs</span></span>
              </div>
              <div className="tl-ex-row tl-ex-sub">
                <span>Net principal bank finances (price − interest subsidy)</span>
                <span>₹45,761</span>
              </div>
              <div className="tl-ex-row tl-ex-sub">
                <span>Your monthly EMI (₹50,000 ÷ 12)</span>
                <span>₹4,167/mo</span>
              </div>
              <div className="tl-ex-sep" />
              <div className="tl-ex-row tl-ex-red">
                <span>GST on interest (18% × ₹4,239)</span>
                <span>+₹763 <span className="tl-ex-note">you pay</span></span>
              </div>
              <div className="tl-ex-row tl-ex-red">
                <span>Processing fee + GST (₹299 × 1.18)</span>
                <span>+₹353 <span className="tl-ex-note">you pay</span></span>
              </div>
              <div className="tl-ex-sep" />
              <div className="tl-ex-row tl-ex-total">
                <span>Total extra cost</span>
                <span>₹1,116 · 2.2% above price · ~9.8% p.a.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Decision guide ── */}
      <div className="tl-decision">
        <div className="tl-inner">
          <div className="tl-sec-eyebrow">
            <span className="tl-eyebrow-line" />
            <span>Decision guide</span>
          </div>
          <h2 className="tl-sec-h2">When does no-cost EMI make sense?</h2>
          <div className="tl-dec-cols">
            <div className="tl-dec-col tl-dec-yes">
              <div className="tl-dec-head">Choose no-cost EMI when</div>
              <ul className="tl-dec-list">
                <li>Extra cost is below 3% and you need the cash flow flexibility</li>
                <li>No instant cash or card discount is available — you're not leaving money on the table</li>
                <li>Tenure is 6 months or more — processing fee gets diluted across more months</li>
                <li>You have a no-penalty foreclosure option — pay off early, save on remaining GST</li>
                <li>Effective rate is below 12% p.a. — comparable to a home loan, far below personal loan rates</li>
              </ul>
            </div>
            <div className="tl-dec-col tl-dec-no">
              <div className="tl-dec-head">Pay upfront instead when</div>
              <ul className="tl-dec-list">
                <li>The store offers a cash or card discount — compare it against the EMI's extra cost first</li>
                <li>Tenure is 3 months or less — processing fee becomes disproportionately expensive</li>
                <li>Effective rate exceeds 18% p.a. — a personal loan at 14% is literally cheaper</li>
                <li>You're near your credit utilisation limit — EMIs add to your FOIR and affect loan eligibility</li>
                <li>The purchase is impulsive — spreading it over months makes expensive things feel affordable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── More tools ── */}
      <div className="tl-more-tools">
        <div className="tl-inner">
          <div className="tl-mt-label">More tools</div>
          <div className="tl-mt-grid">
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
  title: 'No-Cost EMI Exposer — Aceone',
  description:
    'See the real cost of "zero interest" EMI. Merchant discount, GST on interest, processing fee, and effective annual rate — all calculated.',
}
