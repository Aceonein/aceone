'use client'
import React, { useState } from 'react'

function inr(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

// New tax regime slabs FY 2025-26
function calcTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  // Rebate u/s 87A: if taxable ≤ 12L, tax = 0 (FY25-26 Budget update)
  let tax = 0
  const slabs = [
    [400000, 0],       // 0–4L: nil
    [400000, 0.05],    // 4–8L: 5%
    [200000, 0.10],    // 8–10L: 10%
    [200000, 0.15],    // 10–12L: 15%
    [300000, 0.20],    // 12–15L: 20%
    [Infinity, 0.30],  // >15L: 30%
  ] as const
  let rem = taxableIncome
  for (const [band, rate] of slabs) {
    if (rem <= 0) break
    const chunk = Math.min(rem, band)
    tax += chunk * rate
    rem -= chunk
  }
  // 87A rebate: if taxable ≤ 12,00,000 net tax = 0
  if (taxableIncome <= 1200000) tax = 0
  // 4% cess
  return tax * 1.04
}

export function SalaryDecoder() {
  const [ctc, setCtc] = useState('')
  const [metro, setMetro] = useState(true)

  const annualCtc = parseFloat(ctc) || 0
  const ready = annualCtc >= 100000

  let result: null | {
    grossMonthly: number
    basic: number
    hra: number
    special: number
    pfEmployee: number
    pfEmployer: number
    gratuity: number
    profTax: number
    tdsMonthly: number
    takeHome: number
    effectivePct: number
  } = null

  if (ready) {
    const grossMonthly = annualCtc / 12
    const basicAnnual  = annualCtc * 0.40
    const basic        = basicAnnual / 12
    const hraRate      = metro ? 0.50 : 0.40
    const hra          = basic * hraRate
    // PF on basic capped at ₹15,000 (12% = ₹1,800/mo)
    const pfBase       = Math.min(basic, 15000)
    const pfEmployee   = pfBase * 0.12
    const pfEmployer   = pfBase * 0.12  // part of CTC
    const gratuityMo   = basic * 0.0481 // 4.81% of basic, in CTC
    // Components in CTC: basic + hra + special + pf_employer + gratuity
    const special = grossMonthly - basic - hra - pfEmployer - gratuityMo
    const profTax  = 200

    // TDS: annual taxable = gross - std deduction - pf_employee annual
    const annualGross      = annualCtc - pfEmployer * 12 - gratuityMo * 12
    const stdDeduction     = 75000
    const taxableIncome    = Math.max(0, annualGross - stdDeduction - pfEmployee * 12)
    const annualTax        = calcTax(taxableIncome)
    const tdsMonthly       = annualTax / 12

    const takeHome = grossMonthly - pfEmployee - profTax - tdsMonthly
    const effectivePct = (takeHome / grossMonthly) * 100

    result = { grossMonthly, basic, hra, special, pfEmployee, pfEmployer, gratuity: gratuityMo, profTax, tdsMonthly, takeHome, effectivePct }
  }

  return (
    <div className="tc-tool">
      <div className="tc-inputs">
        <div className="tc-field">
          <div className="tc-label">Annual CTC (Cost to Company)</div>
          <div className="tc-row">
            <span className="tc-pfx">₹</span>
            <input type="number" className="tc-inp tc-inp-lg" placeholder="e.g. 1200000"
              inputMode="numeric" value={ctc} onChange={e => setCtc(e.target.value)} />
            <span className="tc-sfx">/yr</span>
          </div>
        </div>
        <div className="tc-field">
          <div className="tc-label">City tier (affects HRA)</div>
          <div className="tc-toggle-row">
            <button type="button" className={`tc-toggle-btn${metro ? ' active' : ''}`}
              onClick={() => setMetro(true)}>Metro (50% HRA)</button>
            <button type="button" className={`tc-toggle-btn${!metro ? ' active' : ''}`}
              onClick={() => setMetro(false)}>Non-metro (40% HRA)</button>
          </div>
        </div>
      </div>

      <div className="tc-divider" />

      {result ? (
        <div className="tc-results">
          <div className="tc-primary-row">
            <div>
              <div className="tc-primary-label">Monthly take-home</div>
              <div className="tc-primary-val">{inr(result.takeHome)}</div>
            </div>
            <div className="tc-verdict tc-verdict-g">
              {result.effectivePct.toFixed(0)}% OF CTC
            </div>
          </div>

          <div className="tc-breakdown">
            <div className="tc-br-group-hd">What's in your CTC (monthly)</div>
            <div className="tc-br-row">
              <span>Gross monthly (CTC ÷ 12)</span>
              <span>{inr(result.grossMonthly)}</span>
            </div>
            <div className="tc-br-row tc-br-sub">
              <span>Basic salary (40% of CTC)</span>
              <span>{inr(result.basic)}</span>
            </div>
            <div className="tc-br-row tc-br-sub">
              <span>HRA ({metro ? '50' : '40'}% of basic)</span>
              <span>{inr(result.hra)}</span>
            </div>
            {result.special > 0 && (
              <div className="tc-br-row tc-br-sub">
                <span>Special allowance (residual)</span>
                <span>{inr(result.special)}</span>
              </div>
            )}
            <div className="tc-br-row tc-br-sub">
              <span>PF (employer) <span className="tc-br-note">— in CTC, not in your hand</span></span>
              <span>{inr(result.pfEmployer)}</span>
            </div>
            <div className="tc-br-row tc-br-sub">
              <span>Gratuity <span className="tc-br-note">— in CTC, paid on exit after 5yr</span></span>
              <span>{inr(result.gratuity)}</span>
            </div>

            <div className="tc-br-group-hd tc-br-group-hd-red">Deductions from in-hand</div>
            <div className="tc-br-row tc-br-red">
              <span>PF employee (12% of basic, max ₹1,800)</span>
              <span>−{inr(result.pfEmployee)}</span>
            </div>
            <div className="tc-br-row tc-br-red">
              <span>Professional tax</span>
              <span>−{inr(result.profTax)}</span>
            </div>
            <div className="tc-br-row tc-br-red">
              <span>TDS / income tax (new regime, no investments)</span>
              <span>−{inr(result.tdsMonthly)}</span>
            </div>

            <div className="tc-br-group-hd">Net in-hand</div>
            <div className="tc-br-row tc-br-total">
              <span>Monthly take-home</span>
              <span>{inr(result.takeHome)}</span>
            </div>
          </div>

          <div className="tc-disc">
            Assumes new tax regime · Standard deduction ₹75,000 · Basic = 40% of CTC · HRA not claimed as exemption (uses standard deduction route) · Actual deductions vary by employer and investments declared
          </div>
        </div>
      ) : (
        <div className="tc-empty">Enter your CTC to decode what you actually take home</div>
      )}
    </div>
  )
}
