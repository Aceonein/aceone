import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Aceone',
  description: 'Terms governing your use of Aceone and subscription to The Aceone Brief newsletter.',
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 120px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--ao-t3)', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 48 }}>
        Last updated: 27 June 2026 · Effective: 27 June 2026
      </p>

      <Section title="1. Acceptance">
        <p>By accessing <strong>blog.aceone.in</strong> or subscribing to The Aceone Brief, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
        <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.</p>
      </Section>

      <Section title="2. The Service">
        <p>Aceone operates a financial media platform publishing articles and a weekly newsletter, The Aceone Brief, at <strong>blog.aceone.in</strong>. The service is free to read and subscribe to.</p>
        <p>We reserve the right to modify, suspend, or discontinue the service at any time with reasonable notice to active subscribers.</p>
      </Section>

      <Section title="3. Newsletter Subscription">
        <p>By subscribing to The Aceone Brief:</p>
        <ul>
          <li>You consent to receive a weekly email newsletter from Aceone</li>
          <li>You confirm you are 18 years of age or older</li>
          <li>You confirm the email address provided belongs to you</li>
          <li>You understand you can unsubscribe at any time via the link in any email</li>
        </ul>
        <p>We aim to send one email per week (every Sunday at 12:30 PM IST). We may occasionally send additional emails about significant Aceone updates. We will never send unsolicited commercial emails beyond the scope of your consent.</p>
      </Section>

      <Section title="4. Not Financial Advice">
        <p><strong>All content published by Aceone — including articles, newsletter issues, data boxes, and commentary — is for informational and educational purposes only. It does not constitute financial advice, investment advice, trading advice, or any other form of advice.</strong></p>
        <p>Aceone is not a SEBI-registered investment adviser, research analyst, or portfolio manager. Nothing published should be construed as a recommendation to buy, sell, or hold any security, mutual fund, or financial product.</p>
        <p>Past performance discussed in our content does not guarantee future results. All investments carry risk, including the possible loss of principal. Always consult a qualified, SEBI-registered financial adviser before making investment decisions.</p>
      </Section>

      <Section title="5. Intellectual Property">
        <p>All content on blog.aceone.in — including articles, newsletter issues, data analysis, graphics, and design — is the intellectual property of Aceone and its contributors, protected under the Copyright Act, 1957.</p>
        <p>You may share individual articles with attribution (&quot;Source: Aceone, blog.aceone.in&quot;) and a link to the original. You may not reproduce, republish, or distribute content in bulk, commercially, or without attribution.</p>
        <p>Republishing newsletter issues in full (on third-party newsletters, websites, or social platforms) without written permission is prohibited.</p>
      </Section>

      <Section title="6. User Conduct">
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any unlawful purpose</li>
          <li>Attempt to scrape, crawl, or systematically download content</li>
          <li>Misrepresent Aceone&apos;s content as your own</li>
          <li>Attempt to gain unauthorised access to any part of the platform</li>
          <li>Use our content to generate AI training datasets without written permission</li>
        </ul>
      </Section>

      <Section title="7. Accuracy of Information">
        <p>We make reasonable efforts to ensure the accuracy of information published. However, financial data, regulations, and market conditions change rapidly. Aceone does not warrant that any information is current, complete, or error-free.</p>
        <p>Any reliance you place on information from Aceone is strictly at your own risk.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the fullest extent permitted by applicable law, Aceone shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the service or any content published — including financial losses arising from investment decisions influenced by our content.</p>
      </Section>

      <Section title="9. Third-Party Links">
        <p>Our content may link to third-party websites for reference. These links are provided for convenience only. Aceone does not endorse, control, or take responsibility for the content, privacy practices, or services of any third-party site.</p>
      </Section>

      <Section title="10. Privacy">
        <p>Your use of the service is also governed by our <a href="/privacy-policy">Privacy Policy</a>, which explains how we collect and handle your personal data in compliance with the Digital Personal Data Protection Act 2023.</p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>We may update these terms from time to time. Material changes will be communicated to active subscribers via email at least 14 days before taking effect. Continued use of the service after the effective date constitutes acceptance of the updated terms.</p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about these terms:<br />
          Email: <a href="mailto:hello@aceone.in">hello@aceone.in</a><br />
          Aceone, Mumbai, Maharashtra, India
        </p>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--ao-t1)' }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ao-t2)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  )
}
