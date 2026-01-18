import * as Network from "expo-network";

// My Home router ip
export let BASE_URL = "http://172.16.2.33:5000"; 

// initialize dynamic IP at app startup
export async function initBaseUrl() {
  try {
    const ip = await Network.getIpAddressAsync();
    if (ip) BASE_URL = `http://${ip}:5000`;
  } catch {
    BASE_URL = "http://localhost:5000";
  }
}


/*
  Previously, my backend server was running on localhost:5000. 
  This setup made it difficult to test the backend from other 
  devices on the same network.

  To solve this, I created `initBaseUrl()`. 
  It automatically retrieves the device's current local IP 
  address and updates `BASE_URL` to `http://<device-ip>:5000`. 

  This allows multiple devices on the same Wi-Fi network to 
  access the backend server during development.

  You only need to call `initBaseUrl()` **once**, typically in
  the AuthContext, like this:

    useEffect(() => {
      async function setup() {
        await initBaseUrl();
      }
      setup();
    }, []);
*/






