'use client'
import React, { useState } from 'react'

function inr(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}
function pct(n: number, dec = 1) {
  return n.toFixed(dec) + '%'
}

function stdEmi(price: number, annualRate: number, months: number) {
  const m = annualRate / 100 / 12
  if (m === 0) return price / months
  const f = Math.pow(1 + m, months)
  return price * m * f / (f - 1)
}

const TENURES = [3, 6, 9, 12, 18, 24, 36]

export function CanAffordCalculator() {
  const [salary, setSalary]   = useState('')
  const [existing, setExisting] = useState('')
  const [price, setPrice]     = useState('')
  const [tenure, setTenure]   = useState(12)
  const [rate, setRate]       = useState('15')
  const [noInterest, setNoInterest] = useState(true)

  const sal = parseFloat(salary)
  const ex  = parseFloat(existing) || 0
  const pr  = parseFloat(price)
  const r   = parseFloat(rate) || 15

  const ready = sal >= 1000 && pr >= 1000

  let result: null | {
    newEmi: number
    foirBefore: number
    foirAfter: number
    headroom40: number
    verdict: 'comfortable' | 'stretch' | 'risk'
  } = null

  if (ready) {
    const newEmi = noInterest ? pr / tenure : stdEmi(pr, r, tenure)
    const foirBefore = ex / sal * 100
    const foirAfter  = (ex + newEmi) / sal * 100
    const headroom40 = Math.max(0, sal * 0.4 - ex - newEmi)
    const verdict =
      foirAfter < 40 ? 'comfortable' :
      foirAfter < 50 ? 'stretch' : 'risk'
    result = { newEmi, foirBefore, foirAfter, headroom40, verdict }
  }

  const bandCls = result
    ? result.verdict === 'comfortable' ? 'g'
    : result.verdict === 'stretch'     ? 'a'
    : 'r'
    : null

  const bandLabel = result
    ? result.verdict === 'comfortable' ? 'LOOKS GOOD'
    : result.verdict === 'stretch'     ? 'TIGHT — CHECK TWICE'
    : 'DON\'T DO IT'
    : null

  return (
    <div className="tc-tool">
      <div className="tc-inputs">
        <div className="tc-field">
          <div className="tc-label">Monthly take-home salary</div>
          <div className="tc-row">
            <span className="tc-pfx">₹</span>
            <input type="number" className="tc-inp tc-inp-lg" placeholder="e.g. 80000"
              inputMode="numeric" value={salary} onChange={e => setSalary(e.target.value)} />
            <span className="tc-sfx">/mo</span>
          </div>
        </div>

        <div className="tc-field">
          <div className="tc-label">Existing EMIs (total per month)</div>
          <div className="tc-row">
            <span className="tc-pfx">₹</span>
            <input type="number" className="tc-inp tc-inp-lg" placeholder="e.g. 12000"
              inputMode="numeric" value={existing} onChange={e => setExisting(e.target.value)} />
            <span className="tc-sfx">/mo</span>
          </div>
        </div>

        <div className="tc-field-pair">
          <div className="tc-field">
            <div className="tc-label">Product price</div>
            <div className="tc-row">
              <span className="tc-pfx">₹</span>
              <input type="number" className="tc-inp" placeholder="e.g. 79999"
                inputMode="numeric" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>
          <div className="tc-field">
            <div className="tc-label">Tenure</div>
            <div className="tc-tenure-row">
              {TENURES.map(m => (
                <button key={m} type="button"
                  className={`tc-ten-btn${tenure === m ? ' active' : ''}`}
                  onClick={() => setTenure(m)}
                >{m}mo</button>
              ))}
            </div>
          </div>
        </div>

        <div className="tc-field">
          <div className="tc-label">EMI type</div>
          <div className="tc-toggle-row">
            <button type="button"
              className={`tc-toggle-btn${noInterest ? ' active' : ''}`}
              onClick={() => setNoInterest(true)}>No-cost EMI (price ÷ months)</button>
            <button type="button"
              className={`tc-toggle-btn${!noInterest ? ' active' : ''}`}
              onClick={() => setNoInterest(false)}>Standard EMI</button>
          </div>
          {!noInterest && (
            <div className="tc-row" style={{ marginTop: 8 }}>
              <input type="number" className="tc-inp" value={rate} min={1} max={36} step={0.5}
                onChange={e => setRate(e.target.value)} />
              <span className="tc-sfx">% p.a.</span>
            </div>
          )}
        </div>
      </div>

      <div className="tc-divider" />

      {result && bandCls && bandLabel ? (
        <div className="tc-results">
          <div className="tc-primary-row">
            <div>
              <div className="tc-primary-label">New EMI / month</div>
              <div className="tc-primary-val">{inr(result.newEmi)}</div>
            </div>
            <div className={`tc-verdict tc-verdict-${bandCls}`}>{bandLabel}</div>
          </div>

          <div className="tc-breakdown">
            <div className="tc-br-group-hd">Your FOIR picture</div>

            <div className="tc-br-row">
              <span>FOIR before this purchase</span>
              <span className={result.foirBefore < 40 ? 'tc-br-green' : result.foirBefore < 50 ? 'tc-br-amber' : 'tc-br-red'}>
                {pct(result.foirBefore)}
              </span>
            </div>
            <div className="tc-br-row tc-br-total">
              <span>FOIR after this EMI</span>
              <span className={bandCls === 'g' ? 'tc-br-green' : bandCls === 'a' ? 'tc-br-amber' : 'tc-br-red'}>
                {pct(result.foirAfter)}
              </span>
            </div>

            <div className="tc-br-group-hd">What banks see</div>
            <div className="tc-br-row">
              <span>Bank approval threshold (conservative)</span>
              <span>40% FOIR</span>
            </div>
            <div className="tc-br-row">
              <span>Bank approval threshold (aggressive)</span>
              <span>50% FOIR</span>
            </div>
            {result.headroom40 > 0 && (
              <div className="tc-br-row tc-br-green">
                <span>EMI headroom before hitting 40% FOIR</span>
                <span>{inr(result.headroom40)}/mo</span>
              </div>
            )}
            {result.headroom40 <= 0 && (
              <div className="tc-br-row tc-br-red">
                <span>Already above 40% FOIR — new loans will be hard to get</span>
                <span>—</span>
              </div>
            )}
          </div>

          <div className="tc-disc">
            FOIR = Fixed Obligation to Income Ratio · Estimates only · Lender policies vary
          </div>
        </div>
      ) : (
        <div className="tc-empty">Enter your salary and the product price to see your FOIR</div>
      )}
    </div>
  )
}
