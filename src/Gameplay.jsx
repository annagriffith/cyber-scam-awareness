import { useMemo, useState } from 'react'
import './Gameplay.css'

const targets = [
  {
    id: 'jordan', name: 'Jordan Malik', initials: 'JM', role: 'Service Desk', tier: 1,
    tierLabel: 'Employee', tone: 'blue',
    traits: ['New to the role and eager to help', 'Spends downtime on Facebook', 'More cautious with unexpected calls'],
    scenario: 'A staff member reports a locked account during a busy shift. Jordan wants to resolve the request quickly and prove he can handle it without escalation.',
    transcript: 'Iris: Jordan is still finding his feet on the service desk. He responds to authority and urgency, but a recent prank call has made him more careful on the phone.',
    strengths: { phishing: ['email', 'teams'], social: ['facebook'] },
    weaknesses: { phishing: ['vishing'] },
  },
  {
    id: 'priya', name: 'Priya Nandakumar', initials: 'PN', role: 'Receptionist', tier: 1,
    tierLabel: 'Employee', tone: 'violet',
    traits: ['Handles constant calls and interruptions', 'Strict about visitor sign-in procedure', 'Posts about workdays on Instagram'],
    scenario: 'The reception desk is busy with visitors and incoming calls. A believable request arrives while Priya is switching between several tasks.',
    transcript: 'Iris: Priya follows physical visitor procedure closely, but the volume of unscheduled calls creates pressure. Her public Instagram activity may also reveal useful context.',
    strengths: { phishing: ['vishing'], social: ['instagram'] },
    weaknesses: { phishing: ['email', 'teams'] },
  },
  {
    id: 'derek', name: 'Derek Combs', initials: 'DC', role: 'IT Manager', tier: 3,
    tierLabel: 'Manager', tone: 'teal',
    traits: ['Trusts his own technical judgement', 'Responds to fellow-IT framing', 'Accepts only mutual social contacts'],
    scenario: 'An internal-looking request claims that an urgent technical review must be completed before the next board call. Derek believes he can recognise obvious scams.',
    transcript: 'Iris: Derek is experienced, but confidence can replace verification. Information gathered from Jordan may make an internal IT pretext more believable.',
    strengths: { phishing: ['email', 'teams'] },
    weaknesses: { social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Gain a successful foothold with Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'sarah', name: 'Sarah Lindqvist', initials: 'SL', role: 'HR Manager', tier: 3,
    tierLabel: 'Manager', tone: 'amber',
    traits: ['Responds to empathy-based appeals', 'Verifies sensitive requests by phone', 'Trusted contact for staff problems'],
    scenario: 'A message describes an urgent staff wellbeing problem and asks HR to review private information before a scheduled meeting.',
    transcript: 'Iris: Sarah genuinely wants to help people in difficulty. Her empathy is reachable, but she has a firm phone-verification process for sensitive actions.',
    strengths: { phishing: ['email', 'teams'], social: ['facebook', 'instagram'] },
    weaknesses: { phishing: ['vishing'] },
    lockedMessage: 'Gain a successful foothold with Jordan or Priya to unlock Manager targets.',
  },
  {
    id: 'marcus', name: 'Marcus Reyes', initials: 'MR', role: 'CEO', tier: 4,
    tierLabel: 'CEO', tone: 'red',
    traits: ['High-profile speaker with public footage', 'Contact is filtered through an assistant', 'Requires strong prior intelligence'],
    scenario: 'A high-stakes request must reach Marcus during a narrow gap in his schedule. His executive assistant normally filters all unexpected contact.',
    transcript: 'Iris: Marcus is difficult to reach directly. Manager-level intelligence is essential, although his public interviews and keynotes create deepfake exposure.',
    strengths: { deepfake: ['voice', 'video'] },
    weaknesses: { phishing: ['email', 'teams'], social: ['linkedin', 'facebook', 'instagram'] },
    lockedMessage: 'Complete at least one successful Manager attempt to unlock the CEO.',
  },
]

const techniques = [
  { id: 'phishing', icon: '⌁', title: 'Phishing', description: 'Test a simulated message or call.', options: [
    { id: 'email', label: 'Email' }, { id: 'sms', label: 'SMS' },
    { id: 'vishing', label: 'Vishing / voice call' }, { id: 'teams', label: 'Teams / Slack DM' },
  ] },
  { id: 'social', icon: '▣', title: 'Fake Social Profile', description: 'Test a fictional connection request.', options: [
    { id: 'facebook', label: 'Facebook' }, { id: 'instagram', label: 'Instagram' }, { id: 'linkedin', label: 'LinkedIn' },
  ] },
  { id: 'deepfake', icon: '◒', title: 'Deepfake', description: 'Test synthetic media awareness.', options: [
    { id: 'voice', label: 'Voice clone' }, { id: 'video', label: 'Video / image' },
  ] },
]

const startingFunds = 5_000_000
const formatMoney = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
}).format(value)

