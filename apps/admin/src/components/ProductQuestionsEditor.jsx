// // import React, { useEffect, useState } from 'react';
// // import { Plus, Trash2, GripVertical } from 'lucide-react';
// // import ApiService from '../services/api';

// // const TEMPLATES = {
// //     ADICIONAIS_PADRAO: () => ({
// //         id: `q_adicionais_${Math.random().toString(36).slice(2, 6)}`,
// //         titulo: 'Adicionais',
// //         tipo: 'multiple',
// //         obrigatoria: false,
// //         min: 0,
// //         max: 5,
// //         opcoes: [
// //             { id: 'add_bacon', label: 'Bacon', deltaPreco: 5 },
// //             { id: 'add_queijo', label: 'Queijo extra', deltaPreco: 4 },
// //             { id: 'add_azeit', label: 'Azeitona', deltaPreco: 3 },
// //             { id: 'add_catupi', label: 'Catupiry', deltaPreco: 6 }
// //         ]
// //     }),
// //     SABORES_ATE_10: () => ({
// //         id: `q_sabores_${Math.random().toString(36).slice(2, 6)}`,
// //         titulo: 'Escolha os sabores',
// //         tipo: 'flavor',
// //         obrigatoria: true,
// //         min: 1,
// //         max: 10,
// //         fracionamento: 10,
// //         pricingRule: 'maior', // maior | media | soma
// //         opcoes: [
// //             { id: 'sab_calabresa', label: 'Calabresa', deltaPreco: 0 },
// //             { id: 'sab_frango_catupiry', label: 'Frango c/ Catupiry', deltaPreco: 3 },
// //             { id: 'sab_portuguesa', label: 'Portuguesa', deltaPreco: 2 },
// //             { id: 'sab_marguerita', label: 'Marguerita', deltaPreco: 0 },
// //             { id: 'sab_bacon', label: 'Bacon', deltaPreco: 2 },
// //             { id: 'sab_quatro_queijos', label: '4 Queijos', deltaPreco: 4 },
// //             { id: 'sab_milho', label: 'Milho', deltaPreco: 1 },
// //             { id: 'sab_palmito', label: 'Palmito', deltaPreco: 2 },
// //             { id: 'sab_pepperoni', label: 'Pepperoni', deltaPreco: 3 },
// //             { id: 'sab_atum', label: 'Atum', deltaPreco: 2 }
// //         ]
// //     }),
// //     OBSERVACOES: () => ({
// //         id: `q_obs_${Math.random().toString(36).slice(2, 6)}`,
// //         titulo: 'Observações',
// //         tipo: 'text',
// //         obrigatoria: false,
// //         placeholder: 'Ex: sem cebola, massa fina'
// //     })
// // };

// // export default function ProductQuestionsEditor({ product, onClose, onSaved, showSuccess, showError }) {
// //     const [loading, setLoading] = useState(true);
// //     const [perguntas, setPerguntas] = useState([]);

// //     useEffect(() => {
// //         (async () => {
// //             try {
// //                 setLoading(true);
// //                 const list = await ApiService.getProductQuestions(product.id);
// //                 setPerguntas(Array.isArray(list) ? list : []);
// //             } catch (e) {
// //                 showError?.('Erro ao carregar perguntas');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         })();
// //     }, [product?.id]);

// //     const addPergunta = () => {
// //         setPerguntas(prev => [...prev, {
// //             id: `q_${Math.random().toString(36).slice(2, 7)}`,
// //             titulo: '',
// //             tipo: 'single',
// //             obrigatoria: false,
// //             min: 0,
// //             max: 1,
// //             fracionamento: 1,
// //             pricingRule: 'maior',
// //             opcoes: []
// //         }]);
// //     };

// //     const addTemplate = (tpl) => setPerguntas(prev => [...prev, tpl()]);
// //     const removePergunta = (id) => setPerguntas(prev => prev.filter(p => p.id !== id));

// //     const move = (id, dir) => {
// //         const idx = perguntas.findIndex(p => p.id === id);
// //         if (idx < 0) return;
// //         const arr = [...perguntas];
// //         const j = idx + dir;
// //         if (j < 0 || j >= arr.length) return;
// //         const tmp = arr[idx]; arr[idx] = arr[j]; arr[j] = tmp;
// //         setPerguntas(arr);
// //     };

// //     const updatePergunta = (id, patch) => {
// //         setPerguntas(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
// //     };

