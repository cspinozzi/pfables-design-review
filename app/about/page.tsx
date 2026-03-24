import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="mb-3 text-2xl sm:text-3xl font-semibold">About ProMusic</h1>
          <p className="text-muted-foreground">
            A trusted marketplace connecting music families with verified local teachers.
          </p>
        </div>
      </section>

      <section className="border-b">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="mb-3 text-lg font-medium">Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Finding quality music education and services should be simple, fast, and trustworthy. 
            ProMusic eliminates platform complexity by focusing on what matters: connecting families 
            with verified, local music professionals quickly and safely.
          </p>
        </div>
      </section>

      <section className="border-b">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="mb-6 text-lg font-medium">Why ProMusic</h2>
          <ul className="space-y-3">
            {[
              "Verified teachers with background checks",
              "No account required to browse",
              "Direct contact with no platform fees",
              "Local community focus",
              "Mobile-first experience",
              "Teacher autonomy and fair monetization",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="mb-6 text-lg font-medium">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[8px] border bg-card p-5">
              <h3 className="mb-2 text-sm font-medium">For Parents</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse verified music teachers and repair services. Contact them directly via phone 
                or message. No accounts, no payments through the platform.
              </p>
            </div>
            <div className="rounded-[8px] border bg-card p-5">
              <h3 className="mb-2 text-sm font-medium">For Teachers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create your profile, complete verification, and get discovered by local families. 
                Manage your own business while benefiting from platform visibility.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
