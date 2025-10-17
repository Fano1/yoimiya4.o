import { createSignal, For, Show } from 'solid-js';
import InteractiveChatProp from './components/InteractiveChatProp';
import ModelViewer from './components/ModelViewer';
import InputSection from './components/InputSection';
import AccountLogo from './components/AccountLogo';
import './App.css';

function App() {
  // Global chat history (shared across all chat tabs)
  const [globalMessages, setGlobalMessages] = createSignal([]);
  
  // Tab management - start with empty state
  const [tabs, setTabs] = createSignal([]);
  const [activeTabId, setActiveTabId] = createSignal(null);
  const [nextId, setNextId] = createSignal(1);

  // Get active tab
  const activeTab = () => tabs().find(t => t.id === activeTabId());

  // Rename tabs based on their type
  const renumberTabs = (tabList) => {
    const typeCounts = { chat: 0, editor: 0, browser: 0, images: 0 };
    return tabList.map(tab => {
      typeCounts[tab.type]++;
      const count = typeCounts[tab.type];
      const titles = { chat: 'Chat', editor: 'Editor', browser: 'Browser', images: 'Images' };
      return { ...tab, title: count === 1 ? titles[tab.type] : `${titles[tab.type]} ${count}` };
    });
  };

  // Create new tab
  const createTab = (type) => {
    const id = nextId();
    const newTabs = [...tabs(), { id, type, title: '', content: '' }];
    setTabs(renumberTabs(newTabs));
    setActiveTabId(id);
    setNextId(id + 1);
  };

  // Close tab
  const closeTab = (id) => {
    const index = tabs().findIndex(t => t.id === id);
    const newTabs = tabs().filter(t => t.id !== id);
    setTabs(renumberTabs(newTabs));
    
    // If closing the active tab
    if (activeTabId() === id) {
      if (newTabs.length > 0) {
        setActiveTabId(newTabs[Math.min(index, newTabs.length - 1)].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  // Send message
  const sendMessage = (text) => {
    const tab = activeTab();
    if (!tab || tab.type !== 'chat') return;

    // Add user message to global history
    setGlobalMessages([...globalMessages(), { role: 'user', text, time: new Date() }]);

    // AI response after delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more~",
        "I see what you mean! ✨",
        "You're so creative! 💕"
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setGlobalMessages([...globalMessages(), { role: 'ai', text: reply, time: new Date() }]);
    }, 800);
  };

  // Update tab content - use batch update to prevent re-render issues
  const updateContent = (content) => {
    const currentActiveId = activeTabId();
    setTabs(prevTabs => 
      prevTabs.map(t => 
        t.id === currentActiveId ? { ...t, content } : t
      )
    );
  };

  return (
    <div class="app-container">
      <div class="account-area">
        <AccountLogo />
      </div>
      
      <div class="chat-area">
        <InteractiveChatProp
          tabs={tabs()}
          activeTabId={activeTabId()}
          globalMessages={globalMessages()}
          onSelectTab={setActiveTabId}
          onCreateTab={createTab}
          onCloseTab={closeTab}
          onUpdateContent={updateContent}
        />
      </div>

      <div class="model-area">
        <ModelViewer />
      </div>
      
      <div class="input-area">
        <InputSection onSend={sendMessage} />
      </div>
    </div>
  );
}

export default App;