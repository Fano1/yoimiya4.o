import { createSignal } from 'solid-js';

export default function InputSection(props) {
  const [text, setText] = createSignal('');
  const [recording, setRecording] = createSignal(false);

  const handleSend = () => {
    if (text().trim()) {
      props.onSend(text());
      setText('');
    }
  };

  const handleVoice = () => {
    setRecording(true);
    setTimeout(() => {
      setText('Voice transcription would appear here...');
      setRecording(false);
    }, 2000);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid #3a3a5c',
      'border-radius': '16px',
      padding: '16px',
      display: 'flex',
      gap: '12px',
      'align-items': 'center'
    }}>
      <button
        onClick={handleVoice}
        style={{
          background: recording() ? '#ff6b9d' : 'rgba(255, 255, 255, 0.1)',
          border: '2px solid #3a3a5c',
          'border-radius': '12px',
          color: '#fff',
          'font-size': '24px',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
        🎤
      </button>
      
      <input
        type="text"
        placeholder="Type your message..."
        value={text()}
        onInput={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid #3a3a5c',
          'border-radius': '12px',
          color: '#fff',
          padding: '12px 16px',
          'font-size': '16px',
          outline: 'none'
        }}
      />
      
      <button
        onClick={handleSend}
        style={{
          background: 'linear-gradient(135deg, #6c5ce7 0%, #c06c84 100%)',
          border: 'none',
          'border-radius': '12px',
          color: '#fff',
          padding: '12px 24px',
          'font-size': '16px',
          'font-weight': 'bold',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Send
      </button>
    </div>
  );
}
