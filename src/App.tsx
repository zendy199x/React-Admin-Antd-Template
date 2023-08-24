import 'dayjs/locale/zh-cn';

import { ConfigProvider, Spin, theme as a } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { history, HistoryRouter } from '@/routes/history';

import { localeConfig, LocaleFormatter } from './locales';
import RenderRouter from './routes';
import { setGlobalState } from './stores/global.store';

const App: React.FC = () => {
  const { locale } = useSelector(state => state.user);
  const { theme, loading } = useSelector(state => state.global);
  const dispatch = useDispatch();

  const setTheme = (dark = true) => {
    dispatch(
      setGlobalState({
        theme: dark ? 'dark' : 'light',
      }),
    );
  };

  /** initial theme */
  useEffect(() => {
    setTheme(theme === 'dark');

    // watch system theme change
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');

      function matchMode(e: MediaQueryListEvent) {
        setTheme(e.matches);
      }

      mql.addEventListener('change', matchMode);
    }
  }, []);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      dayjs.locale('en');
    } else if (locale === 'zh_CN') {
      dayjs.locale('zh-cn');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'zh_CN') {
      return zhCN;
    }
  };

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      componentSize="middle"
      theme={{ token: { colorPrimary: '#13c2c2' }, algorithm: theme === 'dark' ? a.darkAlgorithm : a.defaultAlgorithm }}
    >
      <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
        <HistoryRouter history={history}>
          <Suspense fallback={null}>
            <Spin
              spinning={loading}
              className="app-loading-wrapper"
              tip={<LocaleFormatter id="gloabal.tips.loading" />}
            ></Spin>
            <RenderRouter />
          </Suspense>
        </HistoryRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default App;
