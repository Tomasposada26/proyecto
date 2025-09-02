
import AnimatedRobot from '../assets/components/AnimatedRobot';
import { FaBolt, FaChartPie, FaLink, FaSearch } from 'react-icons/fa';
import aLogo from '../assets/images/a-logo.png';
import { motion } from 'framer-motion';

const InicioPanel = ({
  user,
  t,
  setPanelActivo,
  setShowNotifications,
  setShowLogin,
  setShowRegister,
  toast
}) => {
  return (
    <div className="aura-main-panel-bg" style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '100%',
      background: 'none',
      padding: 0,
      zIndex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          background: `linear-gradient(120deg, ${document.body.classList.contains('aura-dark') ? '#232a3b 0%, #188fd9 60%, #10b981 100%' : '#188fd9 0%, #10b981 60%, #b97adf 100%'})`,
          borderRadius: 0,
          boxShadow: '0 8px 32px rgba(30,230,217,0.10), 0 1.5px 8px rgba(36,198,240,0.10)',
          padding: '48px 40px 40px 40px',
          color: '#fff',
          position: 'relative',
          overflow: 'visible',
          minHeight: '100%',
          minWidth: 0
        }}
      >
        <div style={{display:'flex',alignItems:'center',gap:18,marginBottom:10}}>
          <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',background:'#fff',borderRadius:'50%',padding:3,border:'2.5px solid #fff',boxShadow:'0 2px 8px rgba(0,0,0,0.10)'}}>
            <img src={aLogo} alt="Aura logo" style={{width:42,height:42,borderRadius:'50%',objectFit:'cover'}} />
          </span>
          <span style={{fontSize:'2.1rem',fontWeight:800,letterSpacing:0.5,display:'flex',alignItems:'center',gap:8}}>
            <span role="img" aria-label="wave">👋</span> {t('welcome.hello', { name: user?.nombre || user?.name || '' })}
          </span>
        </div>
        <h1 style={{fontSize:'1.7rem',fontWeight:700,marginBottom:8,letterSpacing:0.5}}>
          {t('welcome.title')}
          <span role="img" aria-label="rocket"> 🚀</span>
        </h1>
        <div style={{fontStyle:'italic',fontSize:'1.15rem',color:'#e0e6f0',marginBottom:8}}>{t('welcome.subtitle')}</div>
        <div style={{fontSize:'1.13rem',fontWeight:500,maxWidth:1100,marginBottom:18,lineHeight:1.5}}>{t('welcome.description')}</div>
        <div style={{display:'flex',gap:18,marginBottom:18,flexWrap:'wrap'}}>
          <span style={{background:'#fff2',color:'#232a3b',borderRadius:12,padding:'6px 16px',fontWeight:600,fontSize:'1.08rem',boxShadow:'0 1px 4px #0001'}}>{t('welcome.shortPhrase1')}</span>
          <span style={{background:'#fff2',color:'#232a3b',borderRadius:12,padding:'6px 16px',fontWeight:600,fontSize:'1.08rem',boxShadow:'0 1px 4px #0001'}}>{t('welcome.shortPhrase2')}</span>
          <span style={{background:'#fff2',color:'#232a3b',borderRadius:12,padding:'6px 16px',fontWeight:600,fontSize:'1.08rem',boxShadow:'0 1px 4px #0001'}}>{t('welcome.shortPhrase3')}</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24,marginBottom:24,position:'relative'}}>
          <div
            style={{
              position: 'absolute',
              top: '-235px',
              right: '265px',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{position:'relative',width:'fit-content',height:'fit-content'}}>
              <AnimatedRobot />
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.8 }}
                animate={{ opacity: 1, x: -20, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5, type: 'spring' }}
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '100%',
                  minWidth: 160,
                  maxWidth: 220,
                  background: 'linear-gradient(90deg,#fff 60%,#e0f7fa 100%)',
                  color: '#232a3b',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  borderRadius: '18px',
                  boxShadow: '0 2px 12px #10b98122',
                  padding: '12px 14px 12px 12px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  border: '2px solid #10b981',
                }}
              >
                <span style={{fontSize:'1.3rem',marginRight:6}}>🤖</span>
                {t('welcome.robotMessage')}
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, times: [0, 0.5, 1], delay: 0, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
            style={{background:'linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(59,130,246,0.10)'}}>
            <div style={{fontSize:'2rem',marginBottom:6}}><FaBolt /></div>
            <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.smartAutomation')}</h3>
            <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.smartAutomationDesc')}</p>
          </motion.div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, times: [0, 0.5, 1], delay: 3, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
            style={{background:'linear-gradient(135deg,#06b6d4 0%,#a78bfa 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(6,182,212,0.10)'}}>
            <div style={{fontSize:'2rem',marginBottom:6}}><FaChartPie /></div>
            <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.trendsPanel')}</h3>
            <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.trendsPanelDesc')}</p>
          </motion.div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, times: [0, 0.5, 1], delay: 6, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
            style={{background:'linear-gradient(135deg,#a78bfa 0%,#06b6d4 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(167,139,250,0.10)'}}>
            <div style={{fontSize:'2rem',marginBottom:6}}><FaLink /></div>
            <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.multiAccount')}</h3>
            <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.multiAccountDesc')}</p>
          </motion.div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, times: [0, 0.5, 1], delay: 9, repeat: Infinity, repeatType: 'loop', repeatDelay: 9 }}
            style={{background:'linear-gradient(135deg,#10b981 0%,#3b82f6 100%)',borderRadius:18,padding:'22px 28px',color:'#fff',boxShadow:'0 2px 12px rgba(16,185,129,0.10)'}}>
            <div style={{fontSize:'2rem',marginBottom:6}}><FaSearch /></div>
            <h3 style={{fontWeight:700,fontSize:'1.18rem',marginBottom:8}}>{t('welcome.dataAnalysis')}</h3>
            <p style={{fontSize:'1.05rem',color:'#e0e6f0'}}>{t('welcome.dataAnalysisDesc')}</p>
          </motion.div>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:24,marginBottom:32,flexWrap:'wrap'}}>
          <button onClick={()=>setPanelActivo('cuentas')} style={{display:'flex',alignItems:'center',gap:8,background:'#fff',color:'#232a3b',border:'2.5px solid #10b981',borderRadius:16,padding:'12px 24px',fontWeight:700,fontSize:'1.09rem',boxShadow:'0 2px 8px #10b98122',cursor:'pointer',transition:'box-shadow .2s,border .2s'}}>
            <span style={{fontSize:'1.35rem',color:'#7c3aed'}}>➕</span> {t('welcome.quickLinkAccount')}
          </button>
          <button onClick={()=>setPanelActivo('respuestas')} style={{display:'flex',alignItems:'center',gap:8,background:'#fff',color:'#232a3b',border:'2.5px solid #188fd9',borderRadius:16,padding:'12px 24px',fontWeight:700,fontSize:'1.09rem',boxShadow:'0 2px 8px #188fd922',cursor:'pointer',transition:'box-shadow .2s,border .2s'}}>
            <span style={{fontSize:'1.35rem',color:'#818cf8'}}>⚙️</span> {t('welcome.quickLinkNeto')}
          </button>
          <button onClick={()=>setShowNotifications(true)} style={{display:'flex',alignItems:'center',gap:8,background:'#fff',color:'#232a3b',border:'2.5px solid #ffe03c',borderRadius:16,padding:'12px 24px',fontWeight:700,fontSize:'1.09rem',boxShadow:'0 2px 8px #ffe03c22',cursor:'pointer',transition:'box-shadow .2s,border .2s'}}>
            <span style={{fontSize:'1.35rem',color:'#fbbf24'}}>📨</span> {t('welcome.quickLinkNotifications')}
          </button>
        </div>
        <div style={{background:'linear-gradient(90deg,#10b981 0%,#188fd9 100%)',color:'#fff',fontWeight:800,fontSize:'1.18rem',borderRadius:12,padding:'16px 44px',boxShadow:'0 4px 16px rgba(16,185,129,0.13)',letterSpacing:'1px',marginTop:8,textAlign:'center'}}>
          <span role="img" aria-label="sparkles">✨</span> {t('welcome.cta')}
        </div>
        <span style={{position:'absolute',right:40,top:40,width:70,height:70,background:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',opacity:0.13}}>
          <img src={aLogo} alt="Aura logo" style={{width:56,height:56,borderRadius:'50%',objectFit:'cover'}} />
        </span>
      </motion.div>
    </div>
  );
};

export default InicioPanel;