// //     const save = async () => {
// //         try {
// //             await ApiService.updateProductQuestions(product.id, perguntas);
// //             showSuccess?.('Perguntas salvas!');
// //             onSaved?.();
// //             onClose?.();
// //         } catch (e) {
// //             showError?.(e.message || 'Erro ao salvar perguntas');
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="p-6">
// //                 <div className="loading-spinner" />
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="p-6 space-y-4">
// //             <div className="flex items-center justify-between">
// //                 <h3 className="text-lg font-semibold">Perguntas do produto</h3>
// //                 <div className="flex gap-2">
// //                     <button className="btn-secondary" onClick={onClose}>Fechar</button>
// //                     <button className="btn-primary" onClick={save}>Salvar</button>
// //                 </div>
// //             </div>

// //             {/* Templates iFood */}
// //             <div className="flex flex-wrap gap-2">
// //                 <button className="btn-secondary" onClick={() => addTemplate(TEMPLATES.SABORES_ATE_10)}>
// //                     + Sabores
// //                 </button>
// //                 <button className="btn-secondary" onClick={() => addTemplate(TEMPLATES.ADICIONAIS_PADRAO)}>
// //                     + Adicionais
// //                 </button>
// //                 <button className="btn-secondary" onClick={addPergunta}>
// //                     + Nova pergunta
// //                 </button>
// //                 <button className="btn-secondary" onClick={() => addTemplate(TEMPLATES.OBSERVACOES)}>
// //                     + Observações
// //                 </button>
// //             </div>

// //             {/* Lista */}
// //             {perguntas.length === 0 && (
// //                 <div className="text-gray-500">Nenhuma pergunta. Use um template ou crie uma nova.</div>
// //             )}

// //             <div className="space-y-4">
// //                 {perguntas.map((q) => (
// //                     <div key={q.id} className="border rounded-lg p-3">
// //                         <div className="flex items-center justify-between">
// //                             <div className="flex items-center gap-2">
// //                                 <GripVertical className="w-4 h-4 text-gray-400" />
// //                                 <div className="font-medium">{q.titulo || <i className="text-gray-400">Sem título</i>}</div>
// //                                 <span className="text-xs text-gray-500">({q.tipo})</span>
// //                             </div>
// //                             <div className="flex items-center gap-2">
// //                                 <button className="btn-secondary" onClick={() => move(q.id, -1)}>↑</button>
// //                                 <button className="btn-secondary" onClick={() => move(q.id, +1)}>↓</button>
// //                                 <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50" onClick={() => removePergunta(q.id)}>
// //                                     <Trash2 className="w-4 h-4" />
// //                                 </button>
// //                             </div>
// //                         </div>

// //                         {/* Básico */}
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
// //                             <div>
// //                                 <label className="text-xs text-gray-600">ID</label>
// //                                 <input className="input" value={q.id} onChange={e => updatePergunta(q.id, { id: e.target.value })} />
// //                             </div>
// //                             <div>
// //                                 <label className="text-xs text-gray-600">Título</label>
// //                                 <input className="input" value={q.titulo} onChange={e => updatePergunta(q.id, { titulo: e.target.value })} />
// //                             </div>
// //                             <div>
// //                                 <label className="text-xs text-gray-600">Tipo</label>
// //                                 <select className="input" value={q.tipo} onChange={e => updatePergunta(q.id, { tipo: e.target.value })}>
// //                                     <option value="single">single (única)</option>
// //                                     <option value="multiple">multiple (múltipla)</option>
// //                                     <option value="flavor">flavor (sabores)</option>
// //                                     <option value="quantity">quantity (com quantidade)</option>
// //                                     <option value="text">text (observações)</option>
// //                                 </select>
// //                             </div>
// //                             <label className="flex items-center gap-2">
// //                                 <input
// //                                     type="checkbox"
// //                                     checked={!!q.obrigatoria}
// //                                     onChange={e => updatePergunta(q.id, { obrigatoria: e.target.checked })}
// //                                 />
// //                                 <span className="text-sm">Obrigatória</span>
// //                             </label>

// //                             {q.tipo !== 'text' && (
// //                                 <>
// //                                     <div>
// //                                         <label className="text-xs text-gray-600">Min</label>
// //                                         <input type="number" className="input" value={q.min || 0} onChange={e => updatePergunta(q.id, { min: Number(e.target.value) })} />
// //                                     </div>
// //                                     <div>
// //                                         <label className="text-xs text-gray-600">Max (0=sem)</label>
// //                                         <input type="number" className="input" value={q.max || 0} onChange={e => updatePergunta(q.id, { max: Number(e.target.value) })} />
// //                                     </div>
// //                                 </>
// //                             )}

// //                             {q.tipo === 'flavor' && (
// //                                 <>
// //                                     <div>
// //                                         <label className="text-xs text-gray-600">Fracionamento</label>
// //                                         <input type="number" className="input" value={q.fracionamento || 1}
// //                                             onChange={e => updatePergunta(q.id, { fracionamento: Number(e.target.value) })} />
// //                                     </div>
// //                                     <div>
// //                                         <label className="text-xs text-gray-600">Regra de preço</label>
// //                                         <select className="input" value={q.pricingRule || 'maior'}
// //                                             onChange={e => updatePergunta(q.id, { pricingRule: e.target.value })}>
// //                                             <option value="maior">Maior</option>
// //                                             <option value="media">Média</option>
// //                                             <option value="soma">Soma proporcional</option>
// //                                         </select>
// //                                     </div>
// //                                 </>
// //                             )}

