export default function VoiceRecorder({
  isEnabled,
  isListening,
  transcript,
  error,
  onEnable,
  onStart,
  onStop,
  onReset,
}) {
  const micState = !isEnabled ? 'disabled' : isListening ? 'recording' : 'idle'

  return (
    <div className="glass p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Voice Input</h2>
          <p className="text-slate-400 text-sm mt-0.5">Speak in Tamil to generate your bill</p>
        </div>
        <StatusBadge isEnabled={isEnabled} isListening={isListening} />
      </div>

      {/* Mic + controls row */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Mic button */}
        <button
          className={`mic-btn ${micState}`}
          onClick={isListening ? onStop : isEnabled ? onStart : undefined}
          disabled={!isEnabled}
          title={!isEnabled ? 'Enable voice first' : isListening ? 'Stop recording' : 'Start recording'}
        >
          {isListening ? (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
            </svg>
          )}
        </button>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {!isEnabled ? (
            <button className="btn btn-primary" onClick={onEnable}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
              </svg>
              Enable Voice
            </button>
          ) : (
            <>
              {!isListening ? (
                <button className="btn btn-primary" onClick={onStart}>
                  🎙️ Start Recording
                </button>
              ) : (
                <button className="btn btn-danger" onClick={onStop}>
                  ⏹ Stop Recording
                </button>
              )}
              {transcript && !isListening && (
                <button className="btn btn-ghost" onClick={onReset}>
                  🗑 Clear
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Transcript display */}
      {(transcript || isListening) && (
        <div className="rounded-xl border border-slate-600/40 bg-slate-900/60 p-4 min-h-[80px] relative">
          <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Recognized Text</p>
          <p className={`text-slate-100 leading-relaxed text-base ${!transcript ? 'text-slate-500 italic' : ''}`}>
            {transcript || 'Listening…'}
          </p>
          {isListening && (
            <span className="absolute top-3 right-3 flex gap-0.5">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1 h-4 bg-red-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ isEnabled, isListening }) {
  if (!isEnabled) {
    return (
      <span className="badge bg-slate-500/20 text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block mr-1" />
        Disabled
      </span>
    )
  }
  if (isListening) {
    return (
      <span className="badge bg-red-500/20 text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block mr-1 animate-pulse" />
        Recording
      </span>
    )
  }
  return (
    <span className="badge bg-emerald-500/20 text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1" />
      Ready
    </span>
  )
}
