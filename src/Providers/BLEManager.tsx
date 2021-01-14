import React, { createContext, useEffect, useState } from 'react'
import { BleError, BleManager, Characteristic, Device, Service } from 'react-native-ble-plx';
import { Buffer } from "buffer";
import { Alert } from 'react-native';
interface BLEManagerProps {

}
export type NetworkInfo = {
  ssid: string,
  rssi: string
}

export type NetworkList = {
  networks: NetworkInfo[]
}

export const BLEContext = createContext<{
  devices: Device[] | [],
  scanning: boolean,
  scan: () => void,
  stopScan: () => void,
  getNetworksFromDevice: (device: Device) => Promise<NetworkList | null>,
  clearDevices: () => void,
  connectToDevice: (device: Device) => void;
  sendWifiCredsToDevice: (creds: { ssid: string, pwd: string }) => void;
  connectedDevice: Device | null;
  scanningWifi: boolean;
}>({
  devices: [],
  scanning: false,
  scan: () => { },
  stopScan: () => { },
  getNetworksFromDevice: async (device: Device) => null,
  clearDevices: () => { },
  connectToDevice: () => { },
  sendWifiCredsToDevice: (creds: { ssid: string, pwd: string }) => { },
  connectedDevice: null,
  scanningWifi: false
})

export const BLEManager: React.FC<BLEManagerProps> = ({ children }) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [bleManager, setBleManager] = useState<BleManager>();
  const [bleState, setBleState] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [scanningWifi, setScanningWifi] = useState<boolean>(false);

  useEffect(() => {
    const subscription = bleManager?.onStateChange((state) => {
      console.log(state)
      if (state === 'PoweredOn') {
        setBleState(true);
        subscription?.remove();
      }
    }, true);

    return () => {
      subscription?.remove();
    }
  }, [bleManager])

  useEffect(() => {
    if (connectedDevice) {
      connectedDevice.onDisconnected((bleError: BleError | null, dvc: Device) => {
        setConnectedDevice(null);
      })
    }
  }, [connectedDevice])


  useEffect(() => {
    console.log("CREATING BLE MANAGER");

    setBleManager(new BleManager());
    if (!bleManager) {
      console.log("no BLE Manager")
    }
    return () => {
      if (bleManager) {
        bleManager.destroy();
      }
    }
  }, []);

  function clearDevices() {
    if (connectedDevice) {
      connectedDevice.cancelConnection();
    }
    setDevices([]);
  }

  async function scan() {
    if (!bleState) {
      console.log("Ble not on");

    }
    setDevices([]);
    setScanning(true);
    console.log("SCANNING");

    bleManager?.startDeviceScan(null, null, async (error: BleError | null, device: Device | null) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log(error?.reason)
        return
      }

      if (!device) {
        console.log("didnt find any device");

        return
      }
      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      try {
        if (!device.localName) {
          console.log("no local name")
          return
        }
        if (device.localName.includes("ESP32")) {
          console.log("found device!")
          device.localName = "KegerWeighter"
          let cp = devices.slice();
          cp.push(device);
          setDevices(cp);
          setScanning(false);
          bleManager?.stopDeviceScan();
        }
      } catch (e) {
        console.log(e.message)
      }
    });
  }

  async function stopScan() {
    if (bleManager) {
      bleManager.stopDeviceScan();
    }
  }

  async function connectToDevice(device: Device): Promise<boolean> {
    await bleManager?.connectToDevice(device.id).then((connDevice: Device) => {
      console.log('connected to device');
      setConnectedDevice(connDevice);
      //   connDevice.onDisconnected((error: BleError | null, device: Device) => {
      //     if (error) {
      //       Alert.alert(error.message);
      //       return false;
      //     }
      //     Alert.alert("Device disconnected");
      //     setConnectedDevice(null);
      //     return true;
      //   })
    });
    return true;
  }

  async function getNetworksFromDevice(): Promise<NetworkList | null> {
    if (!connectedDevice) {
      console.log('no device connected');
      return null;
    }
    setScanningWifi(true);

    return bleManager?.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id).then((dev: Device) => {
      return bleManager?.servicesForDevice(connectedDevice.id).then(async (services: Service[]) => {
        let charictaristics: Characteristic[] = await services[0].characteristics();
        let value = await charictaristics[0].read();
        if (!value.value) {
          return
        };
        let networks = JSON.parse(Buffer.from(value.value, "base64").toString());
        console.log(networks);
        setScanningWifi(false)
        return networks;
      })
    })
  }

  async function sendWifiCredsToDevice(creds: { ssid: string, pwd: string }) {
    if (!connectedDevice) {
      return
    }
    return bleManager?.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id).then((dev: Device) => {
      return bleManager?.servicesForDevice(connectedDevice.id).then(async (services: Service[]) => {
        let charictaristics: Characteristic[] = await services[0].characteristics();
        let value = await charictaristics[0]
        if (!value.value) {
          return
        };
        let resp = JSON.stringify({ ssid: creds.ssid, pwd: creds.pwd });
        value.writeWithResponse(Buffer.from(resp).toString("base64")).then((x) => console.log(x));
        charictaristics[0].writeWithoutResponse(Buffer.from(resp).toString("base64")).then((x) => console.log(x))
      });
    });
  };


  // async function getNetworksFromDevice(device: Device): Promise<any> {
  //   return bleManager?.connectToDevice(device.id).then((device) => {
  //     return bleManager?.discoverAllServicesAndCharacteristicsForDevice(device.id).then((dev: Device) => {
  //       return bleManager?.servicesForDevice(device.id).then(async (services: Service[]) => {
  //         let charictaristics: Characteristic[] = await services[0].characteristics();
  //         let value = await charictaristics[0].read();
  //         if (!value.value) {
  //           return
  //         };
  //         let networks = JSON.parse(Buffer.from(value.value, "base64").toString());
  //         console.log(networks);
  //         let resp = JSON.stringify({ ssid: "MySpectrumWiFi88-2G", pwd: "littletruck155" });
  //         value.writeWithResponse(Buffer.from(resp).toString("base64")).then((x) => console.log(x));
  //         charictaristics[0].writeWithoutResponse(Buffer.from(resp).toString("base64")).then((x) => console.log(x))
  //         return networks;
  //       });
  //     });
  //   });
  // }

  return (
    <BLEContext.Provider value={{ scanning, devices, scan, getNetworksFromDevice, clearDevices, connectToDevice, connectedDevice, sendWifiCredsToDevice, scanningWifi, stopScan }}>
      {children}
    </BLEContext.Provider>
  );
}