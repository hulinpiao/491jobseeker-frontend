import { CheckCircle2 } from 'lucide-react'

const features = [
  'Visa-compliant jobs only',
  'Regional + Remote opportunities',
  'AI-powered resume matching',
  'Save time, reduce risk'
]

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Why Choose 491JobSeeker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 dark:text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
