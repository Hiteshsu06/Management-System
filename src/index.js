import React from 'react';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

// custom imports
import App from './App';
import './index.css';

// External libraries
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import englishMessage from './locales/en/message.json';
import hindiMessage from './locales/hi/messages.json';
import swedishMessage from './locales/sv/message.json';
import { GoogleOAuthProvider } from '@react-oauth/google';

const language = localStorage.getItem('i18nextLng');
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

i18next.init({
    interpolation: { escapeValue: false },
    lng: language || 'en',
    resources: {
        en: {
            msg: englishMessage,
        },
        hi: {
            msg: hindiMessage,
        },
        sv: {
            msg: swedishMessage,
      },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={`${googleClientId}`}>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

reportWebVitals();