import { UserCheck, Filter, FileText } from 'lucide-react'

const steps = [
  {
    icon: UserCheck,
    title: 'Tell us your visa type and skills',
    description: 'Create your profile in minutes. We support all regional visa types.'
  },
  {
    icon: Filter,
    title: 'We match you with compliant regional jobs',
    description: 'Every job is verified to accept 491/494 visas. No more guessing.'
  },
  {
    icon: FileText,
    title: 'Apply with AI-optimized resumes',
    description: 'Get tailored resumes and cover letters for each application.'
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
