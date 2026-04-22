import Image from "next/image"

export function ValueProps() {
  const values = [
    {
      icon: "/icons/pro-led-training.png",
      title: "Pro-Led Training",
      description: "Learn from certified professional coaches with proven track records",
    },
    {
      icon: "/icons/player-ratio.png",
      title: "4:1 Player Ratio",
      description: "Small groups ensure personalized attention and maximum improvement",
    },
    {
      icon: "/icons/track-progress.png",
      title: "Skill Progression",
      description: "Get the skills and patterns you need to level up your game",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={value.icon}
                  alt={value.title}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
