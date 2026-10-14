'use client'
import React, { useState } from 'react'

function inr(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function irr(principal: number, monthlyPmt: number, n: number, upfrontFee: number): number {
  const netP = principal - upfrontFee
  if (netP <= 0 || monthlyPmt <= 0 || n <= 0) return 0
  let r = 0.01
  for (let i = 0; i < 200; i++) {
    let f = -netP, df = 0
    for (let k = 1; k <= n; k++) {
      const d = Math.pow(1 + r, k)
      f += monthlyPmt / d
      df -= k * monthlyPmt / (d * (1 + r))
    }
    const delta = f / df
    r -= delta
    if (Math.abs(delta) < 1e-10) break
  }
  return r > 0 ? (Math.pow(1 + r, 12) - 1) * 100 : 0
}

function compute(price: number, tenure: number, annualRate: number, processingFee: number) {
  const m = annualRate / 100 / 12
  const n = tenure
  const factor = Math.pow(1 + m, n)
  const stdEmi = m > 0 ? price * m * factor / (factor - 1) : price / n
  const totalInterest = stdEmi * n - price
  const merchantDiscount = totalInterest
  const emi = price / n
  const feeWithGst = processingFee * 1.18
  const gstOnInterest = totalInterest * 0.18
  const totalOutflow = price + feeWithGst + gstOnInterest
  const extraPct = (feeWithGst + gstOnInterest) / price * 100
  const effectiveRate = irr(price, emi + gstOnInterest / n, n, feeWithGst)
  return { emi, stdEmi, merchantDiscount, feeWithGst, gstOnInterest, totalOutflow, extraPct, effectiveRate }
}

const TENURES = [3, 6, 9, 12, 18, 24]

export function EmiExposer() {
  const [price, setPrice] = useState('')
  const [tenure, setTenure] = useState(12)
  const [rate, setRate] = useState('15')
  const [fee, setFee] = useState('299')

  const p = parseFloat(price)
  const r = parseFloat(rate) || 15
  const f = parseInt(fee) || 0
  const result = p >= 1000 ? compute(p, tenure, r, f) : null

  const band = result
    ? result.effectiveRate < 8  ? { label: 'MINIMAL COST',  cls: 'g' }
    : result.effectiveRate < 18 ? { label: 'MODERATE COST', cls: 'a' }
    :                             { label: 'HIGH COST',      cls: 'r' }
    : null

  return (
    <div className="emi-tool">
      <div className="emi-inputs">
        <div className="emi-field">
          <div className="emi-label">Product price</div>
          <div className="emi-row">
            <span className="emi-pfx">₹</span>
            <input
              type="number"
              className="emi-inp emi-inp-lg"
              placeholder="e.g. 79999"
              inputMode="numeric"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="emi-field">
          <div className="emi-label">Tenure</div>
          <div className="emi-tenure-row">
            {TENURES.map(m => (
              <button
                key={m}
                type="button"
                className={`emi-ten-btn${tenure === m ? ' active' : ''}`}
                onClick={() => setTenure(m)}
              >{m} mo</button>
            ))}
          </div>
        </div>

        <div className="emi-field-pair">
          <div className="emi-field">
            <div className="emi-label">Bank interest rate</div>
            <div className="emi-row">
              <input
                type="number"
                className="emi-inp"
                value={rate}
                min={1} max={36} step={0.5}
                onChange={e => setRate(e.target.value)}
              />
              <span className="emi-sfx">% p.a.</span>
            </div>
          </div>
          <div className="emi-field">
            <div className="emi-label">Processing fee (before GST)</div>
            <div className="emi-row">
              <span className="emi-pfx">₹</span>
              <input
                type="number"
                className="emi-inp"
                value={fee}
                min={0} max={2000}
                onChange={e => setFee(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="emi-calc-divider" />

      {result && band ? (
        <div className="emi-results">
          <div className="emi-primary-row">
            <div>
              <div className="emi-primary-label">No-cost EMI / month</div>
              <div className="emi-primary-val">{inr(result.emi)}</div>
            </div>
            <div className={`emi-verdict emi-verdict-${band.cls}`}>{band.label}</div>
          </div>

          <div className="emi-breakdown">
            <div className="emi-br-group-hd">What the store absorbs</div>
            <div className="emi-br-row">
              <span>Standard EMI (bank interest included)</span>
              <span className="emi-muted-val">{inr(result.stdEmi)}/mo</span>
            </div>
            <div className="emi-br-row emi-br-green">
              <span>Merchant discount <span className="emi-br-note">— store pays this to bank upfront</span></span>
              <span>−{inr(result.merchantDiscount)}</span>
            </div>

            <div className="emi-br-group-hd emi-br-group-hd-red">What you actually pay extra</div>
            <div className="emi-br-row emi-br-red">
              <span>GST on bank interest <span className="emi-br-note">— 18% × bank interest, not covered by store</span></span>
              <span>+{inr(result.gstOnInterest)}</span>
            </div>
            <div className="emi-br-row emi-br-red">
              <span>Processing fee + GST <span className="emi-br-note">— one-time, upfront</span></span>
              <span>+{inr(result.feeWithGst)}</span>
            </div>

            <div className="emi-br-group-hd">Totals</div>
            <div className="emi-br-row emi-br-total">
              <span>Total effective outflow</span>
              <span>{inr(result.totalOutflow)}</span>
            </div>
            <div className="emi-br-row emi-br-total">
              <span>Extra cost above product price</span>
              <span>{result.extraPct.toFixed(2)}%</span>
            </div>
            <div className="emi-br-row emi-br-total">
              <span>Effective annual rate (IRR)</span>
              <span>{result.effectiveRate.toFixed(1)}% p.a.</span>
            </div>
          </div>

          <div className="emi-disc-full">
            Estimates use standard reducing-balance method · Bank rates vary · Not financial advice
          </div>
        </div>
      ) : (
        <div className="emi-empty">Enter a price above to see the real cost breakdown</div>
      )}
    </div>
  )
}
