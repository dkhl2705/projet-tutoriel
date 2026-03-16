import { useState } from "react";

const colors = {
  white: "#ffffff",
  bluePrimary: "#3b82f6",
  blueLight: "#dbeafe",
  bluePale: "#eff6ff",
  grayLight: "#f3f4f6",
  grayDark: "#1f2937",
  black: "#000000",
  green: "#10b981",
  greenPale: "#d1fae5",
  red: "#ef4444",
  redPale: "#fee2e2",
  violet: "#4a67ff",
  violetPale: "#e0e4ff",
  orange: "#ffa500",
  orangePale: "#fff3e0",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; }

  .page {
    min-height: 100vh;
    background: ${colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  .bg-blob-1 {
    position: absolute;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, ${colors.bluePale} 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: floatBlob 8s ease-in-out infinite;
  }
  .bg-blob-2 {
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, ${colors.violetPale} 0%, transparent 70%);
    bottom: -80px; right: -80px;
    animation: floatBlob 10s ease-in-out infinite reverse;
  }
  .bg-blob-3 {
    position: absolute;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, ${colors.orangePale} 0%, transparent 70%);
    top: 50%; right: 10%;
    animation: floatBlob 12s ease-in-out infinite;
  }

  @keyframes floatBlob {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }

  .card {
    background: ${colors.white};
    border-radius: 28px;
    padding: 48px 44px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.06);
    position: relative;
    z-index: 1;
    animation: cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .logo-area {
    text-align: center;
    margin-bottom: 32px;
    animation: fadeDown 0.5s 0.1s both;
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 68px; height: 68px;
    border-radius: 20px;
    background: linear-gradient(135deg, ${colors.bluePrimary}, ${colors.violet});
    margin-bottom: 14px;
    box-shadow: 0 8px 24px rgba(59,130,246,0.35);
  }

  .logo-name {
    font-family: 'Nunito', sans-serif;
    font-size: 30px;
    font-weight: 900;
    color: ${colors.grayDark};
    letter-spacing: -0.5px;
  }
  .logo-name span { color: ${colors.bluePrimary}; }

  .logo-tagline {
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
    font-weight: 400;
  }

  .welcome {
    font-family: 'Nunito', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: ${colors.grayDark};
    margin-bottom: 6px;
    animation: fadeDown 0.5s 0.2s both;
  }
  .welcome-sub {
    font-size: 13.5px;
    color: #6b7280;
    margin-bottom: 28px;
    animation: fadeDown 0.5s 0.25s both;
  }

  .field {
    margin-bottom: 18px;
    animation: fadeDown 0.5s both;
  }
  .field:nth-child(1) { animation-delay: 0.3s; }
  .field:nth-child(2) { animation-delay: 0.35s; }

  .field label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: ${colors.grayDark};
    margin-bottom: 7px;
  }

  .input-wrap { position: relative; }
  .input-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    transition: color 0.2s;
    width: 18px; height: 18px;
  }
  .input-wrap:focus-within svg { color: ${colors.bluePrimary}; }

  .input-wrap input {
    width: 100%;
    padding: 13px 44px 13px 42px;
    border: 2px solid ${colors.grayLight};
    border-radius: 14px;
    font-size: 14.5px;
    font-family: 'Poppins', sans-serif;
    color: ${colors.grayDark};
    background: ${colors.grayLight};
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .input-wrap input:focus {
    border-color: ${colors.bluePrimary};
    background: ${colors.white};
    box-shadow: 0 0 0 4px ${colors.bluePale};
  }
  .input-wrap input::placeholder { color: #b0b7c3; }

  .eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #9ca3af;
    transition: color 0.2s;
  }
  .eye-btn:hover { color: ${colors.bluePrimary}; }

  .row-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 26px;
    animation: fadeDown 0.5s 0.4s both;
  }

  .remember {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }
  .remember input[type="checkbox"] {
    width: 17px; height: 17px;
    accent-color: ${colors.bluePrimary};
    cursor: pointer;
  }

  .forgot {
    font-size: 13px;
    color: ${colors.bluePrimary};
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .forgot:hover { color: ${colors.violet}; }

  .btn-login {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, ${colors.bluePrimary}, ${colors.violet});
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(59,130,246,0.4);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    animation: fadeDown 0.5s 0.45s both;
  }
  .btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(59,130,246,0.5);
  }
  .btn-login:active { transform: translateY(0); }
  .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0;
    animation: fadeDown 0.5s 0.5s both;
  }
  .divider span { font-size: 12px; color: #9ca3af; white-space: nowrap; }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${colors.grayLight};
  }

  .social-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    animation: fadeDown 0.5s 0.55s both;
  }

  .btn-social {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border: 2px solid ${colors.grayLight};
    border-radius: 12px;
    background: ${colors.white};
    font-size: 13px;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    color: ${colors.grayDark};
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
  }
  .btn-social:hover {
    border-color: ${colors.bluePrimary};
    background: ${colors.bluePale};
    transform: translateY(-1px);
  }

  .register-row {
    text-align: center;
    margin-top: 24px;
    font-size: 13.5px;
    color: #6b7280;
    animation: fadeDown 0.5s 0.6s both;
  }
  .register-row a {
    color: ${colors.bluePrimary};
    font-weight: 700;
    text-decoration: none;
  }
  .register-row a:hover { color: ${colors.violet}; }

  .success-banner {
    background: ${colors.greenPale};
    border: 1.5px solid ${colors.green};
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 13px;
    color: #065f46;
    font-weight: 600;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeDown 0.3s both;
  }
  .error-banner {
    background: ${colors.redPale};
    border: 1.5px solid ${colors.red};
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 13px;
    color: #991b1b;
    font-weight: 600;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeDown 0.3s both;
  }

  .indicator-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    animation: fadeDown 0.5s 0.65s both;
  }
  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${colors.grayLight};
  }
  .dot.active { background: ${colors.bluePrimary}; width: 18px; border-radius: 3px; }
`;

export default function KidCareLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setStatus("error"); return; }
    setLoading(true);
    setStatus(null);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setStatus("success");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />

        <div className="card">
          <div className="logo-area">
            <div className="logo-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
              </svg>
            </div>
            <div className="logo-name">Kid<span>Care</span></div>
            <div className="logo-tagline">Santé & suivi de votre enfant</div>
          </div>

          <div className="welcome">Bon retour ! 👋</div>
          <div className="welcome-sub">Connectez-vous pour accéder au tableau de bord</div>

          {status === "success" && (
            <div className="success-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Connexion réussie ! Redirection en cours…
            </div>
          )}
          {status === "error" && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Veuillez remplir tous les champs correctement.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Adresse e-mail</label>
              <div className="input-wrap">
                <input
                  type="email"
                  placeholder="exemple@kidcare.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
            </div>

            <div className="field">
              <label>Mot de passe</label>
              <div className="input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="row-options">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot">Mot de passe oublié ?</a>
            </div>

            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <div className="divider"><span>ou continuer avec</span></div>
          <div className="social-btns">
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1f2937"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <div className="register-row">
            Pas encore de compte ? <a href="#">Créer un compte</a>
          </div>

          <div className="indicator-dots">
            <div className="dot active" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      </div>
    </>
  );
}