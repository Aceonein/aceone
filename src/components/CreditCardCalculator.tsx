'use client'
import React, { useState } from 'react'

function inr(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

export function CreditCardCalculator() {
  const [fee, setFee]           = useState('')
  const [spend, setSpend]       = useState('')
  const [rewardRate, setRewardRate] = useState('')
  const [feeWaiver, setFeeWaiver]   = useState('')
  const [rewardType, setRewardType] = useState<'cashback' | 'points'>('cashback')
  const [pointsValue, setPointsValue] = useState('0.25') // ₹ per point

  const annualFee  = parseFloat(fee) || 0
  const monthSpend = parseFloat(spend) || 0
  const rr = parseFloat(rewardRate) || 0
  const waiver = parseFloat(feeWaiver) || 0
  const pv = parseFloat(pointsValue) || 0

  const ready = monthSpend >= 1000 && rr > 0

  let result: null | {
    annualSpend: number
    annualRewards: number
    effectiveFee: number
    netBenefit: number
    breakEven: number
    verdict: 'g' | 'a' | 'r'
    verdictLabel: string
  } = null

  if (ready) {
    const annualSpend = monthSpend * 12
    // For points: rr = points per ₹100; value = points × pv
    let annualRewards: number
    if (rewardType === 'cashback') {
      annualRewards = annualSpend * rr / 100
    } else {
      // rr = points per ₹100 spent
      const totalPoints = annualSpend / 100 * rr
      annualRewards = totalPoints * pv
    }

    // Effective fee after waiver (waiver is a spend-target benefit)
    const effectiveFee = monthSpend * 12 >= waiver ? 0 : annualFee
    const netBenefit = annualRewards - effectiveFee

    // Monthly spend needed to break even (if waiver not triggered)
    const breakEven = annualFee > 0 && (rewardType === 'cashback')
      ? annualFee / (rr / 100) / 12
      : 0

    const verdict: 'g' | 'a' | 'r' =
      netBenefit > 500  ? 'g' :
      netBenefit > -500 ? 'a' : 'r'
    const verdictLabel =
      verdict === 'g' ? 'WORTH KEEPING' :
      verdict === 'a' ? 'MARGINAL — REVIEW' :
      'DUMP THIS CARD'

    result = { annualSpend, annualRewards, effectiveFee, netBenefit, breakEven, verdict, verdictLabel }
  }

  return (
    <div className="tc-tool">
      <div className="tc-inputs">
        <div className="tc-field-pair">
          <div className="tc-field">
            <div className="tc-label">Annual fee (excl. GST)</div>
            <div className="tc-row">
              <span className="tc-pfx">₹</span>
              <input type="number" className="tc-inp" placeholder="e.g. 1499"
                inputMode="numeric" value={fee} onChange={e => setFee(e.target.value)} />
            </div>
          </div>
          <div className="tc-field">
            <div className="tc-label">Fee waiver threshold (annual spend)</div>
            <div className="tc-row">
              <span className="tc-pfx">₹</span>
              <input type="number" className="tc-inp" placeholder="e.g. 150000"
                inputMode="numeric" value={feeWaiver} onChange={e => setFeeWaiver(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="tc-field">
          <div className="tc-label">Average monthly spend on this card</div>
          <div className="tc-row">
            <span className="tc-pfx">₹</span>
            <input type="number" className="tc-inp tc-inp-lg" placeholder="e.g. 25000"
              inputMode="numeric" value={spend} onChange={e => setSpend(e.target.value)} />
            <span className="tc-sfx">/mo</span>
          </div>
        </div>

        <div className="tc-field">
          <div className="tc-label">Reward type</div>
          <div className="tc-toggle-row">
            <button type="button" className={`tc-toggle-btn${rewardType === 'cashback' ? ' active' : ''}`}
              onClick={() => setRewardType('cashback')}>Cashback (%)</button>
            <button type="button" className={`tc-toggle-btn${rewardType === 'points' ? ' active' : ''}`}
              onClick={() => setRewardType('points')}>Points</button>
          </div>
        </div>

        {rewardType === 'cashback' ? (
          <div className="tc-field">
            <div className="tc-label">Effective cashback rate</div>
            <div className="tc-row">
              <input type="number" className="tc-inp" placeholder="e.g. 1.5"
                step={0.1} value={rewardRate} onChange={e => setRewardRate(e.target.value)} />
              <span className="tc-sfx">%</span>
            </div>
          </div>
        ) : (
          <div className="tc-field-pair">
            <div className="tc-field">
              <div className="tc-label">Points per ₹100 spent</div>
              <div className="tc-row">
                <input type="number" className="tc-inp" placeholder="e.g. 2"
                  step={0.5} value={rewardRate} onChange={e => setRewardRate(e.target.value)} />
                <span className="tc-sfx">pts</span>
              </div>
            </div>
            <div className="tc-field">
              <div className="tc-label">₹ value per point</div>
              <div className="tc-row">
                <span className="tc-pfx">₹</span>
                <input type="number" className="tc-inp" placeholder="e.g. 0.25"
                  step={0.05} value={pointsValue} onChange={e => setPointsValue(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="tc-divider" />

      {result ? (
        <div className="tc-results">
          <div className="tc-primary-row">
            <div>
              <div className="tc-primary-label">Net annual benefit</div>
              <div className={`tc-primary-val ${result.netBenefit < 0 ? 'tc-val-red' : ''}`}>
                {result.netBenefit >= 0 ? '+' : ''}{inr(result.netBenefit)}
              </div>
            </div>
            <div className={`tc-verdict tc-verdict-${result.verdict}`}>{result.verdictLabel}</div>
          </div>

          <div className="tc-breakdown">
            <div className="tc-br-group-hd">Annual breakdown</div>
            <div className="tc-br-row">
              <span>Annual spend on this card</span>
              <span>{inr(result.annualSpend)}</span>
            </div>
            <div className="tc-br-row tc-br-green">
              <span>Rewards earned</span>
              <span>+{inr(result.annualRewards)}</span>
            </div>
            <div className={`tc-br-row ${result.effectiveFee > 0 ? 'tc-br-red' : 'tc-br-green'}`}>
              <span>Annual fee {result.effectiveFee === 0 ? '(waived — spend threshold met)' : '(charged)'}</span>
              <span>{result.effectiveFee === 0 ? '₹0' : '−' + inr(annualFee)}</span>
            </div>
            <div className={`tc-br-row tc-br-total ${result.netBenefit < 0 ? 'tc-br-red' : ''}`}>
              <span>Net benefit</span>
              <span>{result.netBenefit >= 0 ? '+' : ''}{inr(result.netBenefit)}</span>
            </div>

            {result.breakEven > 0 && result.effectiveFee > 0 && (
              <>
                <div className="tc-br-group-hd">Break-even</div>
                <div className="tc-br-row">
                  <span>Monthly spend needed to cover annual fee</span>
                  <span>{inr(result.breakEven)}/mo</span>
                </div>
              </>
            )}
          </div>

          <div className="tc-disc">
            Reward value is estimated · Points value varies by redemption category · Excludes GST on fee
          </div>
        </div>
      ) : (
        <div className="tc-empty">Enter your card fee and monthly spend to see the true cost</div>
      )}
    </div>
  )
}
