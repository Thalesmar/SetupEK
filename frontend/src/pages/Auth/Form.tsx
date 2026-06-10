import { useState } from 'react';
import './Form.css';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL as API } from '../../config';

const Form = () => {
  const navigate = useNavigate();
  const [formSwitcher, setFormSwitcher] = useState<boolean>(true);
  const [message, setMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, secondName, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setFirstName('');
        setSecondName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigate('/');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    }
  };

  const loginUser = async () => {
    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      setMessage(data.message);

      if (!response.ok) return;

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setEmail('');
      setPassword('');
      navigate('/');
    } catch {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="form-container">
      <div className="form-wrapper">
        {message && (
          <p
            style={{
              fontSize: '13px',
              color: message.toLowerCase().includes('success')
                ? 'green'
                : 'red',
            }}
          >
            {message}
          </p>
        )}

        <div className="form-switch">
          {' '}
          <button
            className={`login-btn ${formSwitcher ? 'active' : ''}`}
            onClick={() => setFormSwitcher(true)}
          >
            Sign in
          </button>
          <button
            className={`signup-btn ${!formSwitcher ? 'active' : ''}`}
            onClick={() => setFormSwitcher(false)}
          >
            Sign up
          </button>
        </div>

        {formSwitcher ? (
          <div className="login-container">
            <div className="email">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={loginUser}>
              Sign In
            </button>

            <div className="forget-password">
              <p>forget password?</p>
            </div>
          </div>
        ) : (
          <div className="sign-up-form">
            <div className="name-container">
              <div className="fst-name">
                <label>First name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="sec-name">
                <label>Last name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                />
              </div>
            </div>

            <div className="email">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="password">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="password">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={handleSignup}>
              Create Account
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Form;
