'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [termsOk, setTermsOk] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passOk = form.password.length >= 8;
  const canSubmit = form.name.trim() && emailOk && passOk && termsOk;

  function strength() {
    const p = form.password; let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }
  const str = strength();
  const strColors = ['bg-red-400', 'bg-amber-400', 'bg-teal-mid', 'bg-teal'];
  const strLabels = ['Muy débil', 'Débil', 'Buena', 'Fuerte'];
  const strTextColors = ['text-red-500', 'text-amber-500', 'text-teal', 'text-teal'];

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      router.push(`/verify-otp?userId=${result.payload.userId}&email=${encodeURIComponent(form.email)}`);
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">↗</div>
          <h1 className="text-2xl font-medium text-ink-primary">Crea tu cuenta</h1>
          <p className="text-sm text-ink-muted mt-1">Tu viaje de transformación empieza aquí</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {error && <div className="bg-danger-light text-danger text-sm p-3 rounded-xl">{error}</div>}

          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Nombre completo</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre" className="input-field" autoCapitalize="words" />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Correo electrónico</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@correo.com" className="input-field" autoComplete="email" />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Contraseña</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 8 caracteres" className="input-field pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <>
                <div className="flex gap-1 mt-2">
                  {[0,1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < str ? strColors[str-1] : 'bg-border'}`} />)}
                </div>
                <p className={`text-xs mt-1 ${strTextColors[str-1]}`}>{strLabels[str-1]}</p>
              </>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <div onClick={() => setTermsOk(!termsOk)}
              className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${termsOk ? 'bg-primary border-primary' : 'border-border'}`}>
              {termsOk && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className="text-xs text-ink-secondary leading-relaxed">
              Acepto los <span className="text-primary">Términos de uso</span> y la <span className="text-primary">Política de privacidad</span>
            </span>
          </label>

          <button type="submit" disabled={!canSubmit || loading} className="btn-primary">
            {loading ? 'Creando cuenta...' : 'Continuar'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          ¿Ya tienes cuenta? <Link href="/login" className="text-primary font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
