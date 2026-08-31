import './how-to-play.css'

const Icon = ({ type }) => {
  const icons = {
    back: <path d="M20 12H4m6-6-6 6 6 6" />,
    play: <path d="m7 4 13 8L7 20V4Z" />,
    shield: <path d="M24 4c6 5 12 7 18 8v10c0 11-7 18-18 23C13 40 6 33 6 22V12c6-1 12-3 18-8Z" />,
    shieldCheck: (
      <>
        <path d="M24 4c6 5 12 7 18 8v10c0 11-7 18-18 23C13 40 6 33 6 22V12c6-1 12-3 18-8Z" />
        <path d="m17 24 5 5 10-11" />
      </>
    ),
    target: (
      <>
        <circle cx="24" cy="14" r="6" />
        <path d="M12 39c1-9 5-14 12-14s11 5 12 14M24 3v5M24 42v3M3 24h7M38 24h7" />
        <circle cx="24" cy="24" r="20" />
      </>
    ),
    hook: (
      <>
        <path d="M28 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM23 12v20c0 7-5 11-11 11S2 39 2 33c0-2 1-4 2-6 0 6 3 8 8 8 6 0 11-5 11-11" />
        <path d="M23 18h12" />
      </>
    ),
    book: <path d="M4 10c7-2 14-1 20 4v29c-6-5-13-6-20-4V10Zm40 0c-7-2-14-1-20 4v29c6-5 13-6 20-4V10Z" />,
    coins: (
      <>
        <ellipse cx="24" cy="10" rx="14" ry="6" />
        <path d="M10 10v9c0 3 6 6 14 6s14-3 14-6v-9M10 19v9c0 3 6 6 14 6s14-3 14-6v-9M10 28v9c0 3 6 6 14 6s14-3 14-6v-9" />
      </>
    ),
    warning: (
      <>
        <path d="M24 4c6 5 12 7 18 8v10c0 11-7 18-18 23C13 40 6 33 6 22V12c6-1 12-3 18-8Z" />
        <path d="M24 15v13M24 35h.01" />
      </>
    ),
  }

  return (
    <svg aria-hidden="true" viewBox={type === 'back' || type === 'play' ? '0 0 24 24' : '0 0 48 48'}>
      {icons[type]}
    </svg>
  )
}

const steps = [
  {
    icon: 'target',
    title: 'Choose a target',
    text: 'Select an Employee, Senior Employee, Manager or CEO. Higher-importance targets cause greater damage, but also raise attacker exposure.',
  },
  {
    icon: 'hook',
    title: 'Select a technique',
    text: 'Choose Phishing, Fake Social Profile or Deepfake, then select a suitable technique type.',
  },
  {
    icon: 'shield',
    title: 'Face the defence',
    text: 'The company has built-in defences. Your selected target and technique determine the outcome.',
  },
  {
    icon: 'book',
    title: 'Learn and continue',
    text: 'Review the damage, exposure and correct defensive advice before beginning the next turn.',
  },
]

export default function HowToPlay() {
  return (
    <main className="how-to-play">
      <div className="grid-overlay" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="/" aria-label="Breach Point home">
          <span className="brand-name">Breach Point</span>
          <span className="brand-tagline">Social Engineering Awareness Simulation</span>
        </a>

        <a className="outline-button header-home" href="/">
          <Icon type="back" />
          Back to home
        </a>
      </header>

      <section className="page-intro" aria-labelledby="page-title">
        <p className="eyebrow">Mission briefing</p>
        <h1 id="page-title">How to Play</h1>
        <p className="intro-copy">
          Bankrupt the fictional company before your exposure reaches 100%.
        </p>
      </section>

      <section className="objective" aria-labelledby="objective-title">
        <div className="objective-icon" aria-hidden="true">
          <Icon type="shieldCheck" />
        </div>
        <div>
          <h2 id="objective-title">Your objective</h2>
          <p>Reduce the company’s $5,000,000 starting funds to $0 without being detected.</p>
        </div>
      </section>

      <section className="steps" aria-label="Simulation steps">
        {steps.map((step, index) => (
          <article className="step-card" key={step.title}>
            <span className="step-number">{index + 1}</span>
            <div className="step-icon" aria-hidden="true">
              <Icon type={step.icon} />
            </div>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="outcomes" aria-label="Win and loss conditions">
        <article className="outcome outcome-win">
          <div className="outcome-icon" aria-hidden="true"><Icon type="coins" /></div>
          <div><h2>Win</h2><p>Company funds reach $0</p></div>
        </article>

        <article className="outcome outcome-loss">
          <div className="outcome-icon" aria-hidden="true"><Icon type="warning" /></div>
          <div><h2>Game over</h2><p>Attacker exposure reaches 100%</p></div>
        </article>
      </section>

      <nav className="page-actions" aria-label="How to play actions">
        <a className="primary-button" href="/gameplay">
          <Icon type="play" />
          Start simulation
        </a>
      </nav>

      <footer className="disclaimer">
        <span>Fictional targets</span><i aria-hidden="true" />
        <span>No user data collected</span><i aria-hidden="true" />
        <span>Educational use only</span>
      </footer>
    </main>
  )
}
