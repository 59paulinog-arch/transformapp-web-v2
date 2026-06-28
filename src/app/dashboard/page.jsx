'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProgress, completeStage, logout } from '../../store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Bell, BookOpen, User, ChevronRight, Play, LogOut } from 'lucide-react';

const STAGES = [
  { name: 'Mayordomía', ico: '🏛️', quote: 'La autoridad espiritual para iniciar tu transformación.',
    principles: ['Origen: eres creación de Dios, no un accidente.','Propiedad: tu tiempo y talentos son administración, no posesión.','Identidad: tu valor no depende de tu rendimiento.','Propósito: fuiste creado para algo específico.','Responsabilidad: la decisión de ser fiel es irrenunciablemente tuya.'],
    story: 'Marcos tenía 41 años y carrera sólida. Su hija preguntó: «Papá, ¿por qué siempre estás cansado?» Esa noche abrió el Salmo 139. Hoy acompaña a más de 60 familias al año.',
    storyQuote: '«No cambié porque mi vida era mala. Cambié porque había una historia mejor esperando.»',
    science: [['Teología','Imago Dei: la dignidad y autoridad moral para el cambio.'],['Psicología','Frankl: quienes identifican un propósito poseen resiliencia extraordinaria.'],['Neurociencia','Newberg (2010): la práctica espiritual activa el córtex prefrontal.']],
    exercises: ['¿Cuál de los cinco principios necesitas interiorizar con mayor urgencia?','Redacta tu Declaración de Mayordomía Personal.'] },
  { name: 'Conceptos',  ico: '💡', quote: 'El poder de los conceptos que renuevan la mente.', principles:['Lee con propósito: busca ideas que respondan a preguntas reales.','Escucha con atención plena: apaga el piloto automático mental.','Toma notas reflexivas: escribir solidifica la comprensión.','Medita y reflexiona: deja que las ideas pasen al corazón.'], story:'Ana luchaba con su hijo adolescente. En un retiro escuchó: «Los adolescentes no se rebelan contra sus padres. Se rebelan contra la distancia que perciben en ellos.» Tres años después su hijo empezó a confiar en ella.', storyQuote:'«Un solo concepto, procesado con honestidad y aplicado con consistencia, puede cambiar la historia de una familia.»', science:[['Psicología','Piaget: cuando nueva información contradice esquemas, se produce acomodación profunda.'],['Neurociencia','Hebb: las neuronas que se activan juntas, se conectan juntas.'],['Teología','Romanos 12:2: transformaos por la renovación de vuestro entendimiento.']], exercises:['¿Qué concepto ha producido el mayor impacto transformador en tu vida?','Comienza tu diario de conceptos transformadores.'] },
  { name: 'Inspiración',ico: '✨', quote: 'La chispa que enciende el deseo de cambiar.', principles:['Testimonios de transformación activan la elevación moral.','El dolor que dice «ya no más» es una forma de gracia.','La oración y la Escritura producen claridad que trasciende lo racional.','Las palabras de un mentor que te conoce son transformadoras.'], story:'Rafael quedó desempleado a los 39. Un martes sacó una guitarra sin tocar por 7 años. Hoy lidera un conjunto de adoración con dos álbumes.', storyQuote:'«La pérdida de mi carrera fue la inspiración que me faltaba para descubrir una historia más verdadera.»', science:[['Psic. Positiva','Thrash & Elliot: la inspiración tiene evocación, motivación y trascendencia.'],['Neurociencia','Keltner & Haidt: el asombro genera apertura al cambio.'],['Pneumatología','Juan 16: el Espíritu produce convicción profunda de identidad y propósito.']], exercises:['¿Cuál es el momento en que te has sentido más inspirado a cambiar?','Escribe tu declaración de visión: ¿quién quieres ser en 5 años?'] },
  { name: 'Motivación', ico: '🔥', quote: 'Las razones que sostienen el proceso.', principles:['Aplica los 5 Porqués para llegar a tu razón más profunda.','Escribe tus razones profundas en lugares visibles.','Ritual matutino: 5 min releyendo tu declaración de propósito.','Celebra el progreso por pequeño que sea.'], story:'Carmen nunca había corrido más de 2 km. Su nieta preguntó: «¿Estarás sana para mi graduación?» 18 meses después cruzó su primer medio maratón.', storyQuote:'«Cuando la razón era el amor, ningún día difícil pudo detenerme.»', science:[['Psicología','Deci & Ryan: la motivación intrínseca produce resultados más duraderos.'],['Fil. Existencial','Frankl: «Quien tiene un por qué puede soportar casi cualquier cómo.»'],['Teología','Jeremías 29:11: «Yo sé los planes que tengo para vosotros.»']], exercises:['Aplica los 5 Porqués a tu meta más importante.','Escríbele una carta a la persona cuya vida será impactada por tu cambio.'] },
  { name: 'Decisión',   ico: '⚔️', quote: 'La voluntad que compromete el rumbo.', principles:['Nivel 1 — Intención: «me gustaría cambiar». Sin compromiso real.','Nivel 2 — Intento: «voy a intentarlo». Tiene salida de emergencia.','Nivel 3 — Compromiso: «lo haré, independientemente de las circunstancias».','Diseña tu entorno para que la decisión correcta sea el camino de menor resistencia.'], story:'David creció con violencia intrafamiliar. A los 19 dijo: «Esto termina aquí.» Dieciocho años después, ninguno de sus 3 hijos lo ha visto ebrio.', storyQuote:'«No te pido que intentes. Te pido que decidas. Son cosas completamente distintas.»', science:[['Psic. Social','Baumeister: la voluntad funciona como músculo — se fatiga pero se fortalece.'],['Psic. Decisión','Kahneman: las decisiones genuinas requieren activar el Sistema 2 deliberado.'],['Teología','Filipenses 2:12-13: «Dios produce en vosotros tanto el querer como el hacer.»']], exercises:['¿Hay una decisión que llevas posponiendo? ¿En qué nivel estás?','Escribe una Declaración de Compromiso con fecha límite específica.'] },
  { name: 'Acción',     ico: '⚡', quote: 'Los hábitos que consolidan el cambio.', principles:['Empieza pequeño: un hábito mínimo que se cumple supera a uno ambicioso abandonado.','Un hábito a la vez: el cerebro no puede establecer múltiples hábitos nuevos.','Consistencia sobre intensidad: 10 min diarios durante 66 días supera 2 horas en una semana.','Habit stacking: «después de [hábito existente], haré [nuevo hábito]».'], story:'El padre Tomás decidió mejorar en el púlpito. Su método: una página bíblica cada mañana sin falta. Al mes cuatro algo cambió. Tres años después recibía invitaciones de otras iglesias.', storyQuote:'«Una página al día. Todos los días. Nunca perfecta, nunca salteada.»', science:[['Neurociencia','Graybiel — MIT: los hábitos migran al estriado dorsolateral con la repetición.'],['Psicología','Lally — UCL: los hábitos tardan en promedio 66 días en automatizarse.'],['Psic. Aplicada','BJ Fogg: anclar hábitos a conductas existentes acelera el proceso.']], exercises:['¿Cuál es el hábito más importante para vivir tu propósito?','Crea un plan de 66 días con acciones y seguimiento visible.'] },
  { name: 'Formación',  ico: '🌱', quote: 'La práctica que forma el carácter.', principles:['Silencio y soledad: el silencio deliberado es profundamente formativo.','Servicio anónimo: servir sin reconocimiento forma la humildad genuina.','Gratitud sistemática: agradecer en días difíciles reentrena la percepción.','Rendición de cuentas: reportar a una persona de confianza regularmente.'], story:'Laura comenzó una pausa de 3 segundos antes de cada paciente: «Esta persona es alguien que Dios ama.» Hoy lidera el programa de humanización de su hospital.', storyQuote:'«Una práctica de 3 segundos, repetida miles de veces, transformó a Laura y a un equipo entero.»', science:[['Psic. Desarrollo','Kohlberg / Fowler: la madurez moral produce carácter que no depende de aprobación externa.'],['Fil. Moral','Aristóteles: la sabiduría práctica solo se adquiere mediante práctica real.'],['Form. Espiritual','Dallas Willard: las disciplinas espirituales entrenan al alma para responder desde su naturaleza profunda.']], exercises:['¿Cuáles son las prácticas formativas que más necesitas incorporar?','¿Estás en una comunidad que te forma?'] },
  { name: 'Carácter',   ico: '👑', quote: 'El resultado grabado en tu identidad.', principles:['Integridad: coherencia entre lo que se dice y hace cuando nadie observa.','Humildad: disposición a aprender sin necesidad de defender el ego.','Perseverancia: continuar cuando los resultados tardan.','Compasión: sensibilidad que produce acción, no solo sentimiento.'], story:'Roberto tuvo un infarto a los 61. Desde el hospital llegó al Salmo 139. A sus 65, un empleado joven dijo en su cena: «Don Roberto me enseñó que el éxito se mide en cómo tratas a las personas en sus peores momentos.»', storyQuote:'«Esos momentos en que elegí el amor sobre la eficiencia son mi legado real.»', science:[['Fil. Moral','Aristóteles: la virtud es disposición estable adquirida mediante práctica repetida.'],['Psic. Positiva','Peterson & Seligman: 24 fortalezas del carácter correlacionadas con bienestar.'],['Neurociencia','Lieberman: el cerebro está cableado para el impacto social como recompensa profunda.']], exercises:['¿Qué tres virtudes deseas que caractericen tu vida consistentemente?','Escribe tu declaración de carácter: los principios que guiarán tu vida.'] },
];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((s) => s.auth);
  const { stages, completed, percent, streak, area } = useSelector((s) => s.progress);
  const [activeStage, setActiveStage] = useState(null);
  const [stageTab, setStageTab] = useState('principios');

  useEffect(() => { dispatch(fetchProgress()); }, []);

  function statusOf(idx) { return stages.find((s) => s.stage_index === idx)?.status || 'locked'; }
  const activeIdx = stages.findIndex((s) => s.status === 'active');

  function handleLogout() { dispatch(logout()); router.push('/login'); }

  return (
    <div className="min-h-screen bg-surface-0">
      <nav className="bg-surface-2 border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-medium">↗</div>
            <span className="font-medium text-ink-primary">TransformApp</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.plan !== 'free' && (
              <span className="badge bg-primary-light text-primary-dark text-xs px-2 py-1">
                👑 {user?.plan === 'complete' ? 'Plan Completo' : 'Plan Básico'}
              </span>
            )}
            <Link href="/notifications"><Bell size={18} className="text-ink-muted hover:text-primary transition-colors" /></Link>
            <button onClick={handleLogout} className="text-ink-muted hover:text-danger transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            <div className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-ink-muted mb-1">Bienvenido de vuelta</p>
                  <h1 className="text-xl font-medium text-ink-primary">{user?.name?.split(' ')[0] || 'Viajero'} 👋</h1>
                  {area && <p className="text-sm text-ink-muted mt-1">{area.area_ico} Viaje de {area.area_name}</p>}
                </div>
                {user?.plan === 'free' && (
                  <Link href="/subscription" className="text-xs bg-primary text-white px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors">Actualizar plan</Link>
                )}
              </div>
              <div className="bg-surface-0 rounded-xl p-3">
                <div className="flex justify-between text-xs text-ink-muted mb-2">
                  <span className="font-medium">Tu viaje de transformación</span>
                  <span className="text-primary font-medium">{percent}%</span>
                </div>
                <div className="h-2 bg-border rounded-full">
                  <div className="h-2 bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.max(percent, 3)}%` }} />
                </div>
                <p className="text-xs text-ink-muted mt-2">{completed === 8 ? '¡Viaje completado! 🎉' : `${completed} de 8 etapas completadas`}</p>
              </div>
            </div>

            {activeIdx !== -1 && (
              <div className="bg-primary rounded-2xl p-5 text-white">
                <p className="text-xs text-primary-mid mb-1 font-medium uppercase tracking-wide">Continúa tu viaje</p>
                <h2 className="text-lg font-medium mb-1">Etapa {activeIdx + 1}: {STAGES[activeIdx]?.name}</h2>
                <p className="text-sm text-primary-mid mb-4">{STAGES[activeIdx]?.quote}</p>
                <button onClick={() => { setActiveStage(activeIdx); setStageTab('principios'); }}
                  className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors flex items-center gap-2">
                  <Play size={14} /> Continuar etapa
                </button>
              </div>
            )}

            <div>
              <p className="section-label">Las 8 etapas de tu viaje</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STAGES.map((s, i) => {
                  const status = statusOf(i);
                  const isDone = status === 'completed', isActive = status === 'active', isLocked = status === 'locked';
                  return (
                    <button key={i} onClick={() => !isLocked && (setActiveStage(i), setStageTab('principios'))} disabled={isLocked}
                      className={`text-left p-3 rounded-xl border transition-all ${isDone ? 'border-teal-mid bg-teal-light' : isActive ? 'border-primary border-2 bg-primary-light' : isLocked ? 'border-border bg-surface-1 opacity-50 cursor-not-allowed' : 'border-border bg-surface-2 hover:border-border-strong'}`}>
                      <p className="text-[9px] text-ink-muted mb-1 font-medium">ETAPA {i + 1}</p>
                      <p className="text-lg mb-1">{s.ico}</p>
                      <p className={`text-xs font-medium mb-2 ${isDone ? 'text-teal' : isActive ? 'text-primary-dark' : 'text-ink-primary'}`}>{s.name}</p>
                      <span className={`badge text-[9px] ${isDone ? 'bg-teal text-white' : isActive ? 'bg-primary text-white' : 'bg-surface-0 text-ink-muted border border-border'}`}>
                        {isDone ? '✓ Completa' : isActive ? 'En curso' : '🔒 Bloqueada'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {streak && (
              <div className="card p-4">
                <p className="section-label">Racha del viaje</p>
                <div className="flex gap-4">
                  <div className="text-center flex-1"><p className="text-3xl font-medium text-primary">{streak.current}</p><p className="text-xs text-ink-muted">días seguidos</p></div>
                  <div className="w-px bg-border" />
                  <div className="text-center flex-1"><p className="text-3xl font-medium text-primary">{streak.longest}</p><p className="text-xs text-ink-muted">mejor racha</p></div>
                </div>
              </div>
            )}
            <div className="card p-2 space-y-1">
              {[{ href:'/diary', ico:<BookOpen size={15}/>, label:'Diario de transformación' },
                { href:'/notifications', ico:<Bell size={15}/>, label:'Notificaciones' },
                { href:'/profile', ico:<User size={15}/>, label:'Mi perfil' },
                { href:'/subscription', ico:<Crown size={15}/>, label:'Mi suscripción' }
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-0 transition-colors group">
                  <span className="text-ink-muted group-hover:text-primary transition-colors">{item.ico}</span>
                  <span className="text-sm text-ink-secondary group-hover:text-ink-primary flex-1">{item.label}</span>
                  <ChevronRight size={13} className="text-ink-muted" />
                </Link>
              ))}
            </div>
            {user?.plan === 'free' && (
              <div className="bg-primary-light border border-primary-mid rounded-xl p-4">
                <Crown size={20} className="text-primary mb-2" />
                <p className="text-sm font-medium text-primary-dark mb-1">Desbloquea tu viaje completo</p>
                <p className="text-xs text-primary mb-3">Las 8 etapas, historias verídicas, fundamentos científicos y más.</p>
                <Link href="/subscription" className="block text-center bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors">Ver planes</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeStage !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-surface-2 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <button onClick={() => setActiveStage(null)} className="text-ink-muted hover:text-ink-secondary text-sm">← Volver</button>
              <div>
                <p className="text-[10px] text-ink-muted font-medium">ETAPA {activeStage + 1}</p>
                <p className="font-medium text-ink-primary">{STAGES[activeStage].ico} {STAGES[activeStage].name}</p>
              </div>
            </div>
            <div className="flex gap-1 px-4 pt-3 border-b border-border overflow-x-auto">
              {['principios','historia','ciencia','ejercicios'].map((t) => (
                <button key={t} onClick={() => setStageTab(t)}
                  className={`text-xs px-3 py-2 rounded-t-lg capitalize font-medium whitespace-nowrap transition-colors ${stageTab === t ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink-secondary'}`}>{t}</button>
              ))}
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {stageTab === 'principios' && (
                <div className="space-y-2">
                  <blockquote className="bg-primary-light border-l-4 border-primary rounded-r-xl p-3 text-sm text-primary-dark italic mb-4">"{STAGES[activeStage].quote}"</blockquote>
                  {STAGES[activeStage].principles.map((p) => (
                    <div key={p} className="flex gap-2 bg-surface-0 rounded-xl p-3 text-sm text-ink-primary">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />{p}
                    </div>
                  ))}
                </div>
              )}
              {stageTab === 'historia' && (
                <div className="bg-surface-0 rounded-xl p-4">
                  <p className="text-xs text-primary font-medium mb-3">📖 Historia verídica</p>
                  <p className="text-sm text-ink-primary leading-relaxed mb-3">{STAGES[activeStage].story}</p>
                  <p className="text-xs text-primary italic border-t border-primary-mid pt-3">{STAGES[activeStage].storyQuote}</p>
                </div>
              )}
              {stageTab === 'ciencia' && (
                <table className="w-full text-xs border-collapse">
                  <thead><tr className="bg-primary-light"><th className="text-left p-2 text-primary-dark font-medium">Disciplina</th><th className="text-left p-2 text-primary-dark font-medium">Fundamento</th></tr></thead>
                  <tbody>{STAGES[activeStage].science.map(([d,f]) => (<tr key={d} className="border-t border-border"><td className="p-2 font-medium text-primary align-top">{d}</td><td className="p-2 text-ink-secondary leading-relaxed">{f}</td></tr>))}</tbody>
                </table>
              )}
              {stageTab === 'ejercicios' && (
                <div className="space-y-3">
                  {STAGES[activeStage].exercises.map((q) => (
                    <div key={q} className="bg-surface-0 rounded-xl p-3">
                      <p className="text-sm text-ink-primary mb-2">{q}</p>
                      <textarea className="input-field resize-none h-20 text-xs" placeholder="Escribe tu reflexión aquí..." />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <button onClick={() => setActiveStage(null)} className="btn-secondary flex-none px-4 py-2.5 text-sm w-auto">Volver</button>
              <button onClick={() => { dispatch(completeStage(activeStage)); setActiveStage(null); }} className="btn-primary py-2.5 text-sm">Marcar completa ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
