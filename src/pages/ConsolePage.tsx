import './ConsolePage.scss';
import { useContexts } from '../providers/AppProvider';
import { NightMode } from '../components/NightMode';
import Caption from '../components/Caption';
import BingSearchResult from '../components/functions/BingSearchResult';
import PaintingResult from '../components/functions/PaintingResult';
import TrafficMonitor from '../components/functions/TrafficMonitor';
import FunctionsList from '../components/functions/FunctionsList';
import { ConsolePageRealtime } from './ConsolePageRealtime';
import { ConsolePageAssistant } from './ConsolePageAssistant';
import {
  ASSISTANT_TYPE_ASSISTANT,
  ASSISTANT_TYPE_DEEPSEEK,
  ASSISTANT_TYPE_DEFAULT,
  ASSISTANT_TYPE_REALTIME,
} from '../lib/const';
import { AlertTriangle } from 'react-feather';
import AboutApp from '../components/AboutApp';
import { ConsolePageDeepSeek } from './ConsolePageDeepSeek';
import GithubLink from '../components/GithubLink';
import { getFunctionsFromUrl, getPromptFromUrl } from '../lib/helper';
import { useEffect } from 'react';
import AppMessage from '../components/AppMessage';

export function ConsolePage() {
  const { isDebugMode, setIsDebugMode } = useContexts();

  const assistantType =
    localStorage.getItem('assistantType') || ASSISTANT_TYPE_DEFAULT;
  const isAssistant = assistantType === ASSISTANT_TYPE_ASSISTANT;
  const isRealtime = assistantType === ASSISTANT_TYPE_REALTIME;
  const isDeepSeek = assistantType === ASSISTANT_TYPE_DEEPSEEK;

  useEffect(() => {
    const timer = setInterval(async () => {
      await getPromptFromUrl();
      await getFunctionsFromUrl();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  function IsDebugMode() {
    if (!isDebugMode) {
      return null;
    }

    return (
      <span onClick={() => setIsDebugMode(false)}>
        <AlertTriangle />
      </span>
    );
  }

  /**
   * Render the application
   */
  return (
    <div data-component="ConsolePage">
      <Caption />

      <div className="content-top">
        <div className="content-title">
          <img src="/logomark.svg" alt="logo" />
          <h1>AI Agent Playground</h1>
          <a
            href="https://github.com/theodoreniu/ai-agent-playground"
            target="_blank"
            style={{ marginTop: 0, top: 0, display: 'none' }}
          >
            <img
              src="https://img.shields.io/github/v/tag/theodoreniu/ai-agent-playground"
              style={{ width: '100%', height: '20px' }}
              alt="logo"
            />
          </a>
        </div>
        <span className="functions">
          <BingSearchResult />
          <TrafficMonitor />
          <PaintingResult />
          <IsDebugMode />
          <NightMode />
          <FunctionsList />
          <AppMessage />
          <GithubLink />
          <AboutApp />
        </span>
      </div>

      <div className="content-main">
        {isRealtime && <ConsolePageRealtime />}
        {isAssistant && <ConsolePageAssistant />}
        {isDeepSeek && <ConsolePageDeepSeek />}
      </div>
    </div>
  );
}
