'use client';

import { useState, useEffect } from 'react';
import { Share2, Trophy, Target, Shield, Zap, Gift, Users, CreditCard, UserPlus, Lock, Smartphone } from 'lucide-react';
import styles from './page.module.css';

export default function AffiliateProgramPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'program'>('register');
  const [programTab, setProgramTab] = useState<'overview' | 'ranks' | 'armory' | 'tactics'>('overview');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Agent Profile Created! Welcome to the Squad.');
    setActiveTab('program');
  };

  return (
    <div className={styles.affiliatePage}>
      
      {/* Navigation / Header */}
      <nav style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '20px 40px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '2px'}}>
          SHOPWAVE <span style={{color: 'var(--neon-cyan)'}}>AGENTS</span>
        </div>
        <div style={{display: 'flex', gap: '20px'}}>
           <button 
             onClick={() => setActiveTab('register')}
             style={{
               background: activeTab === 'register' ? 'var(--neon-cyan)' : 'transparent',
               color: activeTab === 'register' ? 'black' : 'white',
               border: '1px solid var(--neon-cyan)',
               padding: '8px 20px',
               borderRadius: '5px',
               cursor: 'pointer',
               fontWeight: 'bold'
             }}
           >
             Join Squad
           </button>
           <button 
             onClick={() => setActiveTab('program')}
             style={{
               background: activeTab === 'program' ? 'var(--neon-purple)' : 'transparent',
               color: activeTab === 'program' ? 'white' : 'white',
               border: '1px solid var(--neon-purple)',
               padding: '8px 20px',
               borderRadius: '5px',
               cursor: 'pointer',
               fontWeight: 'bold'
             }}
           >
             Mission Intel
           </button>
        </div>
      </nav>

      <div className={styles.mainContainer}>
      
        {/* VIEW 1: REGISTRATION / PROFILE CREATION */}
        {activeTab === 'register' && (
          <div className={styles.registerView}>
             <section className={styles.heroSection}>
                <h1 className={styles.glitchTitle}>Initialize <br/> <span style={{color: 'var(--neon-cyan)'}}>Proprietary Profile</span></h1>
                <p className={styles.heroSubtitle}>
                  Create your secure agent account to track earnings, manage withdrawals, and access top-tier missions.
                </p>
             </section>

             <div style={{display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap'}}>
                {/* Agent Card Preview */}
                <div className={styles.agentCardPreview}>
                   <div style={{
                     width: '80px', height: '80px', background: '#333', borderRadius: '50%', margin: '0 auto 20px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--neon-cyan)'
                   }}>
                      <Users size={40} color="var(--neon-cyan)" />
                   </div>
                   <h3 style={{margin: '0 0 5px 0', fontSize: '1.5rem'}}>{profileData.username || 'AGENT NAME'}</h3>
                   <p style={{color: '#888', margin: 0}}>NOVICE AGENT</p>
                   <div style={{marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                         <span>ID:</span> <span style={{color: 'var(--neon-green)'}}>SW-8821</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                         <span>Status:</span> <span style={{color: 'orange'}}>UNVERIFIED</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                         <span>Wallet:</span> <span style={{color: 'var(--neon-cyan)'}}>₹0.00</span>
                      </div>
                   </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className={styles.vaultSection} style={{maxWidth: '500px', margin: 0}}>
                   <h2 style={{marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px'}}>
                      Create Account
                   </h2>
                   
                   <div className={styles.formGroup}>
                      <label className={styles.label}>Codename (Username)</label>
                      <input 
                        name="username" 
                        className={styles.input} 
                        placeholder="Enter your alias"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        required
                      />
                   </div>

                   <div className={styles.formGroup}>
                      <label className={styles.label}>Comm Link (Email)</label>
                      <input 
                        name="email" 
                        type="email"
                        className={styles.input} 
                        placeholder="agent@example.com"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                   </div>

                   <div className={styles.formGroup}>
                      <label className={styles.label}>Secure Key (Password)</label>
                      <input 
                        name="password" 
                        type="password"
                        className={styles.input} 
                        placeholder="••••••••"
                        value={profileData.password}
                        onChange={handleProfileChange}
                        required
                      />
                   </div>

                   <button type="submit" className={styles.saveButton} style={{background: 'var(--neon-cyan)', color: 'black'}}>
                      <UserPlus size={18} style={{marginRight: '8px'}}/> Initialize Agent
                   </button>
                </form>
             </div>
          </div>
        )}


        {/* VIEW 2: PROGRAM DETAILS (The existing content) */}
        {activeTab === 'program' && (
          <div className={styles.programView}>
            {/* Sub-Navigation for Mission Intel */}
            <div className={styles.categoryNav}>
               {['OVERVIEW', 'RANKS', 'ARMORY', 'TACTICS'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setProgramTab(tab.toLowerCase() as any)}
                   className={`${styles.catButton} ${programTab === tab.toLowerCase() ? styles.activeCat : ''}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            {programTab === 'overview' && (
              <>
                <section className={styles.heroSection}>
                  <h1 className={styles.glitchTitle}>Mission Briefing</h1>
                  <p className={styles.heroSubtitle}>
                    Level up your earnings. Refer dropshippers, unlock loot boxes, and dominate the leaderboard.
                    <br /> <span style={{color: 'var(--neon-green)'}}>Earn ₹199 per recruit + Massive Bonuses</span>
                  </p>
                </section>

                <h2 className={styles.sectionTitle}>Choose Your <span>Loadout</span></h2>
                <div className={styles.plansContainer}>
                  {/* Reuse existing Plan Cards code structure here for brevity, or keeping it as is */}
                  <div className={styles.planCard}>
                    <h3 className={styles.planName}>Scout</h3>
                    <p className={styles.planPrice}>₹199 / recruit</p>
                    <p className={styles.planProfit}>Base Commission</p>
                    <ul className={styles.featureList}>
                       <li><Zap size={16} /> Instant Payouts</li>
                       <li><Target size={16} /> Basic Support</li>
                    </ul>
                  </div>
                  <div className={styles.planCard} style={{borderColor: 'var(--neon-purple)'}}>
                    <h3 className={styles.planName}>Veteran</h3>
                    <p className={styles.planPrice}>₹2000 Plan</p>
                    <p className={styles.planProfit} style={{color: 'var(--neon-purple)'}}>YOU EARN ₹400</p>
                    <ul className={styles.featureList}>
                       <li><Trophy size={16} /> High Commission</li>
                       <li><Shield size={16} /> Priority Support</li>
                       <li><Gift size={16} /> Bonus Multiplier</li>
                    </ul>
                  </div>
                  <div className={styles.planCard} style={{borderColor: 'var(--neon-cyan)'}}>
                    <h3 className={styles.planName}>Legend</h3>
                    <p className={styles.planPrice}>₹3000 Plan</p>
                    <p className={styles.planProfit} style={{color: 'var(--neon-cyan)'}}>YOU EARN ₹600</p>
                    <ul className={styles.featureList}>
                       <li><Trophy size={16} /> Max Commission</li>
                       <li><Shield size={16} /> VIP Access</li>
                       <li><div style={{color:'gold'}}>👑 Top Tier Rewards</div></li>
                    </ul>
                  </div>
                </div>

                <h2 className={styles.sectionTitle}>Unlock <span>Achievements</span></h2>
                <div className={styles.milestonesContainer}>
                   <div className={styles.milestoneCard}>
                      <Users size={30} color="white" style={{marginBottom:'10px'}} />
                      <div className={styles.milestoneCount}>5 Recruits</div>
                      <div className={styles.milestoneBonus}>+ ₹500</div>
                   </div>
                   <div className={styles.milestoneCard}>
                      <Users size={30} color="white" style={{marginBottom:'10px'}} />
                      <div className={styles.milestoneCount}>10 Recruits</div>
                      <div className={styles.milestoneBonus}>+ ₹700</div>
                   </div>
                   <div className={styles.milestoneCard} style={{borderColor: 'gold', boxShadow: '0 0 10px gold'}}>
                      <Users size={30} color="gold" style={{marginBottom:'10px'}} />
                      <div className={styles.milestoneCount} style={{color:'gold'}}>30 Recruits</div>
                      <div className={styles.milestoneBonus} style={{color:'gold'}}>+ ₹2500</div>
                   </div>
                </div>
              </>
            )}

            {programTab === 'ranks' && (
              <div className={styles.contentSection}>
                 <h2 className={styles.sectionTitle}>Rank <span>Progression</span></h2>
                 <p style={{textAlign:'center', color:'#888', marginBottom:'40px'}}>Detailed breakdown of clearance levels.</p>
                 <div className={styles.rankTableWrapper}>
                    <table className={styles.rankTable}>
                       <thead>
                          <tr>
                             <th>Rank Class</th>
                             <th>Requirement</th>
                             <th>Commission</th>
                             <th>Perks</th>
                          </tr>
                       </thead>
                       <tbody>
                          <tr>
                             <td style={{color:'#fff'}}>NOVICE</td>
                             <td>0 - 5 Recruits</td>
                             <td>Standard</td>
                             <td>Access to Basic Missions</td>
                          </tr>
                          <tr>
                             <td style={{color:'var(--neon-purple)'}}>ELITE</td>
                             <td>5 - 20 Recruits</td>
                             <td>+5% Bonus</td>
                             <td>Priority Withdrawals</td>
                          </tr>
                          <tr>
                             <td style={{color:'var(--neon-cyan)'}}>COMMANDER</td>
                             <td>20+ Recruits</td>
                             <td>+10% Bonus</td>
                             <td>Dedicated Account Manager</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
            )}

            {programTab === 'armory' && (
               <div className={styles.contentSection}>
                  <h2 className={styles.sectionTitle}>The <span>Armory</span></h2>
                  <p style={{textAlign:'center', color:'#888', marginBottom:'40px'}}>Equip yourself with marketing assets.</p>
                  <div className={styles.armoryGrid}>
                     <div className={styles.assetCard}>
                        <div className={styles.assetPreview} style={{background: 'linear-gradient(45deg, #111, #222)'}}>IMG</div>
                        <h3>Social Stories</h3>
                        <button className={styles.downloadBtn}>Download Pack</button>
                     </div>
                     <div className={styles.assetCard}>
                        <div className={styles.assetPreview} style={{background: 'linear-gradient(45deg, #000, #333)'}}>VID</div>
                        <h3>Reel Templates</h3>
                        <button className={styles.downloadBtn}>Download Pack</button>
                     </div>
                     <div className={styles.assetCard}>
                        <div className={styles.assetPreview} style={{background: 'linear-gradient(45deg, #111, #1a1a1a)'}}>TXT</div>
                        <h3>Script Log</h3>
                        <button className={styles.downloadBtn}>Download Pack</button>
                     </div>
                  </div>
               </div>
            )}

            {programTab === 'tactics' && (
               <div className={styles.contentSection} style={{maxWidth:'800px', margin:'0 auto'}}>
                  <h2 className={styles.sectionTitle}>Tactical <span>Guide</span></h2>
                  {[
                     {q: "How do I unlock the Veteran Loadout?", a: "Direct recruit a dropshipper on the 2000 Plan to instantly unlock Veteran perks."},
                     {q: "When does the loot drop (Payout)?", a: "Payouts are processed every Friday for verified agents."},
                     {q: "Is there a limit to recruits?", a: "Negative. The squad size is unlimited. Dominate the server."}
                  ].map((faq, i) => (
                     <div key={i} className={styles.faqItem}>
                        <h4 style={{color:'var(--neon-cyan)', marginBottom:'10px'}}>{faq.q}</h4>
                        <p style={{color:'#aaa', lineHeight:'1.5'}}>{faq.a}</p>
                     </div>
                  ))}
               </div>
            )}

            {/* Common Sections for all tabs if needed, or keep strictly categorical */}
            {programTab === 'overview' && (
              <>
                <h2 className={styles.sectionTitle}>The <span>Vault</span></h2>
                <div className={styles.vaultSection}>
                     <div style={{textAlign: 'center', padding: '40px'}}>
                        <Lock size={40} color="#888" style={{display: 'block', margin: '0 auto 20px'}} />
                        <h3>Unlock The Vault</h3>
                        <p style={{color: '#888'}}>Register an account to setup your banking details for secure withdrawals.</p>
                        <button onClick={() => setActiveTab('register')} className={styles.ctaButton} style={{marginTop: '20px'}}>Create Account</button>
                     </div>
                </div>

                <h2 className={styles.sectionTitle}>Top <span>Agents</span></h2>
                <table className={styles.leaderboardTable}>
                   <thead>
                     <tr>
                       <th>Rank</th>
                       <th>Agent</th>
                       <th>Recruits</th>
                       <th>Total Loot</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td className={styles.rank1}>#1</td>
                       <td>ShadowSlayer</td>
                       <td>142</td>
                       <td className={styles.rank1}>₹42,500</td>
                     </tr>
                     <tr>
                       <td className={styles.rank2}>#2</td>
                       <td>ViperX</td>
                       <td>98</td>
                       <td className={styles.rank2}>₹28,100</td>
                     </tr>
                     <tr>
                       <td className={styles.rank3}>#3</td>
                       <td>CyberNinja</td>
                       <td>64</td>
                       <td className={styles.rank3}>₹15,400</td>
                     </tr>
                   </tbody>
                </table>
              </>
            )}
          </div>
        )}

      </div>

      <LiveActivityFeed />
    </div>
  );
}

// Sub-component for Live Activity
function LiveActivityFeed() {
  const [activities, setActivities] = useState<string[]>([]);

  useEffect(() => {
    const names = ['Venom', 'Ghost', 'Reaper', 'Neon', 'Glitch', 'Kratos', 'Valkyrie'];
    const actions = ['joined the squad', 'unlocked Veteran box', 'reached 5 recruits', 'withdrew ₹2000'];
    
    setActivities(['System Online: Tracking events...']);

    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const newActivity = `${name} ${action}`;
      
      setActivities(prev => {
        const updated = [newActivity, ...prev];
        if (updated.length > 4) updated.pop();
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 100,
      fontFamily: "'Orbitron', sans-serif",
      fontSize: '0.8rem',
      pointerEvents: 'none'
    }}>
      {activities.map((act, index) => (
        <div key={index} style={{
          background: 'rgba(0,0,0,0.9)',
          borderLeft: '3px solid var(--neon-green)',
          color: '#fff',
          padding: '8px 15px',
          marginBottom: '5px',
          opacity: 1 - (index * 0.2),
          transform: `translateX(${index * 5}px)`,
          transition: 'all 0.5s ease',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          In-Game: <span style={{color: 'var(--neon-green)'}}>{act}</span>
        </div>
      ))}
    </div>
  );
}
