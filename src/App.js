import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    try {
      const newUrl = new URL(url);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!url) {
      setError('Please enter a URL!');
      return;
    }
    if (!validateUrl(url)) {
      setError('Invalid URL! Please enter a valid URL (e.g. https://google.com)');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('https://url-shortener-api-latest-66j8.onrender.com/api/Urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(url) 
      });

      if (response.ok) {
        // BƯỚC QUAN TRỌNG: Đọc dạng JSON thay vì Text
        const data = await response.json(); 
        
        // Lấy đúng cái shortCode từ trong đống data Thiện gửi về
        const code = data.shortCode; 
        
        // Ghép code vào link để hiển thị cho đẹp
        const fullShortUrl = `https://url-shortener-api-latest-66j8.onrender.com/api/Urls/${code}`;
        setShortUrl(fullShortUrl);
      } else {
        setError('Server returned an error. Please check your URL.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          style={{
            ...styles.input,
            border: error ? '2px solid red' : '1px solid #ccc'
          }}
        />
        <button onClick={handleShorten} style={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Shorten'}
        </button>
      </div>

      {error && <p style={styles.error}>⚠️ {error}</p>}

      {shortUrl && (
        <div style={styles.resultBox}>
          <p style={styles.resultLabel}>Your short link:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.link}>
            {shortUrl}
          </a>
          <br />
          <button onClick={handleCopy} style={styles.copyButton}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '80px auto', fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '0 20px' },
  title: { fontSize: '2.5rem', color: '#333', marginBottom: '10px' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '1.1rem' },
  inputBox: { display: 'flex', gap: '10px', marginBottom: '10px' },
  input: { flex: 1, padding: '14px', fontSize: '1rem', borderRadius: '8px', outline: 'none' },
  button: { padding: '14px 25px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  error: { color: '#dc2626', marginTop: '10px', fontWeight: 'bold' },
  resultBox: { marginTop: '30px', padding: '25px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' },
  resultLabel: { color: '#166534', marginBottom: '10px', fontWeight: 'bold' },
  link: { color: '#4f46e5', fontSize: '1.2rem', wordBreak: 'break-all', textDecoration: 'none', fontWeight: '500' },
  copyButton: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }
};

export default App;