'use client'
import React, { useState } from 'react'

function inr(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function irr(p: number, pmt: number, n: number): number {
  if (p <= 0 || pmt <= 0) return 0
  let r = 0.01
  for (let i = 0; i < 200; i++) {
    let f = -p, df = 0
    for (let k = 1; k <= n; k++) {
      const d = Math.pow(1 + r, k)
      f += pmt / d
      df -= (k * pmt) / (d * (1 + r))
    }
    const delta = f / df
    r -= delta
    if (Math.abs(delta) < 1e-10) break
  }
  return r > 0 ? (Math.pow(1 + r, 12) - 1) * 100 : 0
}

type Result = { band: string; bandCls: string; summ: string; emi: string; hide: string; rate: string }

export function EmiCalculator() {
  const [price, setPrice] = useState('')
  const [tenure, setTenure] = useState(6)
  const [result, setResult] = useState<Result | null>(null)

  function calc(p: string, t: number) {
    const v = parseFloat(p)
    if (!v || v < 1000) { setResult(null); return }
    const fee = Math.min(Math.max(299, v * 0.005), 999)
    const hidden = fee + fee * 0.18 + v * 0.03
    const cash = v / 1.03
    const emi = v / t
    const rate = irr(cash, emi, t)
    let band: string, bandCls: string, summ: string
    if (rate < 6) {
      band = 'MINIMAL COST'; bandCls = 'hp-v-band-g'
      summ = 'Low effective rate. Acceptable if you need the cash flow.'
    } else if (rate < 18) {
      band = 'MODERATE COST'; bandCls = 'hp-v-band-a'
      summ = `${rate.toFixed(1)}% p.a. — check for a cash discount first.`
    } else {
      band = 'HIGH COST'; bandCls = 'hp-v-band-r'
      summ = `${rate.toFixed(1)}% p.a. — more expensive than most personal loans.`
    }
    setResult({ band, bandCls, summ, emi: inr(emi) + '/mo', hide: inr(hidden), rate: rate.toFixed(1) + '% p.a.' })
  }

  return (
    <div className="hp-htc-body">
      <div className="hp-htc-label">Enter product price</div>
      <div className="hp-htc-row">
        <div className="hp-htc-pfx-wrap">
          <span className="hp-htc-pfx">₹</span>
          <input
            type="number"
            className="hp-htc-input"
            placeholder="e.g. 79999"
            inputMode="numeric"
            value={price}
            onChange={e => { setPrice(e.target.value); calc(e.target.value, tenure) }}
          />
        </div>
        <select
          className="hp-htc-sel"
          value={tenure}
          onChange={e => { const t = parseInt(e.target.value); setTenure(t); calc(price, t) }}
        >
          {[3, 6, 9, 12, 18, 24].map(m => (
            <option key={m} value={m}>{m} mo</option>
          ))}
        </select>
      </div>
      {result && (
        <div className="hp-verdict show">
          <div className={`hp-v-band ${result.bandCls}`}>{result.band}</div>
          <div className="hp-v-summ">{result.summ}</div>
          <div className="hp-v-stats">
            <div className="hp-vs"><span className="hp-vsl">EMI/month</span><span className="hp-vsv">{result.emi}</span></div>
            <div className="hp-vs"><span className="hp-vsl">Hidden cost</span><span className="hp-vsv">{result.hide}</span></div>
            <div className="hp-vs"><span className="hp-vsl">Effective rate</span><span className="hp-vsv">{result.rate}</span></div>
          </div>
        </div>
      )}
      <div className="hp-disc">Estimates based on typical fee structures · Not financial advice</div>
    </div>
  )
}
