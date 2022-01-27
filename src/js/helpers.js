import { TIMEOUT_SECONDS } from './config';

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `Some error occured while fetching the data. Please check your internet connection! (${res.statusText}, ${res.status})`
      );
    return data;
  } catch (err) {
    throw err;
  }
};

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(
          `Your request took too long! [Stopped fetching after ${s} second]. Please check your internet connection and reload the website!`
        )
      );
    }, s * 1000);
  });
};