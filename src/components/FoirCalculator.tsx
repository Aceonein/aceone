'use client'
import React, { useState } from 'react'

function inr(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}
function pct(n: number, dec = 1) {
  return n.toFixed(dec) + '%'
}

const EMI_FIELDS = [
  { key: 'home',     label: 'Home loan EMI' },
  { key: 'car',      label: 'Car loan EMI' },
  { key: 'personal', label: 'Personal loan EMI' },
  { key: 'cc',       label: 'Credit card minimum payment' },
  { key: 'other',    label: 'Other EMIs' },
] as const

type EmiKey = typeof EMI_FIELDS[number]['key']

export function FoirCalculator() {
  const [salary, setSalary] = useState('')
  const [emis, setEmis] = useState<Record<EmiKey, string>>({
    home: '', car: '', personal: '', cc: '', other: ''
  })

  const sal = parseFloat(salary)
  const totalEmis = Object.values(emis).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const ready = sal >= 1000

  let result: null | {
    foir: number
    headroom40: number
    headroom50: number
    approxMaxLoan40: number
    approxMaxLoan50: number
    grade: 'g' | 'a' | 'r'
    gradeLabel: string
  } = null

  if (ready) {
    const foir = totalEmis / sal * 100
    const headroom40 = Math.max(0, sal * 0.4 - totalEmis)
    const headroom50 = Math.max(0, sal * 0.5 - totalEmis)
    // approx home loan at 8.5% for 20y
    const approxMaxLoan40 = headroom40 > 0 ? Math.round(headroom40 / 0.00868) : 0
    const approxMaxLoan50 = headroom50 > 0 ? Math.round(headroom50 / 0.00868) : 0
    const grade: 'g' | 'a' | 'r' =
      foir < 30 ? 'g' : foir < 45 ? 'a' : 'r'
    const gradeLabel =
      foir < 30 ? 'STRONG PROFILE' :
      foir < 45 ? 'MODERATE — MANAGEABLE' :
      'HIGH RISK — BANKS MAY REJECT'
    result = { foir, headroom40, headroom50, approxMaxLoan40, approxMaxLoan50, grade, gradeLabel }
  }

  return (
    <div className="tc-tool">
      <div className="tc-inputs">
        <div className="tc-field">
          <div className="tc-label">Monthly net salary (take-home)</div>
          <div className="tc-row">
            <span className="tc-pfx">₹</span>
            <input type="number" className="tc-inp tc-inp-lg" placeholder="e.g. 80000"
              inputMode="numeric" value={salary} onChange={e => setSalary(e.target.value)} />
            <span className="tc-sfx">/mo</span>
          </div>
        </div>

        <div className="tc-field">
          <div className="tc-label">Monthly EMIs — enter only what applies</div>
          <div className="tc-emi-grid">
            {EMI_FIELDS.map(f => (
              <div key={f.key} className="tc-emi-row">
                <div className="tc-emi-name">{f.label}</div>
                <div className="tc-row tc-row-sm">
                  <span className="tc-pfx">₹</span>
                  <input type="number" className="tc-inp" placeholder="0"
                    inputMode="numeric"
                    value={emis[f.key]}
                    onChange={e => setEmis(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalEmis > 0 && (
          <div className="tc-field">
            <div className="tc-label">Total EMIs entered</div>
            <div className="tc-summary-val">{inr(totalEmis)}/mo</div>
          </div>
        )}
      </div>

      <div className="tc-divider" />

      {result ? (
        <div className="tc-results">
          <div className="tc-primary-row">
            <div>
              <div className="tc-primary-label">Your current FOIR</div>
              <div className="tc-primary-val">{pct(result.foir)}</div>
            </div>
            <div className={`tc-verdict tc-verdict-${result.grade}`}>{result.gradeLabel}</div>
          </div>

          <div className="tc-breakdown">
            <div className="tc-br-group-hd">Bank thresholds</div>
            <div className="tc-br-row">
              <span>Conservative approval limit (most banks)</span>
              <span>40% FOIR</span>
            </div>
            <div className="tc-br-row">
              <span>Aggressive approval limit (some banks)</span>
              <span>50% FOIR</span>
            </div>

            <div className="tc-br-group-hd">Your headroom</div>
            <div className={`tc-br-row ${result.headroom40 > 0 ? 'tc-br-green' : 'tc-br-red'}`}>
              <span>Additional EMI capacity before 40% limit</span>
              <span>{result.headroom40 > 0 ? inr(result.headroom40) + '/mo' : 'Over limit'}</span>
            </div>
            <div className={`tc-br-row ${result.headroom50 > 0 ? 'tc-br-amber' : 'tc-br-red'}`}>
              <span>Additional EMI capacity before 50% limit</span>
              <span>{result.headroom50 > 0 ? inr(result.headroom50) + '/mo' : 'Over limit'}</span>
            </div>

            {result.approxMaxLoan40 > 0 && (
              <>
                <div className="tc-br-group-hd">Approximate loan eligibility (at 8.5% p.a. / 20yr)</div>
                <div className="tc-br-row tc-br-green">
                  <span>Max home loan at 40% FOIR</span>
                  <span>{inr(result.approxMaxLoan40)}</span>
                </div>
                {result.approxMaxLoan50 > result.approxMaxLoan40 && (
                  <div className="tc-br-row tc-br-amber">
                    <span>Max home loan at 50% FOIR</span>
                    <span>{inr(result.approxMaxLoan50)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="tc-disc">
            FOIR = Fixed Obligation to Income Ratio · Loan eligibility is indicative only · Bank policies vary
          </div>
        </div>
      ) : (
        <div className="tc-empty">Enter your salary to check your FOIR</div>
      )}
    </div>
  )
}