// //                             {q.tipo === 'text' && (
// //                                 <div className="md:col-span-2">
// //                                     <label className="text-xs text-gray-600">Placeholder</label>
// //                                     <input className="input" value={q.placeholder || ''} onChange={e => updatePergunta(q.id, { placeholder: e.target.value })} />
// //                                 </div>
// //                             )}
// //                         </div>

// //                         {q.tipo !== 'text' && (
// //                             <OptionEditor
// //                                 tipo={q.tipo}
// //                                 opcoes={q.opcoes || []}
// //                                 onChange={(opcoes) => updatePergunta(q.id, { opcoes })}
// //                             />
// //                         )}
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // }

// // function OptionEditor({ tipo, opcoes, onChange }) {
// //     const [local, setLocal] = useState(opcoes || []);
// //     useEffect(() => setLocal(opcoes || []), [opcoes]);

// //     const add = () => setLocal(prev => [...prev, {
// //         id: `op_${Math.random().toString(36).slice(2, 7)}`,
// //         label: '',
// //         deltaPreco: 0,
// //         selecionadaPorPadrao: false,
// //         ...(tipo === 'quantity' ? { qtyMin: 0, qtyMax: 0, qtyStep: 1, defaultQty: 0 } : {})
// //     }]);

// //     const update = (idx, patch) => setLocal(prev => prev.map((o, i) => i === idx ? { ...o, ...patch } : o));
// //     const remove = (idx) => setLocal(prev => prev.filter((_, i) => i !== idx));

// //     useEffect(() => onChange?.(local), [local]);

// //     return (
// //         <div className="mt-3">
// //             <div className="text-xs font-medium text-gray-600 mb-2">Opções</div>
// //             <div className="space-y-2">
// //                 {local.map((op, idx) => (
// //                     <div key={op.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
// //                         <input className="input md:col-span-2" placeholder="Rótulo" value={op.label}
// //                             onChange={e => update(idx, { label: e.target.value })} />
// //                         <input className="input" type="number" step="0.01" placeholder="Δ Preço"
// //                             value={op.deltaPreco} onChange={e => update(idx, { deltaPreco: Number(e.target.value) })} />

// //                         {tipo === 'quantity' ? (
// //                             <>
// //                                 <input className="input" type="number" placeholder="qtyMin"
// //                                     value={op.qtyMin || 0} onChange={e => update(idx, { qtyMin: Number(e.target.value) })} />
// //                                 <input className="input" type="number" placeholder="qtyMax (0=sem)"
// //                                     value={op.qtyMax || 0} onChange={e => update(idx, { qtyMax: Number(e.target.value) })} />
// //                                 <input className="input" type="number" placeholder="step"
// //                                     value={op.qtyStep || 1} onChange={e => update(idx, { qtyStep: Number(e.target.value) })} />
// //                             </>
// //                         ) : (
// //                             <label className="text-xs flex items-center gap-2">
// //                                 <input type="checkbox" checked={!!op.selecionadaPorPadrao}
// //                                     onChange={e => update(idx, { selecionadaPorPadrao: e.target.checked })} />
// //                                 Padrão?
// //                             </label>
// //                         )}

// //                         <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
// //                             onClick={() => remove(idx)}>
// //                             <Trash2 className="w-4 h-4" />
// //                         </button>
// //                     </div>
// //                 ))}
// //             </div>

// //             <button className="btn-secondary mt-2" onClick={add}>
// //                 <Plus className="w-4 h-4" /> Adicionar opção
// //             </button>
// //         </div>
// //     );
// // }












// import React, { useEffect, useState } from 'react'
// import { Plus, Trash2, GripVertical } from 'lucide-react'
// import ApiService from '../services/api'

