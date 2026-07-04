import type { Metadata } from 'next'
import GenerateImageView from '@/components/GenerateImageView'

export const metadata: Metadata = {
  title: 'Generate Image — Aceone Admin',
}

export default function GenerateImagePage() {
  return <GenerateImageView />
}
