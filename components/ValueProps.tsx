import { Users, TrendingUp, Award } from "lucide-react"

export function ValueProps() {
  const values = [
    {
      icon: Award,
      title: "Pro-Led Training",
      description: "Learn from certified professional coaches with proven track records",
    },
    {
      icon: Users,
      title: "4:1 Player Ratio",
      description: "Small groups ensure personalized attention and maximum improvement",
    },
    {
      icon: TrendingUp,
      title: "Skill Progression",
      description: "Get the skills and patterns you need to level up your game",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="bg-primary rounded-full p-4 mb-4">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
