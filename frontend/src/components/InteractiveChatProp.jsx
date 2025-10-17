import { For, Show, createSignal, createEffect } from 'solid-js';
import './styles/chatHistory.css';

export default function InteractiveChatProp(props) {
  const activeTab = () => props.tabs.find(t => t.id === props.activeTabId);

  const renderContent = (tab) => {
    if (!tab) return null;

    if (tab.type === 'chat') {
      return (
        <div class="chat-container">
          <Show when={props.globalMessages.length === 0}>
            <div class="empty-stateC">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <p>Start chatting with your AI companion!</p>
            </div>
          </Show>
          <For each={props.globalMessages}>
            {(msg) => (
              <div class={`chat-message ${msg.role === 'user' ? 'user' : ''}`}>
                <div class="chat-avatar">{msg.role === 'user' ? '👤' : '🌸'}</div>
                <div class={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                  <p>{msg.text}</p>
                  <span class="chat-time">{msg.time.toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </For>
        </div>
      );
    }

    if (tab.type === 'editor') {
      return <EditorTextarea content={tab.content || ''} onSave={props.onUpdateContent} />;
    }

    if (tab.type === 'browser') {
      return (
        <div class="tab-placeholder">
          <div class="icon">🌐</div>
          <p>Web Browser Tab</p>
        </div>
      );
    }

    if (tab.type === 'images') {
      return (
        <div class="tab-placeholder">
          <div class="icon">🖼️</div>
          <p>AI-generated images appear here</p>
        </div>
      );
    }
  };

  const renderEmptyState = () => (
    <div class="empty-state">
      <div style={{ fontSize: '72px' }}>📑</div>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>No tabs open</p>
      <p style={{ fontSize: '14px', marginTop: '-16px' }}>Create a new tab to get started!</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => props.onCreateTab('chat')}>💬 New Chat</button>
        <button onClick={() => props.onCreateTab('editor')}>📝 New Editor</button>
        <button onClick={() => props.onCreateTab('browser')}>🌐 New Browser</button>
        <button onClick={() => props.onCreateTab('images')}>🖼️ New Images</button>
      </div>
    </div>
  );

  return (
    <div class="chat-history">
      <Show when={props.tabs.length > 0}>
        <div class="tab-bar">
          <div class="tabs-wrapper">
            <For each={props.tabs}>
          {(tab) => {
            let tabRef; // ref for this tab
        
            // Scroll into view if this tab is active
            createEffect(() => {
              if (props.activeTabId === tab.id && tabRef) {
                tabRef.scrollIntoView({
                  behavior: 'smooth',   // smooth animation
                  block: 'nearest',     // vertical alignment
                  inline: 'center'      // horizontal centering
                });
              }
            });
        
            return (
              <div
                ref={tabRef}
                class={`tab ${props.activeTabId === tab.id ? 'active' : ''}`}
                onClick={() => props.onSelectTab(tab.id)}
              >
                <span>{tab.title}</span>
                <button
                  class="tab-close"
                  onClick={(e) => { e.stopPropagation(); props.onCloseTab(tab.id); }}
                >
                  ×
                </button>
              </div>
            );
          }}
        </For>
      
          </div>
          <button class="tab-new-button" onClick={() => props.onCreateTab('chat')}>💬</button>
          <button class="tab-new-button" onClick={() => props.onCreateTab('editor')}>📝</button>
          <button class="tab-new-button" onClick={() => props.onCreateTab('browser')}>🌐</button>
          <button class="tab-new-button" onClick={() => props.onCreateTab('images')}>🖼️</button>
        </div>
      </Show>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Show when={props.tabs.length > 0} fallback={renderEmptyState()}>
          {renderContent(activeTab())}
        </Show>
      </div>
    </div>
  );
}

// Editor Component
function EditorTextarea(props) {
  const [text, setText] = createSignal(props.content);
  const [isSaved, setIsSaved] = createSignal(true);

  createEffect(() => {
    setText(props.content);
    setIsSaved(true);
  });

  const handleSave = () => {
    props.onSave(text());
    setIsSaved(true);
  };

  return (
    <div class="editor-container">
      <div class="editor-toolbar">
        <button
          class={`editor-save-button ${isSaved() ? 'saved' : 'unsaved'}`}
          onClick={handleSave}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isSaved() ? '💾 Saved' : '💾 Save'}
        </button>
        <span class="editor-status" style={{ color: isSaved() ? '#4CAF50' : '#ff6b9d' }}>
          {isSaved() ? '✓ All changes saved' : '● Unsaved changes'}
        </span>
      </div>
      <textarea
        class="editor-textarea"
        placeholder="// Type your code here..."
        value={text()}
        onInput={(e) => {
          setText(e.currentTarget.value);
          setIsSaved(false);
        }}
      />
    </div>
  );
}
