import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError('Connection error! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔗 URL Shortener v1.0</h1>
      <p style={styles.subtitle}>Convert your long URLs into short links</p>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Enter your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleShorten} style={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Shorten'}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {shortUrl && (
        <div style={styles.resultBox}>
          <p style={styles.resultLabel}>Your short link:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.link}>
            {shortUrl}
          </a>
          <button onClick={handleCopy} style={styles.copyButton}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '80px auto', fontFamily: 'Arial', textAlign: 'center', padding: '0 20px' },
  title: { fontSize: '2rem', color: '#333' },
  subtitle: { color: '#666', marginBottom: '30px' },
  inputBox: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ccc' },
  button: { padding: '12px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  error: { color: 'red', marginTop: '10px' },
  resultBox: { marginTop: '30px', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '10px' },
  resultLabel: { color: '#555', marginBottom: '8px' },
  link: { color: '#4f46e5', fontSize: '1.1rem', wordBreak: 'break-all' },
  copyButton: { marginTop: '12px', padding: '8px 16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default App;