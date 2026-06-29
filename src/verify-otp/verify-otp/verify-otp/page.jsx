'use client';
import { useState, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../../../store';
import { useRouter, useSearchParams } from 'next/navigation';

function OTPForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('userId');
  const email = params.get('email');
  const [otp, setOtp] = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleVerify() {
    setLoading(true);
    const result = await dispatch(verifyOTP({ userId, otp: otp.join('') }));
    if (verifyOTP.fulfilled.match(result)) {
      router.push('/dashboard');
    } else {
      setError('Codigo incorrecto');
      setLoading(false);
    }
  }

  function handleInput(i, val) {
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) document.getElementById('otp-' + (i+1))?.focus();
  }

  return (
    <div style={{minHeight:'100vh',background:'#F1EFE8',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{width:'100%',maxWidth:'360px',textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'16px'}}>✉️</div>
        <h1 style={{fontSize:'20px',fontWeight:'500',marginBottom:'8px'}}>Verifica tu correo</h1>
        <p style={{fontSize:'13px',color:'#888780',marginBottom:'4px'}}>Codigo enviado a</p>
        <p style={{fontSize:'13px',fontWeight:'500',marginBottom:'16px'}}>{email}</p>
        <div style={{background:'#EEEDFE',padding:'12px',borderRadius:'12px',marginBottom:'16px',fontSize:'12px',color:'#534AB7'}}>
          Ve a Railway, Console del backend y busca la linea [OTP] para obtener tu codigo
        </div>
        {error && <p style={{color:'#E24B4A',fontSize:'13px',marginBottom:'12px'}}>{error}</p>}
        <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'20px'}}>
          {otp.map((v,i) => (
            <input key={i} id={'otp-'+i} maxLength={1} value={v}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => { if(e.key==='Backspace'&&!v&&i>0) document.getElementById('otp-'+(i-1))?.focus(); }}
              style={{width:'44px',height:'48px',border:'2px solid #E8E6DF',borderRadius:'10px',textAlign:'center',fontSize:'18px',outline:'none'}}
            />
          ))}
        </div>
        <button onClick={handleVerify} disabled={otp.join('').length < 6 || loading}
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
