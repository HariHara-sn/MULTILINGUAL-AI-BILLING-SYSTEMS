import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import VoiceRecorder from '../components/VoiceRecorder'
import BillTable from '../components/BillTable'
import Loader from '../components/Loader'
import { useVoiceRecognition } from '../hooks/useVoiceRecognition'
import { generateBill, confirmPurchase, getPurchaseHistory } from '../services/api'

export default function EmployeeBillingPage() {
  const voice            = useVoiceRecognition()
  const [billData, setBillData]       = useState(null)
  const [loadingBill, setLoadingBill] = useState(false)
  const [savingBill, setSavingBill]   = useState(false)
  const [customer, setCustomer]       = useState({ name: '', phone: '' })
  const [history, setHistory]         = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // ── Fetch history when phone is 10 digits ────────────────
  useEffect(() => {
    if (customer.phone.length === 10) {
      const fetchHistory = async () => {
        setLoadingHistory(true)
        try {
          const data = await getPurchaseHistory(customer.phone)
          setHistory(Array.isArray(data) ? data : data.purchases || [])
        } catch (err) {
          console.error('History fetch failed:', err)
          setHistory([])
        } finally {
          setLoadingHistory(false)
        }
      }
      fetchHistory()
    } else {
      setHistory([])
    }
  }, [customer.phone])

  // ── Handle final transcript → generate bill ──────────────
  const handleGenerateBill = async () => {
    const text = voice.transcript.trim()
    if (!text) {
      toast.error('No voice input detected.')
      return
    }
    setLoadingBill(true)
    setBillData(null)
    try {
      const data = await generateBill(text)
      setBillData(data)
      toast.success(`Bill generated: ₹${data.total}`)
    } catch (err) {
      toast.error(`Analysis failed: ${err.message}`)
    } finally {
      setLoadingBill(false)
    }
  }

  // ── Save purchase ────────────────────────────────────────
  const handleSavePurchase = async () => {
    if (!billData) return
    if (!customer.phone.trim() || customer.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }
    setSavingBill(true)
    try {
      await confirmPurchase({
        name:  customer.name.trim() || 'Walk-in Customer',
        phone: customer.phone.trim(),
        items: billData.items,
        total: billData.total,
      })
      toast.success('✅ Purchase saved successfully!')
      setBillData(null)
      voice.resetTranscript()
      setCustomer({ name: '', phone: '' })
      setHistory([])
    } catch (err) {
      toast.error(`Save failed: ${err.message}`)
    } finally {
      setSavingBill(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-700/50 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">AI Billing Counter</h1>
            <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Live Tamil Voice Recognition Active
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Operator State</div>
            <div className="text-indigo-400 font-mono text-sm">READY-FOR-INPUT</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Voice Input & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <VoiceRecorder
              isEnabled={voice.isEnabled}
              isListening={voice.isListening}
              transcript={voice.transcript}
              error={voice.error}
              onEnable={voice.enableVoice}
              onStart={voice.startListening}
              onStop={voice.stopListening}
              onReset={voice.resetTranscript}
            />

            <div className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all shadow-xl">
              <label className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transcript Analysis</span>
                <span className="text-[10px] text-indigo-400 font-medium">EDITABLE WINDOW</span>
              </label>
              <textarea
                className="input min-h-[100px] bg-slate-900/40 text-lg leading-relaxed border-none focus:ring-0 placeholder:text-slate-600"
                placeholder="Expected: தக்காளி 1 கிலோ கேரட் அரை கிலோ..."
                value={voice.transcript}
                onChange={(e) => voice.setTranscript(e.target.value)}
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="text-[10px] text-slate-500 font-mono">
                  CHARS: {voice.transcript.length} | WORDS: {voice.transcript.split(/\s+/).filter(Boolean).length}
                </div>
                <button
                  id="generate-bill-btn"
                  className="btn btn-primary px-8 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 font-bold"
                  onClick={handleGenerateBill}
                  disabled={loadingBill || !voice.transcript.trim()}
                >
                  {loadingBill ? (
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : <span className="flex items-center gap-2"><span>Generate Bill</span> <span className="text-xl">→</span></span>}
                </button>
              </div>
            </div>

            {loadingBill && (
              <div className="py-10 bg-indigo-500/5 rounded-3xl border border-dashed border-indigo-500/20">
                <Loader message="Deconstructing Tamil semantics..." />
              </div>
            )}
          </div>

          {/* Right Column: Customer & History */}
          <div className="lg:col-span-5 space-y-6">
             {/* Customer Data Card */}
             <div className="glass p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm">👤</span>
                   Customer Profile
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Phone Number</label>
                    <input
                      className="input h-14 bg-slate-900/50 text-xl font-bold tracking-widest text-emerald-400 placeholder:text-slate-700"
                      placeholder="9876543210"
                      value={customer.phone}
                      maxLength={10}
                      onChange={e => setCustomer(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                    <input
                      className="input h-12 bg-slate-900/50 font-medium placeholder:text-slate-700"
                      placeholder="Optional name..."
                      value={customer.name}
                      onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Inline History Preview */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</span>
                     {loadingHistory && <span className="w-3 h-3 border-b-2 border-indigo-500 rounded-full animate-spin"></span>}
                   </div>
                   
                   {history.length > 0 ? (
                     <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {history.slice(0, 3).map((h, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                            <div>
                               <div className="text-xs font-bold text-slate-300">{new Date(h.created_at).toLocaleDateString()}</div>
                               <div className="text-[10px] text-slate-500 uppercase">{h.items?.length || 0} items</div>
                            </div>
                            <div className="text-sm font-black text-emerald-500">₹{h.total}</div>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="py-6 text-center text-slate-600 text-[10px] font-bold uppercase tracking-tighter italic">
                        {customer.phone.length === 10 ? 'No previous records found' : 'Enter phone to see history'}
                     </div>
                   )}
                </div>
             </div>
          </div>

        </div>

        {/* Full-width Result Section */}
        {billData && (
          <div className="space-y-6 animate-slide-up">
            <div className="glass p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white">Consolidated Bill</h3>
                  <div className="h-1.5 w-16 bg-emerald-500 rounded-full mt-2"></div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                   <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">READY_TO_SETTLE</span>
                </div>
              </div>
              
              <BillTable items={billData.items} total={billData.total} />

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50">
                <div className="text-slate-400 text-sm">
                   Confirm all items before finalizing the transaction.
                </div>
                <button
                  id="save-purchase-btn"
                  className="btn btn-success h-14 px-12 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-500/20 w-full sm:w-auto"
                  onClick={handleSavePurchase}
                  disabled={savingBill}
                >
                  {savingBill ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Finalizing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">💾 Complete Transaction</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
