import axios from "axios";
import * as WebFont from "webfontloader";

const API_KEY = "AIzaSyDNOXY-FJ0rMylNSR0W1HtssQXQzZx3cfE";

export const list = async () => {
  const res = await axios.get(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`
  );
  return res.data.items;
};

export const load = async (families: string[]) => {
  WebFont.load({
    google: {
      families,
    },
  });
};
