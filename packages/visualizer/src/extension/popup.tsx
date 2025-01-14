/// <reference types="chrome" />
import { ConfigProvider, Tabs } from 'antd';
import ReactDOM from 'react-dom/client';
import { setSideEffect } from '../init';
import './popup.less';

import { globalThemeConfig } from '@/component/color';
import Logo from '@/component/logo';
import {
  Playground,
  extensionAgentForTabId,
} from '@/component/playground-component';
import { useChromeTabInfo } from '@/component/store';
import { useEnvConfig } from '@/component/store';
import { ApiOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import Bridge from './bridge';
import { getExtensionVersion } from './utils';

setSideEffect();

declare const __VERSION__: string;

function PlaygroundPopup() {
  const extensionVersion = getExtensionVersion();
  const { tabId } = useChromeTabInfo();
  const tabIdRef = useRef<number | null>(null);
  const { popupTab, setPopupTab, trackingActiveTab } = useEnvConfig();

  useEffect(() => {
    if (tabId) {
      tabIdRef.current = tabId;
    }
  }, [tabId]);

  const items = [
    {
      key: 'playground',
      label: 'Playground',
      icon: <SendOutlined />,
      children: (
        <div className="popup-playground-container">
          <Playground
            hideLogo
            getAgent={() => {
              return extensionAgentForTabId(() => {
                if (trackingActiveTab) {
                  return tabIdRef.current || 0;
                }
                return tabId || 0;
              });
            }}
            showContextPreview={false}
          />
        </div>
      ),
    },
    {
      key: 'bridge',
      label: 'Bridge Mode',
      children: (
        <div className="popup-bridge-container">
          <Bridge />
        </div>
      ),
      icon: <ApiOutlined />,
    },
  ];

  return (
    <ConfigProvider theme={globalThemeConfig()}>
      <div className="popup-wrapper">
        <div className="popup-header">
          <Logo withGithubStar={true} />
          <p>
            Automate browser actions, extract data, and perform assertions using
            AI, including a Chrome extension, JavaScript SDK, and support for
            scripting in YAML.{' '}
            <a href="https://midscenejs.com/" target="_blank" rel="noreferrer">
              Learn more
            </a>
          </p>
        </div>
        <div className="tabs-container">
          <Tabs
            defaultActiveKey="playground"
            activeKey={popupTab}
            items={items}
            onChange={(key) => setPopupTab(key as 'playground' | 'bridge')}
          />
        </div>

        <div className="popup-footer">
          <p>
            Midscene.js Chrome Extension v{extensionVersion} (SDK v{__VERSION__}
            )
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
}

const element = document.getElementById('root');
if (element) {
  const root = ReactDOM.createRoot(element);
  root.render(<PlaygroundPopup />);
}

// const shotAndOpenPlayground = async (
//   agent?: ChromeExtensionProxyPageAgent | null,
// ) => {
//   if (!agent) {
//     message.error('No agent found');
//     return;
//   }
//   const context = await agent.getUIContext();

//   // cache screenshot when page is active
//   const { id } = await sendToWorker<
//     WorkerRequestSaveContext,
//     WorkerResponseSaveContext
//   >(workerMessageTypes.SAVE_CONTEXT, {
//     context,
//   });
//   const url = getPlaygroundUrl(id);
//   chrome.tabs.create({
//     url,
//     active: true,
//   });
// };

// const handleSendToPlayground = async () => {
//   if (!tabId || !windowId) {
//     message.error('No active tab or window found');
//     return;
//   }
//   setLoading(true);
//   try {
//     const agent = extensionAgentForTabId(tabId);
//     await shotAndOpenPlayground(agent);
//     await agent!.page.destroy();
//   } catch (e: any) {
//     message.error(e.message || 'Failed to launch Playground');
//   }
//   setLoading(false);
// };
