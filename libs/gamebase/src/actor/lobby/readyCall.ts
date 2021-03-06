import * as http from "http";
import * as https from "https";

export default function readyCall(callbackUrl: string) {
  return httpRequest(callbackUrl, {
    method: "PUT",
  });
}

function httpRequest(url: string, requestArgs: http.ClientRequestArgs) {
  return new Promise<void>((resolve, reject) => {
    const request = url.startsWith("https:") ? https.request : http.request;
    const req = request(url, requestArgs, async (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`${res.statusCode} ${res.statusMessage}`));
      } else {
        try {
          res.destroy();
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    });
    req.end();
  });
}