// export const TEMPLATES = {
//   ADICIONAIS_QTY: () => ({
//     id: `qgrp_adicionais_${Math.random().toString(36).slice(2, 6)}`,
//     titulo: 'Adicionais',
//     subtitulo: 'Escolha até 5 opções',
//     tipo: 'quantity',          // quantity = com “+/-”
//     obrigatoria: false,
//     min: 0,
//     max: 5,
//     opcoes: [
//       { id: 'add_carne_trad', label: 'Carne Tradicional', descricao: 'Hambúrguer Tradicional', deltaPreco: 6.5, qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 },
//       { id: 'add_banana', label: 'Banana', descricao: 'Frita na Chapa', deltaPreco: 5, qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 },
//       { id: 'add_calabresa', label: 'Calabresa', descricao: 'Calabresa Frita na Chapa', deltaPreco: 6, qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 },
//       { id: 'add_carne_150g', label: 'Carne Caseira 150g', descricao: 'Carne Caseira 150g', deltaPreco: 13, qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 }
//     ]
//   }),
//   OBSERVACOES: () => ({
//     id: `qgrp_obs_${Math.random().toString(36).slice(2, 6)}`,
//     titulo: 'Observações',
//     subtitulo: 'Diga como quer seu pedido',
//     tipo: 'text',
//     obrigatoria: false,
//     placeholder: 'Ex: sem cebola, massa fina'
//   }),
//   SABORES_ATE_10: () => ({
//     id: `q_sabores_${Math.random().toString(36).slice(2, 6)}`,
//     titulo: 'Escolha os sabores',
//     subtitulo: 'Escolha até 10 sabores',
//     tipo: 'flavor',
//     obrigatoria: true,
//     min: 1,
//     max: 10,
//     fracionamento: 10,
//     pricingRule: 'maior', // maior | media | soma
//     opcoes: [
//       { id: 'sab_calabresa', label: 'Calabresa', deltaPreco: 0 },
//       { id: 'sab_frango_catupiry', label: 'Frango c/ Catupiry', deltaPreco: 3 },
//       { id: 'sab_portuguesa', label: 'Portuguesa', deltaPreco: 2 },
//       { id: 'sab_marguerita', label: 'Marguerita', deltaPreco: 0 },
//       { id: 'sab_bacon', label: 'Bacon', deltaPreco: 2 },
//       { id: 'sab_quatro_queijos', label: '4 Queijos', deltaPreco: 4 },
//       { id: 'sab_milho', label: 'Milho', deltaPreco: 1 },
//       { id: 'sab_palmito', label: 'Palmito', deltaPreco: 2 },
//       { id: 'sab_pepperoni', label: 'Pepperoni', deltaPreco: 3 },
//       { id: 'sab_atum', label: 'Atum', deltaPreco: 2 }
//     ]
//   })
// }

// /**
//  * Modo A (normal): passar { product, onSaved, onClose, showSuccess, showError }
//  * Modo B (inline): passar { inline: true, value, onChange }  (não chama API)
//  */
// export default function ProductQuestionsEditor(props) {
//   const inline = !!props.inline
//   const [loading, setLoading] = useState(!inline)
//   const [perguntas, setPerguntas] = useState(props.value || [])

//   // modo normal: carrega do backend
//   useEffect(() => {
//     if (!inline && props.product?.id) {
//       (async () => {
//         try {
//           setLoading(true)
//           const list = await ApiService.getProductQuestions(props.product.id)
//           setPerguntas(Array.isArray(list) ? list : [])
//         } catch {
//           props.showError?.('Erro ao carregar perguntas')
//         } finally {
//           setLoading(false)
//         }
//       })()
//     }
//   }, [inline, props.product?.id])

//   // modo inline: reflete para o pai
//   useEffect(() => {
//     if (inline) props.onChange?.(perguntas)
//   }, [inline, perguntas])

//   const addPerguntaVazia = () =>
//     setPerguntas(prev => [...prev, {
//       id: `q_${Math.random().toString(36).slice(2, 7)}`,
//       titulo: '',
//       subtitulo: '',
//       tipo: 'single',
//       obrigatoria: false,
//       min: 0,
//       max: 1,
//       fracionamento: 1,
//       pricingRule: 'maior',
//       opcoes: []
//     }])

//   const addTemplate = (tpl) => setPerguntas(prev => [...prev, tpl()])
//   const removePergunta = (id) => setPerguntas(prev => prev.filter(p => p.id !== id))
//   const move = (id, dir) => {
//     const idx = perguntas.findIndex(p => p.id === id)
//     if (idx < 0) return
//     const arr = [...perguntas]
//     const j = idx + dir
//     if (j < 0 || j >= arr.length) return
//     const tmp = arr[idx]; arr[idx] = arr[j]; arr[j] = tmp
//     setPerguntas(arr)
//   }
//   const updatePergunta = (id, patch) =>
//     setPerguntas(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))

//   const salvarNoBackend = async () => {
//     try {
//       await ApiService.updateProductQuestions(props.product.id, perguntas)
//       props.showSuccess?.('Perguntas salvas!')
//       props.onSaved?.()
//       props.onClose?.()
//     } catch (e) {
//       props.showError?.(e.message || 'Erro ao salvar perguntas')
//     }
//   }

//   if (!inline && loading) return <div className="p-6"><div className="loading-spinner" /></div>

