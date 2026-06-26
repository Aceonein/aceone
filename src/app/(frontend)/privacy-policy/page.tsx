import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Aceone',
  description: 'How Aceone collects, uses, and protects your personal data under the Digital Personal Data Protection Act, 2023.',
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 120px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--ao-t3)', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 48 }}>
        Last updated: 27 June 2026 · Effective: 27 June 2026
      </p>

      <Section title="1. Who We Are">
        <p>Aceone (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the website at <strong>blog.aceone.in</strong> and the newsletter &quot;The Aceone Brief&quot;. We are an independent financial media platform based in Mumbai, India.</p>
        <p>For data-related queries, contact us at: <a href="mailto:hello@aceone.in">hello@aceone.in</a></p>
      </Section>

      <Section title="2. Data We Collect">
        <p>We collect only what is necessary to deliver the newsletter and improve the platform:</p>
        <ul>
          <li><strong>Email address</strong> — to send The Aceone Brief</li>
          <li><strong>IP address</strong> — captured at signup for DPDP audit trail purposes only; not used for tracking</li>
          <li><strong>Browser/device metadata</strong> (user agent, referrer) — to understand how subscribers find us</li>
          <li><strong>Consent records</strong> — timestamps and scope of consent given at signup</li>
        </ul>
        <p>We do not collect your name, phone number, payment details, or any government-issued ID.</p>
      </Section>

      <Section title="3. How We Use Your Data">
        <p>Your data is used solely for the purposes you consented to:</p>
        <ul>
          <li>Sending The Aceone Brief to your email address (newsletter consent)</li>
          <li>Sending occasional product updates about Aceone (marketing consent, only if opted in)</li>
          <li>Maintaining an audit trail of consent records as required by the DPDP Act 2023</li>
          <li>Analysing aggregate (non-identifiable) readership trends to improve content</li>
        </ul>
        <p>We do not sell your data, share it with advertisers, or use it for automated decision-making that affects you.</p>
      </Section>

      <Section title="4. Data Storage and Security">
        <p>Your subscriber data is stored in two systems:</p>
        <ul>
          <li><strong>MongoDB Atlas</strong> — subscriber records (email, status, preferences). Cluster hosted in Mumbai, India (ap-south-1 region), in compliance with DPDP data localisation requirements.</li>
          <li><strong>Supabase</strong> — immutable consent audit log. Stores consent type, timestamp, and IP address. Records are never deleted; only marked as revoked on unsubscribe.</li>
        </ul>
        <p>Emails are sent via <strong>Resend</strong> (a US-based transactional email service). By subscribing, you acknowledge that your email address is transmitted to Resend for the sole purpose of email delivery.</p>
        <p>We use HTTPS throughout. Access to subscriber data is restricted to authorised team members only.</p>
      </Section>

      <Section title="5. Your Rights Under DPDP Act 2023">
        <p>As a data principal under the Digital Personal Data Protection Act 2023, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
          <li><strong>Correction</strong> — request correction of inaccurate data</li>
          <li><strong>Erasure</strong> — request deletion of your personal data (right to be forgotten)</li>
          <li><strong>Withdraw consent</strong> — unsubscribe at any time via the link in any email, or by emailing us</li>
          <li><strong>Grievance redressal</strong> — raise a complaint with us before escalating to the Data Protection Board of India</li>
        </ul>
        <p>To exercise any of these rights, email <a href="mailto:hello@aceone.in">hello@aceone.in</a> from your subscribed email address. We will respond within 30 days.</p>
        <p>Note: consent audit logs (Supabase) are maintained as legally required records and cannot be fully deleted, but they will be anonymised on erasure requests.</p>
      </Section>

      <Section title="6. Cookies">
        <p>We use a single first-party cookie/localStorage entry (<code>ao_cookie_consent</code>) to remember your cookie consent preference. This contains only your decision (accepted/rejected) and a timestamp. No tracking cookies are set without your explicit consent.</p>
        <p>If you reject cookies, your experience on the site is not affected.</p>
      </Section>

      <Section title="7. Third-Party Services">
        <p>We use the following third-party services, each with their own privacy policies:</p>
        <ul>
          <li><strong>Resend</strong> — email delivery (<a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer">resend.com/privacy</a>)</li>
          <li><strong>Vercel</strong> — website hosting (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>)</li>
          <li><strong>Supabase</strong> — consent log storage (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>)</li>
          <li><strong>MongoDB Atlas</strong> — database (<a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">mongodb.com/legal/privacy-policy</a>)</li>
        </ul>
      </Section>

      <Section title="8. Retention">
        <p>We retain your subscriber data for as long as your subscription is active. If you unsubscribe, your email and personal data are deleted from operational systems within 30 days. Consent audit records are anonymised (IP and user agent removed) but the consent event record is retained as required by law.</p>
      </Section>

      <Section title="9. Children">
        <p>Our service is not directed at persons under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has subscribed, contact us immediately.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this policy periodically. Material changes will be communicated to active subscribers via email before taking effect. The &quot;last updated&quot; date at the top reflects the most recent revision.</p>
      </Section>

      <Section title="11. Contact & Grievance Officer">
        <p>
          Grievance Officer: Aman Khan<br />
          Email: <a href="mailto:hello@aceone.in">hello@aceone.in</a><br />
          Address: Mumbai, Maharashtra, India<br />
          Response time: within 30 days
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
