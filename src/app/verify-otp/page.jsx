'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
  const router = useRouter();
  const [billing, setBilling] = useState('monthly');
  const [plan, setPlan] = useState('complete');

  const prices = {
    complete: { monthly: '$7.99', yearly: '$4.99' },
    basic: { monthly: '$3.99', yearly: '$2.49' }
  };

  return (
    <div style={{minHeight:'100vh',background:'#F1EFE8',padding:'0'}}>
      <div style={{background:'#534AB7',padding:'32px 20px',textAlign:'center'}}>
        <button onClick={() => router.back()} style={{background:'none',border:'none',color:'#AFA9EC',fontSize:'13px',cursor:'pointer',marginBottom:'16px',display:'block'}}>← Volver</button>
        <div style={{fontSize:'36px',marginBottom:'8px'}}>👑</div>
        <h1 style={{fontSize:'22px',fontWeight:'500',color:'white',marginBottom:'4px'}}>TransformApp Premium</h1>
        <p style={{fontSize:'13px',color:'#AFA9EC'}}>Desbloquea tu viaje de transformación completo</p>
      </div>

      <div style={{maxWidth:'480px',margin:'0 auto',padding:'20px 16px'}}>
        <div style={{display:'flex',background:'#F8F8F5',borderRadius:'24px',padding:'3px',marginBottom:'20px',border:'0.5px solid #E8E6DF'}}>
          {['monthly','yearly'].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{flex:1,border:'none',borderRadius:'22px',padding:'8px',fontSize:'13px',cursor:'pointer',background:billing===b?'#534AB7':'transparent',color:billing===b?'white':'#888780',fontWeight:billing===b?'500':'400'}}>
              {b === 'monthly' ? 'Mensual' : 'Anual — Ahorra 37%'}
            </button>
          ))}
        </div>

        {[
          { key:'complete', name:'Plan Completo', desc:'Todo el viaje de transformación', popular:true,
            features:['Las 8 etapas del viaje','Historias verídicas por etapa','Fundamentos científicos','Notificaciones diarias','Diario de transformación'] },
          { key:'basic', name:'Plan Básico', desc:'Primeras 4 etapas del viaje', popular:false,
            features:['Etapas 1-4 del viaje','Historias verídicas'] }
        ].map(p => (
          <div key={p.key} onClick={() => setPlan(p.key)}
            style={{border:plan===p.key?'2px solid #534AB7':'1px solid #E8E6DF',borderRadius:'16px',padding:'16px',marginBottom:'12px',cursor:'pointer',background:plan===p.key?'#EEEDFE':'white',position:'relative',marginTop:p.popular?'14px':'0'}}>
            {p.popular && <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'#534AB7',color:'white',fontSize:'11px',padding:'3px 14px',borderRadius:'20px',fontWeight:'500'}}>Más popular</div>}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
              <div>
                <div style={{fontSize:'14px',fontWeight:'500',color:'#2C2C2A'}}>{p.name}</div>
                <div style={{fontSize:'11px',color:'#888780'}}>{p.desc}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'20px',fontWeight:'500',color:'#534AB7'}}>{prices[p.key][billing]}</div>
                <div style={{fontSize:'10px',color:'#888780'}}>/mes</div>
              </div>
            </div>
            {p.features.map(f => <div key={f} style={{fontSize:'12px',color:'#5F5E5A',marginBottom:'3px'}}>✅ {f}</div>)}
          </div>
        ))}

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderTop:'0.5px solid #E8E6DF',marginBottom:'16px'}}>
          <div>
            <div style={{fontSize:'13px',color:'#2C2C2A',fontWeight:'500'}}>Plan Gratuito</div>
            <div style={{fontSize:'11px',color:'#888780'}}>Solo Etapa 1: Mayordomía</div>
          </div>
          <button onClick={() => router.push('/dashboard')} style={{fontSize:'12px',color:'#534AB7',background:'none',border:'none',cursor:'pointer'}}>Continuar gratis</button>
        </div>

        <button
          style={{width:'100%',background:'#534AB7',color:'white',border:'none',borderRadius:'14px',padding:'14px',fontSize:'14px',fontWeight:'500',cursor:'pointer',marginBottom:'10px'}}
          onClick={() => alert('Stripe se configurará próximamente. Por ahora continúa con el plan gratuito.')}>
          Comenzar {plan === 'complete' ? 'Plan Completo' : 'Plan Básico'} — {prices[plan][billing]}/mes
        </button>

        <p style={{textAlign:'center',fontSize:'11px',color:'#888780'}}>🔒 Pago seguro con Stripe · Cancela cuando quieras</p>
      </div>
    </div>
  );
}