//   return (
//     <div className="p-6 space-y-4">
//       {!inline && (
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold">Perguntas do produto</h3>
//           <div className="flex gap-2">
//             <button className="btn-secondary" onClick={props.onClose}>Fechar</button>
//             <button className="btn-primary" onClick={salvarNoBackend}>Salvar</button>
//           </div>
//         </div>
//       )}

//       {/* Templates rápidos */}
//       <div className="flex flex-wrap gap-2">
//         <button className="btn-secondary" onClick={() => addTemplate(TEMPLATES.SABORES_ATE_10)}>+ Sabores</button>
//         <button className="btn-secondary" onClick={() => addTemplate(TEMPLATES.ADICIONAIS_QTY)}>+ Adicionais (quantidade)</button>
//         <button className="btn-secondary" onClick={() => addTemplate(TEMPLATES.OBSERVACOES)}>+ Observações</button>
//         <button className="btn-secondary" onClick={addPerguntaVazia}>+ Nova pergunta</button>
//       </div>

//       {perguntas.length === 0 && (
//         <div className="text-gray-500">Nenhuma pergunta. Use um template ou crie uma nova.</div>
//       )}

//       <div className="space-y-4">
//         {perguntas.map(q => (
//           <div key={q.id} className="border rounded-lg p-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <GripVertical className="w-4 h-4 text-gray-400" />
//                 <div className="font-medium">{q.titulo || <i className="text-gray-400">Sem título</i>}</div>
//                 <span className="text-xs text-gray-500">({q.tipo})</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button className="btn-secondary" onClick={() => move(q.id, -1)}>↑</button>
//                 <button className="btn-secondary" onClick={() => move(q.id, +1)}>↓</button>
//                 <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50" onClick={() => removePergunta(q.id)}>
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Básico */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
//               <div>
//                 <label className="text-xs text-gray-600">ID</label>
//                 <input className="input" value={q.id} onChange={e => updatePergunta(q.id, { id: e.target.value })} />
//               </div>
//               <div>
//                 <label className="text-xs text-gray-600">Título</label>
//                 <input className="input" value={q.titulo || ''} onChange={e => updatePergunta(q.id, { titulo: e.target.value })} />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="text-xs text-gray-600">Subtítulo</label>
//                 <input className="input" value={q.subtitulo || ''} onChange={e => updatePergunta(q.id, { subtitulo: e.target.value })} />
//               </div>
//               <div>
//                 <label className="text-xs text-gray-600">Tipo</label>
//                 <select className="input" value={q.tipo} onChange={e => updatePergunta(q.id, { tipo: e.target.value })}>
//                   <option value="single">single (única)</option>
//                   <option value="multiple">multiple (múltipla)</option>
//                   <option value="flavor">flavor (sabores)</option>
//                   <option value="quantity">quantity (com quantidade)</option>
//                   <option value="text">text (observações)</option>
//                 </select>
//               </div>
//               <label className="flex items-center gap-2">
//                 <input type="checkbox" checked={!!q.obrigatoria} onChange={e => updatePergunta(q.id, { obrigatoria: e.target.checked })} />
//                 <span className="text-sm">Obrigatória</span>
//               </label>

//               {q.tipo !== 'text' && (
//                 <>
//                   <div>
//                     <label className="text-xs text-gray-600">Min</label>
//                     <input type="number" className="input" value={q.min || 0} onChange={e => updatePergunta(q.id, { min: Number(e.target.value) })} />
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-600">Max (0=sem)</label>
//                     <input type="number" className="input" value={q.max || 0} onChange={e => updatePergunta(q.id, { max: Number(e.target.value) })} />
//                   </div>
//                 </>
//               )}

//               {q.tipo === 'flavor' && (
//                 <>
//                   <div>
//                     <label className="text-xs text-gray-600">Fracionamento</label>
//                     <input type="number" className="input" value={q.fracionamento || 1} onChange={e => updatePergunta(q.id, { fracionamento: Number(e.target.value) })} />
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-600">Regra de preço</label>
//                     <select className="input" value={q.pricingRule || 'maior'} onChange={e => updatePergunta(q.id, { pricingRule: e.target.value })}>
//                       <option value="maior">Maior</option>
//                       <option value="media">Média</option>
//                       <option value="soma">Soma proporcional</option>
//                     </select>
//                   </div>
//                 </>
//               )}

//               {q.tipo === 'text' && (
//                 <div className="md:col-span-2">
//                   <label className="text-xs text-gray-600">Placeholder</label>
//                   <input className="input" value={q.placeholder || ''} onChange={e => updatePergunta(q.id, { placeholder: e.target.value })} />
//                 </div>
//               )}
//             </div>

//             {q.tipo !== 'text' && (
//               <OptionEditor
//                 tipo={q.tipo}
//                 opcoes={q.opcoes || []}
//                 onChange={(opcoes) => updatePergunta(q.id, { opcoes })}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// function OptionEditor({ tipo, opcoes, onChange }) {
//   const [local, setLocal] = useState(opcoes || [])
//   useEffect(() => setLocal(opcoes || []), [opcoes])

