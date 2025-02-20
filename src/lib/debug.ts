function uid() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0]
}

export function setup() {
    window.__TAURI_INTERNALS__ = {
        metadata: {
            currentWebview: {
                label: "main",
            },
            currentWindow: {
                label: "main",
            }
        },
        invoke: (cmd: string, data, options) => {
            return new Promise(function (resolve, reject) {
                const callback = window.__TAURI_INTERNALS__.transformCallback(function (
                    r
                  ) {
                    resolve(r)
                    delete window[`_${error}`]
                  }, true)
                  const error = window.__TAURI_INTERNALS__.transformCallback(function (
                    e
                  ) {
                    reject(e)
                    delete window[`_${callback}`]
                  }, true)

                fetch(`http://localhost:8080/main/${cmd}`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                      "Content-Type": 'application/json',
                      "Tauri-Callback": callback,
                      "Tauri-Error": error,
                      "Tauri-Invoke-Key": 'h0Sz6vD2w#Je1dIWgmoz',
                    },
                  })
                    .then((response) => {
                      const cb =
                        response.headers.get("Tauri-Response") === "ok" ? callback : error;
                      // we need to split here because on Android the content-type gets duplicated
                      switch ((response.headers.get("content-type") || "").split(",")[0]) {
                        case "application/json":
                          return response.json().then((r) => [cb, r]);
                        case "text/plain":
                          return response.text().then((r) => [cb, r]);
                        default:
                          return response.arrayBuffer().then((r) => [cb, r]);
                      }
                    })
                    .then(([cb, data]) => {
                      if (window[`_${cb}`]) {
                        window[`_${cb}`](data);
                      } else {
                        console.warn(
                          `[TAURI] Couldn't find callback id {cb} in window. This might happen when the app is reloaded while Rust is running an asynchronous operation.`
                        );
                      }
                    });
            })
        },
        transformCallback: (callback, once) => {
            var identifier = uid()
            var prop = `_${identifier}`
      
            Object.defineProperty(window, prop, {
              value: (result) => {
                if (once) {
                  Reflect.deleteProperty(window, prop)
                }
      
                return callback && callback(result)
              },
              writable: false,
              configurable: true
            })
      
            return identifier
        }
        
    }

}