function Gameplay() {
  const [musicOn, setMusicOn] = useState(true)
  const [selectedTargetId, setSelectedTargetId] = useState('jordan')
  const [selectedTechnique, setSelectedTechnique] = useState('')
  const [subtypes, setSubtypes] = useState({ phishing: 'email', social: 'linkedin', deepfake: 'voice' })
  const [funds, setFunds] = useState(startingFunds)
  const [exposure, setExposure] = useState(0)
  const [turn, setTurn] = useState(1)
  const [employeeCleared, setEmployeeCleared] = useState(false)
  const [managerCleared, setManagerCleared] = useState(false)
  const [lastTargetId, setLastTargetId] = useState(null)
  const [repeatCount, setRepeatCount] = useState(0)
  const [result, setResult] = useState(null)

  const selectedTarget = useMemo(
    () => targets.find((target) => target.id === selectedTargetId) ?? targets[0],
    [selectedTargetId],
  )

  const targetLocked = (target) => {
    if (target.tier === 3) return !employeeCleared
    if (target.tier === 4) return !managerCleared
    return false
  }

  const selectedOption = techniques.find((item) => item.id === selectedTechnique)
    ?.options.find((option) => option.id === subtypes[selectedTechnique])

  const resetGame = () => {
    setSelectedTargetId('jordan'); setSelectedTechnique(''); setFunds(startingFunds)
    setExposure(0); setTurn(1); setEmployeeCleared(false); setManagerCleared(false)
    setLastTargetId(null); setRepeatCount(0); setResult(null)
  }

  const selectTarget = (id) => {
    setSelectedTargetId(id); setSelectedTechnique(''); setResult(null)
  }

  const launchSimulation = () => {
    if (!selectedTechnique || targetLocked(selectedTarget)) return
    const subtype = subtypes[selectedTechnique]
    const isStrong = selectedTarget.strengths[selectedTechnique]?.includes(subtype)
    const isWeak = selectedTarget.weaknesses[selectedTechnique]?.includes(subtype)
    const nextRepeatCount = lastTargetId === selectedTarget.id ? repeatCount + 1 : 1
    const tierMultiplier = selectedTarget.tier === 4 ? 1.45 : selectedTarget.tier === 3 ? 1.2 : 1
    const fatigue = Math.max(0, nextRepeatCount - 1) * 3
    const damage = Math.round((isStrong ? 560_000 : isWeak ? 70_000 : 230_000) * tierMultiplier)
    const exposureGain = Math.min(40, Math.round((isStrong ? 8 : isWeak ? 22 : 14) * tierMultiplier + fatigue))

    setFunds((value) => Math.max(0, value - damage))
    setExposure((value) => Math.min(100, value + exposureGain))
    setLastTargetId(selectedTarget.id); setRepeatCount(nextRepeatCount)
    if (isStrong && selectedTarget.tier === 1) setEmployeeCleared(true)
    if (isStrong && selectedTarget.tier === 3) setManagerCleared(true)

    setResult({
      outcome: isStrong ? 'Effective match' : isWeak ? 'High-risk mismatch' : 'Partial result',
      damage, exposureGain, isStrong, isWeak, fatigue: nextRepeatCount > 1,
      text: isStrong
        ? `${selectedOption.label} aligned with ${selectedTarget.name}'s visible behaviour. The simulated approach caused significant impact, but it still left evidence and raised exposure.`
        : isWeak
          ? `${selectedOption.label} conflicted with ${selectedTarget.name}'s known safeguards. The attempt caused little impact and made the activity easier to detect.`
          : `${selectedOption.label} had limited relevance to this target. Some impact occurred, but the risk-to-reward result was weak.`,
      defence: isStrong
        ? 'Use a trusted second channel, slow down urgent requests, and report unusual contact through the organisation’s security process.'
        : 'The target’s existing verification habit reduced the impact. Consistent process is more reliable than judging a message by appearance alone.',
    })
  }

  const nextRound = () => { setTurn((value) => value + 1); setSelectedTechnique(''); setResult(null) }
  const fundsPercent = (funds / startingFunds) * 100

  return (
    <main className="game-page">
      <div className="game-shell">
        <header className="game-header">
          <div><div className="game-brand">BREACH POINT</div><div className="game-subtitle">SOCIAL ENGINEERING AWARENESS SIMULATION</div></div>
          <div className="header-actions">
            <button className="utility-button" type="button" onClick={() => setMusicOn(!musicOn)}>
              <span className="music-note">♫</span> MUSIC {musicOn ? 'ON' : 'OFF'}
              <span className={`toggle ${musicOn ? 'active' : ''}`}><span /></span>
            </button>
            <button className="utility-button" type="button" onClick={resetGame}><span className="restart-icon">↻</span> RESTART</button>
          </div>
        </header>

        <section className="status-grid">
          <div className="importance-card glass-panel">
            <div className="round-icon">●</div>
            <div className="importance-content">
              <div className="status-title">TARGET IMPORTANCE — LEVEL {selectedTarget.tier} OF 4</div>
              <div className="importance-track" aria-label={`Target level ${selectedTarget.tier} of 4`}>
                {[1, 2, 3, 4].map((level) => <span key={level} className={level <= selectedTarget.tier ? 'reached' : ''} />)}
              </div>
              <div className="importance-labels"><span>EMPLOYEE</span><span>SENIOR EMPLOYEE</span><span>MANAGER</span><span>CEO</span></div>
            </div>
          </div>
          <div className="turn-card glass-panel"><div className="round-icon turn">↻</div><div><div className="status-title">TURN</div><div className="turn-number">{turn}</div></div></div>
        </section>

        <section className="meter glass-panel funds-meter">
          <div className="meter-name">COMPANY FUNDS REMAINING</div>
          <div className="meter-track"><span style={{ width: `${fundsPercent}%` }} /></div>
          <div className="meter-value funds-value"><strong>{formatMoney(funds)}</strong><small>STARTING FUNDS: {formatMoney(startingFunds)}</small></div>
        </section>

        <section className="meter glass-panel exposure-meter">
          <div className="shield-icon">◇</div><div className="meter-name">ATTACKER EXPOSURE</div>
          <div className="meter-track exposure-track"><span style={{ width: `${exposure}%` }} /></div>
          <div className="meter-value exposure-value">{exposure}%</div>
          <div className="detected-label"><span>◇</span> 100% = DETECTED</div>
        </section>

        <section className="gameplay-grid">
          <article className="target-panel glass-panel">
            <div className="section-kicker">TARGET</div>
            <div className={`target-avatar ${selectedTarget.tone}`} aria-label={`${selectedTarget.name} avatar`}><span>{selectedTarget.initials}</span><div className="avatar-rings" /></div>
            <div className="target-traits">
              {selectedTarget.traits.map((trait, index) => <div key={trait}><span>{['✉', '▣', '▱'][index]}</span>{trait}</div>)}
            </div>
          </article>

          <article className="selection-panel glass-panel">
            <label className="section-kicker" htmlFor="target-select">CHOOSE TARGET</label>
            <div className="select-wrap"><select id="target-select" value={selectedTargetId} onChange={(event) => selectTarget(event.target.value)}>
              {targets.map((target) => <option key={target.id} value={target.id} disabled={targetLocked(target)}>{targetLocked(target) ? 'LOCKED — ' : ''}{target.name.toUpperCase()} — {target.role.toUpperCase()}</option>)}
            </select></div>
            <div className="target-list" aria-label="Available targets">
              {targets.map((target) => {
                const locked = targetLocked(target)
                return <button className={`target-row ${target.id === selectedTargetId ? 'selected' : ''}`} key={target.id} type="button" disabled={locked} title={locked ? target.lockedMessage : `Select ${target.name}`} onClick={() => selectTarget(target.id)}>
                  <span className={`mini-avatar ${target.tone}`}>{target.initials}</span>
                  <span className="target-row-copy"><strong>{target.name}</strong><small>{target.role}</small></span>
                  <span className="level-tag">{locked ? 'LOCKED' : `LEVEL ${target.tier}`}</span>
                </button>
              })}
            </div>
          </article>

          <article className="scenario-panel glass-panel">
            {!result ? <>
              <div className="section-kicker">SCENARIO</div><p className="scenario-copy">{selectedTarget.scenario}</p>
              <div className="audio-controls" aria-label="Narration controls">
                <button type="button" aria-label="Play narration"><span>▶</span> PLAY</button><button type="button" aria-label="Pause narration"><span>Ⅱ</span> PAUSE</button>
                <button type="button" aria-label="Replay narration"><span>↻</span> REPLAY</button><button type="button" aria-label="Mute narration"><span>🔇</span> MUTE</button>
              </div>
              <div className="transcript-box"><div className="transcript-heading"><span>TRANSCRIPT</span><span>VISIBLE NARRATION</span></div><p>{selectedTarget.transcript}</p></div>
            </> : <div className="round-result" aria-live="polite">
              <div className="result-topline"><div><span className="section-kicker">ROUND RESULT</span><h2>{result.outcome}</h2></div><span className={`result-badge ${result.isStrong ? 'effective' : result.isWeak ? 'risky' : 'partial'}`}>{result.isStrong ? '✓ EFFECTIVE' : result.isWeak ? '! HIGH EXPOSURE' : '• PARTIAL'}</span></div>
              <div className="result-impact"><div><small>COMPANY DAMAGE</small><strong>−{formatMoney(result.damage)}</strong></div><div><small>EXPOSURE GAIN</small><strong>+{result.exposureGain}%</strong></div></div>
              <p>{result.text}</p><div className="defence-note"><strong>DEFENSIVE LESSON</strong><span>{result.defence}</span></div>
              {result.fatigue && <div className="fatigue-warning">Repeated contact made {selectedTarget.name} more alert.</div>}
            </div>}
          </article>
        </section>

        <section className="technique-section glass-panel">
          <div className="technique-heading">CHOOSE A TECHNIQUE AND TYPE</div>
          <div className="technique-layout">
            <div className="technique-cards">
              {techniques.map((technique) => <article key={technique.id} className={`technique-card ${selectedTechnique === technique.id ? 'selected' : ''}`} onClick={() => !result && setSelectedTechnique(technique.id)}>
                <button className="technique-main" type="button" disabled={Boolean(result)} aria-pressed={selectedTechnique === technique.id}>
                  <span className="technique-icon">{technique.icon}</span><span><strong>{technique.title}</strong><small>{technique.description}</small></span>
                </button>
                <label><span>TYPE</span><select value={subtypes[technique.id]} disabled={Boolean(result)} onClick={(event) => event.stopPropagation()} onChange={(event) => { setSelectedTechnique(technique.id); setSubtypes((current) => ({ ...current, [technique.id]: event.target.value })) }}>
                  {technique.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select></label>
              </article>)}
            </div>
            <aside className="launch-panel">
              {!result ? <button className="launch-button" type="button" disabled={!selectedTechnique || targetLocked(selectedTarget)} onClick={launchSimulation}>LAUNCH SIMULATION <span>{selectedTechnique ? '▶' : '▣'}</span></button>
                : <button className="launch-button next" type="button" onClick={nextRound}>NEXT ROUND <span>›</span></button>}
              <p>{result ? 'Review the educational result, then continue.' : selectedTechnique ? `${techniques.find((item) => item.id === selectedTechnique)?.title}: ${selectedOption?.label}` : 'Select a target and choose a technique type to launch the simulation.'}</p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Gameplay
