const pageUrlParams = `${window.location.href.slice(window.location.href.indexOf('?'))}`;
const hasLeadFormSubmittedFlag = pageUrlParams.includes('lead=form_submitted');
const hasUtmSourceFlag = pageUrlParams.includes('utm_source');
const customCookieName = 'qu_form_params_custom';

const createCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

const retrieveCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const removeFragments = (params) => {
    const hashIndex = params.indexOf('#');
    return hashIndex > -1 ? params.slice(0, hashIndex) : params;
};

if (hasLeadFormSubmittedFlag && window.dataLayer) {
    window.dataLayer.push({ event: 'form_submission' });
}

if (hasUtmSourceFlag) {
    const sanitizedParams = removeFragments(pageUrlParams);
    const existingCustomCookie = retrieveCookie(customCookieName);

    if (!existingCustomCookie) {
        createCookie(customCookieName, sanitizedParams, 30);
    } else if (existingCustomCookie !== sanitizedParams) {
        createCookie(customCookieName, sanitizedParams, 30);
    }
}

const customInputURL = document.querySelector('.quform-field-1_25');
const savedCookieParams = retrieveCookie(customCookieName);
if (customInputURL) {
    const baseUrl = window.location.href.split('?')[0];
    customInputURL.setAttribute('data-default', savedCookieParams ? `${baseUrl}${savedCookieParams}` : window.location.href);
    customInputURL.value = savedCookieParams ? `${baseUrl}${savedCookieParams}` : window.location.href;
}
