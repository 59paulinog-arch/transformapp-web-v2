'use client';
import { useState, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../../store';
import { useRouter, useSearchParams } from 'next/navigation';

function OTPForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('userId');
  const email = params.get('email');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleVerify() {
    setLoading(true);
    const result = await dispatch(verifyOTP({ userId, otp: code }));
    if (verifyOTP.fulfilled.match(result)) {
      router.push('/dashboard');
    } else {
      setError('Codigo incorrecto');
      setLoading(false);
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#F1EFE8',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{width:'100%',maxWidth:'360px',textAlign:'center',background:'white',borderRadius:'16px',padding:'32px'}}>
        <div style={{fontSize:'48px',marginBottom:'16px'}}>✉️</div>
        <h1 style={{fontSize:'20px',fontWeight:'500',marginBottom:'8px'}}>Verifica tu correo</h1>
        <p style={{fontSize:'13px',color:'#888',marginBottom:'16px'}}>{email}</p>
        {error && <p style={{color:'red',fontSize:'12px',marginBottom:'12px'}}>{error}</p>}
        <input type="text" maxLength={6} value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Codigo de 6 digitos"
          style={{width:'100%',border:'2px solid #E8E6DF',borderRadius:'10px',padding:'12px',fontSize:'16px',textAlign:'center',marginBottom:'16px',outline:'none'}}
        />
        <button onClick={handleVerify} disabled={code.length < 6 || loading}
          style={{width:'100%',background:'#534AB7',color:'white',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',cursor:'pointer'}}>
          {loading ? 'Verificando...' : 'Verificar codigo'}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return <Suspense fallback={<div>Cargando...</div>}><OTPForm /></Suspense>;
}
