import { Global } from '@emotion/react'

// Add installed fonts here

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Poppins';
        font-style: regular;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/Poppins-Regular.ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: 'Poppins';
        font-style: semibold;
        font-weight: 600;
        font-display: swap;
        src: url('./fonts/Poppins-SemiBold.ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: 'Poppins';
        font-style: italic;
        font-weight: 600;
        font-display: swap;
        src: url('./fonts/Poppins-SemiBoldItalic.ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: 'Orbitron';
        font-style: medium;
        font-weight: 500;
        font-display: swap;
        src: url('./fonts/Orbitron-Medium.ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: 'Orbitron';
        font-style: bold;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/Orbitron-Bold.ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: 'Rogan';
        font-style: bold;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/Rogan-Bold.ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      /* latin */
      @font-face {
        font-family: 'Roobert';
        font-style: light;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/Roobert-Light.otf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

    `}
  />
);

export default Fonts
