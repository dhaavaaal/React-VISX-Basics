import logo from "./logo.svg";
import "./App.css";
import { useTranslation, Trans } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  de: { nativeName: "Deutsch" },
};

function App() {
  const { t, i18n } = useTranslation();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {Object.keys(lngs).map((lng) => (
            <button
              type="submit"
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
              disabled={i18n.resolvedLanguage === lng}
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
        <p>
          <Trans i18nKey="description">
            Edit <code>src/App.js</code> and save to reload.
          </Trans>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("learn")}
          {/* Learn React */}
        </a>
        <p>{t("new.key", "This will be added automatically.")}</p>
        <p>{t("This will be added automatically.")}</p>
      </header>
    </div>
  );
}

export default App;