//   const add = () => setLocal(prev => [...prev, {
//     id: `op_${Math.random().toString(36).slice(2, 7)}`,
//     label: '',
//     descricao: '',
//     deltaPreco: 0,
//     selecionadaPorPadrao: false,
//     ...(tipo === 'quantity' ? { qtyMin: 0, qtyMax: 0, qtyStep: 1, defaultQty: 0 } : {})
//   }])

//   const update = (idx, patch) => setLocal(prev => prev.map((o, i) => i === idx ? { ...o, ...patch } : o))
//   const remove = (idx) => setLocal(prev => prev.filter((_, i) => i !== idx))
//   useEffect(() => onChange?.(local), [local])

//   return (
//     <div className="mt-3">
//       <div className="text-xs font-medium text-gray-600 mb-2">Opções</div>
//       <div className="space-y-2">
//         {local.map((op, idx) => (
//           <div key={op.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end">
//             <input className="input md:col-span-2" placeholder="Rótulo" value={op.label}
//               onChange={e => update(idx, { label: e.target.value })} />
//             <input className="input md:col-span-2" placeholder="Descrição (subtítulo)"
//               value={op.descricao || ''} onChange={e => update(idx, { descricao: e.target.value })} />
//             <input className="input" type="number" step="0.01" placeholder="Δ Preço"
//               value={op.deltaPreco} onChange={e => update(idx, { deltaPreco: Number(e.target.value) })} />

//             {tipo === 'quantity' ? (
//               <>
//                 <input className="input" type="number" placeholder="qtyMin"
//                   value={op.qtyMin || 0} onChange={e => update(idx, { qtyMin: Number(e.target.value) })} />
//                 <input className="input" type="number" placeholder="qtyMax (0=sem)"
//                   value={op.qtyMax || 0} onChange={e => update(idx, { qtyMax: Number(e.target.value) })} />
//                 <input className="input" type="number" placeholder="step"
//                   value={op.qtyStep || 1} onChange={e => update(idx, { qtyStep: Number(e.target.value) })} />
//               </>
//             ) : (
//               <label className="text-xs flex items-center gap-2">
//                 <input type="checkbox" checked={!!op.selecionadaPorPadrao}
//                   onChange={e => update(idx, { selecionadaPorPadrao: e.target.checked })} />
//                 Padrão?
//               </label>
//             )}

//             <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
//               onClick={() => remove(idx)}>
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>

//       <button className="btn-secondary mt-2" onClick={add}>
//         <Plus className="w-4 h-4" /> Adicionar opção
//       </button>
//     </div>
//   )
// }



