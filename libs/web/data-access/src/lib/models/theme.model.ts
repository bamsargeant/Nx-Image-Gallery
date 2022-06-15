export interface Theme {
  name: string;
  properties: any;
}

export const light: Theme = {
  name: 'light',
  properties: {
    '--foreground-default': '#08090A',
    '--foreground-secondary': '#41474D',
    '--foreground-tertiary': '#797C80',
    '--foreground-quaternary': '#F4FAFF',
    '--foreground-light': '#41474D',

    '--background-default': '#F4FAFF',
    '--background-secondary': '#A3B9CC',
    '--background-tertiary': '#5C7D99',
    '--background-light': '#FFFFFF',

    '--primary-default': '#5DFDCB',
    '--primary-dark': '#24B286',
    '--primary-light': '#B2FFE7',

    '--error-default': '#EF3E36',
    '--error-dark': '#800600',
    '--error-light': '#FFCECC',

    '--background-tertiary-shadow': '0 1px 3px 0 rgba(92, 125, 153, 0.5)',

    '--slide-toggle-padding': '2px',
    '--slide-toggle-width': '30px',
    '--slide-toggle-height':
      'calc(var(--slide-toggle-width) / 2 + var(--slide-toggle-padding))',
    '--slide-toggle-background-colour': '#15273b',
    '--slide-toggle-background-colour-selected': '#ccc',

    '--btn-text-colour': '#FFFFFF',
    '--btn-background-colour': '#3277B3',

    '--main-background-default': '#FFFFFF',
    '--banner-background-default': '#DEE4E7',
    '--footer-background-default': '#DEE4E7',
    '--card-background-default': '#DEE4E7',

    '--banner-header-colour-default': '#222222',
    '--card-text-colour-default': '#222222',
    '--footer-text-colour-default': '#222222',

    '--header-height': '5.51rem',
    '--footer-height': '6rem',
  },
};

export const dark: Theme = {
  name: 'dark',
  properties: {
    '--foreground-default': '#5C7D99',
    '--foreground-secondary': '#A3B9CC',
    '--foreground-tertiary': '#F4FAFF',
    '--foreground-quaternary': '#E5E5E5',
    '--foreground-light': '#FFFFFF',

    '--background-default': '#797C80',
    '--background-secondary': '#41474D',
    '--background-tertiary': '#08090A',
    '--background-light': '#41474D',

    '--primary-default': '#5DFDCB',
    '--primary-dark': '#24B286',
    '--primary-light': '#B2FFE7',

    '--error-default': '#EF3E36',
    '--error-dark': '#800600',
    '--error-light': '#FFCECC',

    '--background-tertiary-shadow': '0 1px 3px 0 rgba(8, 9, 10, 0.5)',

    '--slide-toggle-padding': '2px',
    '--slide-toggle-width': '30px',
    '--slide-toggle-height':
      'calc(var(--slide-toggle-width) / 2 + var(--slide-toggle-padding))',
    '--slide-toggle-background-colour': '#ccc',
    '--slide-toggle-background-colour-selected': '#15273b',

    '--btn-text-colour': '#FFFFFF',
    '--btn-background-colour': '#276d89',

    '--main-background-default': '#222222',
    '--banner-background-default': '#37474F',
    '--footer-background-default': '#37474F',
    '--card-background-default': '#37474F',

    '--banner-header-colour-default': '#FFFFFF',
    '--card-text-colour-default': '#FFFFFF',
    '--footer-text-colour-default': '#FFFFFF',

    '--header-height': '5.5rem',
    '--footer-height': '6rem',
  },
};
