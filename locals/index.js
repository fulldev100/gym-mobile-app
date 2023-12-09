import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import * as SecureStore from 'expo-secure-store';
// localization translated text json files
import en from './en.json';
import it from './it.json';
import ar from './ar.json';
import da from './da.json';
import de from './de.json';
import ca from './ca.json';
import hi from './hi.json';
import fr from './fr.json';
import es from './es.json';
import cs from './cs.json';
import id from './id.json';
import el from './el.json';
import et from './et.json';
import fa from './fa.json';
import ja from './ja.json';
import lt from './lt.json';
import nl from './nl.json';
import hr from './hr.json';
import hu from './hu.json';
import pl from './pl.json';
import pt from './pt.json';
import ro from './ro.json';
import ru from './ru.json';
import tr from './tr.json';
import vi from './vi.json';
import sv from './sv.json';
import zh from './zh.json';
import fi from './fi.json';
import sl from './sl.json';

// Bind to i18n
i18n.translations = {
    fi,
    fa,
    et,
    el,
    cs,
    es,
    en,
    it,
    ar,
    da,
    de,
    es,
    ca,
    hi,
	fr,
	id,
	ja,
	lt,
	nl,
	hr,
	hu,
	pl,
	pt,
	ro,
	ru,
	tr,
	vi,
	sv,
    sl,
	zh
}

// set app to local phones setting

const getLanguage = async() => {
    try {
        const choice = await Localization.locale
        i18n.locale = choice.substr(0, 2)
        i18n.initAsync();
    }  catch (error) {
    }
}

getLanguage()

// export module
export function setLanguage(locale) {
    try {
        i18n.locale = locale

        SecureStore.setItemAsync("lang", locale)
        
        i18n.initAsync();
    }  catch (error) {
    }
}

export async function getLanguageLocal() {
    try {
        return i18n.locale
    }  catch (error) {
        return "en";
    }
}

// export module
export function t(name) {
    return i18n.t(name)
}