import React, { useEffect, useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import ApiService from '../services/api'

export const TEMPLATES = {
  ADICIONAIS_QTY: () => ({
    id: `qgrp_adicionais_${Math.random().toString(36).slice(2, 6)}`,
    titulo: 'Adicionais',
    subtitulo: 'Escolha até 5 opções',
    tipo: 'quantity',
    obrigatoria: false,
    min: 0,
    max: 5,
    opcoes: [
      { id: 'add_carne_trad', label: 'Carne Tradicional', descricao: 'Hambúrguer Tradicional', deltaPreco: 6.5, qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 },
      { id: 'add_banana',      label: 'Banana',            descricao: 'Frita na Chapa',          deltaPreco: 5,   qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 },
      { id: 'add_calabresa',   label: 'Calabresa',         descricao: 'Calabresa Frita na Chapa',deltaPreco: 6,   qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 },
      { id: 'add_carne_150g',  label: 'Carne Caseira 150g',descricao: 'Carne Caseira 150g',      deltaPreco: 13,  qtyMin: 0, qtyMax: 5, qtyStep: 1, defaultQty: 0 }
    ]
  }),
  OBSERVACOES: () => ({
    id: `qgrp_obs_${Math.random().toString(36).slice(2, 6)}`,
    titulo: 'Observações',
    subtitulo: 'Diga como quer seu pedido',
    tipo: 'text',
    obrigatoria: false,
    placeholder: 'Ex: sem cebola, massa fina'
  }),
  SABORES_ATE_10: () => ({
    id: `q_sabores_${Math.random().toString(36).slice(2, 6)}`,
    titulo: 'Escolha os sabores',
    subtitulo: 'Escolha até 10 sabores',
    tipo: 'flavor',
    obrigatoria: true,
    min: 1,
    max: 10,
    fracionamento: 10,
    pricingRule: 'maior', // maior | media | soma
    opcoes: [
      { id: 'sab_calabresa', label: 'Calabresa', deltaPreco: 0 },
      { id: 'sab_frango_catupiry', label: 'Frango c/ Catupiry', deltaPreco: 3 },
      { id: 'sab_portuguesa', label: 'Portuguesa', deltaPreco: 2 },
      { id: 'sab_marguerita', label: 'Marguerita', deltaPreco: 0 },
      { id: 'sab_bacon', label: 'Bacon', deltaPreco: 2 },
      { id: 'sab_quatro_queijos', label: '4 Queijos', deltaPreco: 4 },
      { id: 'sab_milho', label: 'Milho', deltaPreco: 1 },
      { id: 'sab_palmito', label: 'Palmito', deltaPreco: 2 },
      { id: 'sab_pepperoni', label: 'Pepperoni', deltaPreco: 3 },
      { id: 'sab_atum', label: 'Atum', deltaPreco: 2 }
    ]
  })
}

/**
 * Modo A (normal): { product, onSaved, onClose, showSuccess, showError }
 * Modo B (inline): { inline: true, value, onChange }  (não chama API)
 */
export default function ProductQuestionsEditor(props) {
  const inline = !!props.inline
  const [loading, setLoading] = useState(!inline)
  const [perguntas, setPerguntas] = useState(props.value || [])

  // carrega do backend (modo normal)
  useEffect(() => {
    if (!inline && props.product?.id) {
      (async () => {
        try {
          setLoading(true)
          const list = await ApiService.getProductQuestions(props.product.id)
          setPerguntas(Array.isArray(list) ? list : [])
        } catch {
          props.showError?.('Erro ao carregar perguntas')
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [inline, props.product?.id])

  // reflete para o pai (inline)
  useEffect(() => {
    if (inline) props.onChange?.(perguntas)
  }, [inline, perguntas])

  const addPerguntaVazia = () =>
    setPerguntas(prev => [...prev, {
      id: `q_${Math.random().toString(36).slice(2, 7)}`,
      titulo: '',
      subtitulo: '',
      tipo: 'single',
      obrigatoria: false,
      min: 0,
      max: 1,
      fracionamento: 1,
      pricingRule: 'maior',
      opcoes: []
    }])

  const addTemplate   = (tpl) => setPerguntas(prev => [...prev, tpl()])
  const removePergunta = (id) => setPerguntas(prev => prev.filter(p => p.id !== id))
  const move = (id, dir) => {
    const idx = perguntas.findIndex(p => p.id === id)
    if (idx < 0) return
    const arr = [...perguntas]
    const j = idx + dir
    if (j < 0 || j >= arr.length) return
    const tmp = arr[idx]; arr[idx] = arr[j]; arr[j] = tmp
    setPerguntas(arr)
  }
  const updatePergunta = (id, patch) =>
    setPerguntas(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))

  const salvarNoBackend = async () => {
    try {
      await ApiService.updateProductQuestions(props.product.id, perguntas)
      props.showSuccess?.('Perguntas salvas!')
      props.onSaved?.()
      props.onClose?.()
    } catch (e) {
      props.showError?.(e.message || 'Erro ao salvar perguntas')
    }
  }

  if (!inline && loading) {
    return <div className="p-6"><div className="loading-spinner" /></div>
  }

  return (
    <div className="p-6 space-y-4">
      {!inline && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Perguntas do produto</h3>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={props.onClose}>Fechar</button>
            <button type="button" className="btn-primary" onClick={salvarNoBackend}>Salvar</button>
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={() => addTemplate(TEMPLATES.SABORES_ATE_10)}>+ Sabores</button>
        <button type="button" className="btn-secondary" onClick={() => addTemplate(TEMPLATES.ADICIONAIS_QTY)}>+ Adicionais</button>
        <button type="button" className="btn-secondary" onClick={() => addTemplate(TEMPLATES.OBSERVACOES)}>+ Observações</button>
        <button type="button" className="btn-secondary" onClick={addPerguntaVazia}>+ Nova pergunta</button>
      </div>

      {perguntas.length === 0 && (
        <div className="text-gray-500">Nenhuma pergunta. Use um template ou crie uma nova.</div>
      )}

      <div className="space-y-4">
        {perguntas.map(q => (
          <div key={q.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <div className="font-medium">{q.titulo || <i className="text-gray-400">Sem título</i>}</div>
                <span className="text-xs text-gray-500">({q.tipo})</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-secondary" onClick={() => move(q.id, -1)}>↑</button>
                <button type="button" className="btn-secondary" onClick={() => move(q.id, +1)}>↓</button>
                <button
                  type="button"
                  className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  onClick={() => removePergunta(q.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Básico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs text-gray-600">ID</label>
                <input className="input" value={q.id} onChange={e => updatePergunta(q.id, { id: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-600">Título</label>
                <input className="input" value={q.titulo || ''} onChange={e => updatePergunta(q.id, { titulo: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">Subtítulo</label>
                <input className="input" value={q.subtitulo || ''} onChange={e => updatePergunta(q.id, { subtitulo: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-600">Tipo</label>
                <select className="input" value={q.tipo} onChange={e => updatePergunta(q.id, { tipo: e.target.value })}>
                  <option value="single">single (única)</option>
                  <option value="multiple">multiple (múltipla)</option>
                  <option value="flavor">flavor (sabores)</option>
                  <option value="quantity">quantity (com quantidade)</option>
                  <option value="text">text (observações)</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!q.obrigatoria} onChange={e => updatePergunta(q.id, { obrigatoria: e.target.checked })} />
                <span className="text-sm">Obrigatória</span>
              </label>

              {q.tipo !== 'text' && (
                <>
                  <div>
                    <label className="text-xs text-gray-600">Min</label>
                    <input type="number" className="input" value={q.min || 0} onChange={e => updatePergunta(q.id, { min: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max (0=sem)</label>
                    <input type="number" className="input" value={q.max || 0} onChange={e => updatePergunta(q.id, { max: Number(e.target.value) })} />
                  </div>
                </>
              )}

              {q.tipo === 'flavor' && (
                <>
                  <div>
                    <label className="text-xs text-gray-600">Fracionamento</label>
                    <input type="number" className="input" value={q.fracionamento || 1} onChange={e => updatePergunta(q.id, { fracionamento: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Regra de preço</label>
                    <select className="input" value={q.pricingRule || 'maior'} onChange={e => updatePergunta(q.id, { pricingRule: e.target.value })}>
                      <option value="maior">Maior</option>
                      <option value="media">Média</option>
                      <option value="soma">Soma proporcional</option>
                    </select>
                  </div>
                </>
              )}

              {q.tipo === 'text' && (
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Placeholder</label>
                  <input className="input" value={q.placeholder || ''} onChange={e => updatePergunta(q.id, { placeholder: e.target.value })} />
                </div>
              )}
            </div>

            {q.tipo !== 'text' && (
              <OptionEditor
                tipo={q.tipo}
                opcoes={q.opcoes || []}
                onChange={(opcoes) => updatePergunta(q.id, { opcoes })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function OptionEditor({ tipo, opcoes, onChange }) {
  const [local, setLocal] = useState(opcoes || [])
  useEffect(() => setLocal(opcoes || []), [opcoes])

  const add = () => setLocal(prev => [...prev, {
    id: `op_${Math.random().toString(36).slice(2, 7)}`,
    label: '',
    descricao: '',
    deltaPreco: 0,
    selecionadaPorPadrao: false,
    ...(tipo === 'quantity' ? { qtyMin: 0, qtyMax: 0, qtyStep: 1, defaultQty: 0 } : {})
  }])

  const update = (idx, patch) => setLocal(prev => prev.map((o, i) => i === idx ? { ...o, ...patch } : o))
  const remove = (idx) => setLocal(prev => prev.filter((_, i) => i !== idx))
  useEffect(() => onChange?.(local), [local])

  return (
    <div className="mt-3">
      <div className="text-xs font-medium text-gray-600 mb-2">Opções</div>
      <div className="space-y-2">
        {local.map((op, idx) => (
          <div key={op.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end">
            <input className="input md:col-span-2" placeholder="Rótulo" value={op.label}
              onChange={e => update(idx, { label: e.target.value })} />
            <input className="input md:col-span-2" placeholder="Descrição (subtítulo)"
              value={op.descricao || ''} onChange={e => update(idx, { descricao: e.target.value })} />
            <input className="input" type="number" step="0.01" placeholder="Δ Preço"
              value={op.deltaPreco} onChange={e => update(idx, { deltaPreco: Number(e.target.value) })} />

            {tipo === 'quantity' ? (
              <>
                <input className="input" type="number" placeholder="qtyMin"
                  value={op.qtyMin || 0} onChange={e => update(idx, { qtyMin: Number(e.target.value) })} />
                <input className="input" type="number" placeholder="qtyMax (0=sem)"
                  value={op.qtyMax || 0} onChange={e => update(idx, { qtyMax: Number(e.target.value) })} />
                <input className="input" type="number" placeholder="step"
                  value={op.qtyStep || 1} onChange={e => update(idx, { qtyStep: Number(e.target.value) })} />
              </>
            ) : (
              <label className="text-xs flex items-center gap-2">
                <input type="checkbox" checked={!!op.selecionadaPorPadrao}
                  onChange={e => update(idx, { selecionadaPorPadrao: e.target.checked })} />
                Padrão?
              </label>
            )}

            <button
              type="button"
              className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              onClick={() => remove(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn-secondary mt-2" onClick={add}>
        + Adicionar opção
      </button>
    </div>
  )
}
