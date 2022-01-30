// Import Config
import { TIMEOUT_SECONDS } from './config';

/**
 * Get JSON data from a url. If the reques takes time > TIMEOUT_SECONDS it throws an error
 * @param {String} url API endpoint
 * @returns data provided by an api based on request
 */
export const getJSON = async function (url) {
  try {
    // Throws an error if request takes longer than TIMEOUT_SECONDS
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(
        `Some error occured while fetching the data. Please check your internet connection! (${res.statusText}, ${res.status})`
      );
    return data;
  } catch (err) {
    // Throw err Object to model
    throw err;
  }
};

/**
 * Promisified timeout rejects a promise if it exeeds a certain time
 * @param {Number} s Seconds
 * @returns a rejected promise after specified time has passed
 */
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
