export default function BillTable({ items = [], total = 0 }) {
  if (!items.length) return null

  return (
    <div className="animate-slide-up">
      <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/20">
        <table className="w-full bill-table">
          <thead>
            <tr>
              <th className="w-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">#</th>
              <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Item Description</th>
              <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Qty</th>
              <th className="text-center py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Unit Price</th>
              <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors duration-150 group">
                <td className="text-slate-500 text-[10px] font-mono text-center">
                  {(idx + 1).toString().padStart(2, '0')}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                      🥦
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-sm tracking-wide">{item.item}</div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest">Fresh Category</div>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 px-6">
                  <div className="font-mono font-bold text-slate-200 text-sm">{item.qty}</div>
                  <div className="text-[9px] text-slate-500 uppercase">{item.unit}</div>
                </td>
                <td className="text-center py-4 px-6">
                  <span className="font-mono text-slate-400 text-xs">
                    ₹{(item.price / item.qty).toFixed(2)}
                  </span>
                </td>
                <td className="text-right py-4 px-6 font-mono font-black text-emerald-400 text-sm">
                  ₹{item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Total row */}
      <div className="mt-8 flex justify-end">
        <div className="bg-emerald-500/[0.03] px-10 py-6 rounded-[2rem] flex flex-col items-end border border-emerald-500/10 shadow-inner">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Payable Amount</span>
          <span className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

