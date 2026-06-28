'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.password.length >= 6;

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">↗</div>
          <h1 className="text-2xl font-medium text-ink-primary">Bienvenido de vuelta</h1>
          <p className="text-sm text-ink-muted mt-1">Continúa tu viaje de transformación</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {error && <div className="bg-danger-light text-danger text-sm p-3 rounded-xl">{error}</div>}

          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Correo electrónico</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@correo.com" className="input-field pl-9" autoComplete="email" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-ink-secondary">Contraseña</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-dark">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Tu contraseña" className="input-field pl-9 pr-10" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={!canSubmit || loading} className="btn-primary">
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border" /><span className="text-xs text-ink-muted">o continúa con</span><div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-xs">
              <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">G</span>Google
            </button>
            <button type="button" className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-xs">
              🍎 Apple
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          ¿No tienes cuenta? <Link href="/register" className="text-primary hover:text-primary-dark font-medium">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
