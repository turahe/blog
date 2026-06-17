import { ReactNode } from 'react'

export default function Bleed({ full, children }: { full?: boolean; children: ReactNode }) {
  return (
    <div
      className={`relative mt-6 ${full ? 'mr-[calc(-50vw+50%)] ml-[calc(-50vw+50%)]' : '-mx-6 md:-mx-8 2xl:-mx-24'}`}
    >
      {children}
    </div>
  )
}
