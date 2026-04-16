import { useState } from 'react';
import './App.css';
import { Q1, Q2, Q3 } from './data';
import { recommend, buildPainNarrative } from './logic';

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function AppCard({ app }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <a className="acard" href={app.url} target="_blank" rel="noopener noreferrer">
      {app.logo && !imgFailed ? (
        <img
          className="alogo"
          src={app.logo}
          alt={app.name}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="alogo-fb">{app.name[0]}</div>
      )}
      <div className="ainfo">
        <div className="aname">{app.name}</div>
        <div className="areason">{app.reason}</div>
      </div>
      <div className="aarrow">↗</div>
    </a>
  );
}

function QuestionStep({ label, title, subtitle, options, selected, onToggle, onBack, onNext, nextDisabled }) {
  return (
    <div>
      <div className="prog">
        {[1, 2, 3].map((i) => {
          const stepNum = parseInt(label.split(' ')[1], 10);
          return (
            <div
              key={i}
              className={`dot${stepNum === i ? ' on' : stepNum > i ? ' done' : ''}`}
            />
          );
        })}
      </div>
      <div className="qlabel">{label}</div>
      <h1>{title}</h1>
      {subtitle && <p className="sub">{subtitle}</p>}
      <div className="chips">
        {options.map((o) => (
          <button
            key={o}
            className={`chip${selected.includes(o) ? ' sel' : ''}`}
            onClick={() => onToggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="row">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-primary" disabled={nextDisabled} onClick={onNext}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep]       = useState(0);
  const [q1, setQ1]           = useState([]);
  const [q2, setQ2]           = useState([]);
  const [q3, setQ3]           = useState([]);
  const [results, setResults] = useState(null);
  const [painText, setPainText] = useState('');

  const toggle = (val, arr, setArr) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const compute = () => {
    setPainText(buildPainNarrative(q2, q3));
    setResults(recommend(q1, q2, q3));
    setStep(4);
  };

  const reset = () => {
    setStep(0); setQ1([]); setQ2([]); setQ3([]); setResults(null);
  };

  return (
    <div className="wrap">
      <div className="card">

        {/* ── INTRO ── */}
        {step === 0 && (
          <div>
            <div className="iicon">⚙️</div>
            <h1>Let's build your perfect Mac setup!</h1>
            <p className="sub">
              Just answer 3 questions and we'll put together an app stack that fits
              the way you (and your Mac 😉) actually work.
            </p>
            <div className="row">
              <button className="btn-primary" onClick={() => setStep(1)}>
                Build my app stack →
              </button>
              <span className="hint">Takes ~1 min</span>
            </div>
          </div>
        )}

        {/* ── QUESTION 1 ── */}
        {step === 1 && (
          <QuestionStep
            label="Question 1 of 3"
            title="What do you mostly use your Mac for?"
            subtitle="Select all that apply!"
            options={Q1}
            selected={q1}
            onToggle={(v) => toggle(v, q1, setQ1)}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
            nextDisabled={q1.length === 0}
          />
        )}

        {/* ── QUESTION 2 ── */}
        {step === 2 && (
          <QuestionStep
            label="Question 2 of 3"
            title="What takes more time than it should?"
            subtitle="Select all that apply!"
            options={Q2}
            selected={q2}
            onToggle={(v) => toggle(v, q2, setQ2)}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            nextDisabled={q2.length === 0}
          />
        )}

        {/* ── QUESTION 3 ── */}
        {step === 3 && (
          <QuestionStep
            label="Question 3 of 3"
            title="Which of these sounds most like you?"
            subtitle="Select all that apply!"
            options={Q3}
            selected={q3}
            onToggle={(v) => toggle(v, q3, setQ3)}
            onBack={() => setStep(2)}
            onNext={compute}
            nextDisabled={q3.length === 0}
          />
        )}

        {/* ── RESULTS ── */}
        {step === 4 && results && (
          <div>
            <div className="sec">⚠️ What's slowing you down</div>
            <div className="painbox">
              <p className="pain-text">{painText}</p>
            </div>

            <div className="div" />

            <div className="sec">🧩 Your recommended Setapp stack</div>
            {results.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}

            <a
              className="btn-marketplace"
              href="https://setapp.com/marketplace"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check out 250+ apps →
            </a>

            <div className="results-footer">
              <button className="btn-reset" onClick={reset}>↺ Start over</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}