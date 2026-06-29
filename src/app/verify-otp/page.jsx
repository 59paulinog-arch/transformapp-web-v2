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
        <div style={{background:'#EEEDFE',padding:'12px',borderRadius:'12px',marginBo
