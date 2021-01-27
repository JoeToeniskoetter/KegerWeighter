import React, { createContext, useEffect, useState } from 'react'
import { BleError, BleManager, Characteristic, Device, Service, State, Subscription } from 'react-native-ble-plx';
import { Buffer } from "buffer";
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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
  getDeviceConnectionStatus: () => Promise<boolean | undefined>,
  clearDevices: () => void,
  connectToDevice: (device: Device) => void;
  sendWifiCredsToDevice: (creds: { ssid: string, pwd: string }) => Promise<boolean | undefined>;
  connectedDevice: Device | null;
  scanningWifi: boolean;
  connectingWifi: boolean;
  restartDevice: () => void;
  bleState: boolean;
  bleError: boolean;
}>({
  devices: [],
  scanning: false,
  scan: () => { },
  stopScan: () => { },
  getNetworksFromDevice: async (device: Device) => null,
  getDeviceConnectionStatus: async () => undefined,
  clearDevices: () => { },
  connectToDevice: () => { },
  sendWifiCredsToDevice: async (creds: { ssid: string, pwd: string }) => undefined,
  connectedDevice: null,
  scanningWifi: false,
  connectingWifi: false,
  restartDevice: () => { },
  bleState: false,
  bleError: false
})

export const BLEManager: React.FC<BLEManagerProps> = ({ children }) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [bleManager, setBleManager] = useState<BleManager>();
  const [bleState, setBleState] = useState<boolean>(false);
  const [bleError, setBleError] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [scanningWifi, setScanningWifi] = useState<boolean>(false);
  const [connectingWifi, setConnectingWifi] = useState<boolean>(false);

  const SERVICE_UUID = "0000aaaa-ead2-11e7-80c1-9a214cf093ae";
  const WIFI_UUID = "00005555-ead2-11e7-80c1-9a214cf093ae";
  const WIFI_CONNECTED_UUID = "00006666-ead2-11e7-80c1-9a214cf093ae";

  let disConnectSubscription: Subscription | undefined = undefined;

  useEffect(() => {
    const subscription = bleManager?.onStateChange((state) => {
      console.log(state)
      if (state === 'PoweredOn') {
        setBleState(true);
        subscription?.remove();
      }
      if (state === 'Unsupported' || state === 'Unauthorized') {
        setBleState(false);
        subscription?.remove();
      }
    }, true);

    return () => {
      subscription?.remove();
      setDevices([]);
      disConnectSubscription?.remove();
    }
  }, [bleManager])

  // useEffect(() => {
  //   subscription = bleManager?.onDeviceDisconnected(connectedDevice?.id || '', (error: BleError | null, device: Device | null) => {
  //     console.log('Disconnect from BLE listener')
  //     setConnectedDevice(null);
  //   })
  //   return subscription?.remove();
  // }, [connectedDevice])

  useEffect(() => {
    console.log("CREATING BLE MANAGER");

    setBleManager(new BleManager());
    if (!bleManager) {
      console.log("no BLE Manager")
    }
    const disconnectListener = connectedDevice?.onDisconnected((bleError: BleError | null, dvc: Device) => {
      console.log('Disconnect from device listener')
      setConnectedDevice(null);
    });


    return () => {
      if (bleManager) {
        bleManager.destroy();
      }
      disconnectListener?.remove();
    }
  }, []);

  function clearDevices() {
    if (connectedDevice) {
      connectedDevice.cancelConnection();
    }
    setDevices([]);
  }

  async function scan() {
    if (!bleManager) {
      return
    }
    setDevices([]);
    setScanning(true);

    bleManager?.startDeviceScan(null, null, async (error: BleError | null, device: Device | null) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log('ERROR IN SCAN ', error?.reason)
        setBleError(true);
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
        console.log('ERROR in DEVICE ', e.message);
        setBleError(true)
      }
    });
  }

  async function stopScan() {
    if (bleManager) {
      bleManager.stopDeviceScan();
      setBleError(false)
    }
  }

  async function connectToDevice(device: Device): Promise<boolean> {
    await bleManager?.connectToDevice(device.id).then((connDevice: Device) => {
      setConnectedDevice(connDevice);
      disConnectSubscription = connectedDevice?.onDisconnected((bleError: BleError | null, dvc: Device) => {
        console.log('Disconnect from device listener')
        setConnectedDevice(null);
      });
    });
    return true;
  }

  async function getNetworksFromDevice(): Promise<NetworkList | null> {
    if (!connectedDevice) {
      console.log('no device connected');
      return null;
    }
    setScanningWifi(true);

    return bleManager?.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id).then(async (dev: Device) => {
      const services = await dev.services();
      const wifiService: Service | undefined = services.filter(serv => serv.uuid === SERVICE_UUID)[0];

      if (!wifiService) {
        return
      }

      let charictaristics: Characteristic[] = await wifiService.characteristics();

      const wifiChar = charictaristics.filter(char => char.uuid === WIFI_UUID);

      if (!wifiChar) {
        return
      }

      let value = await charictaristics[0].read();
      if (!value.value) {
        return
      };
      let networks = JSON.parse(Buffer.from(value.value, "base64").toString());
      console.log(networks);
      setScanningWifi(false)
      return networks;
    })
  }

  async function getDeviceConnectionStatus(): Promise<boolean | undefined> {
    if (!connectedDevice) {
      console.log('no device connected');
      return false;
    }
    setConnectingWifi(true);

    const services = await connectedDevice.services();
    const wifiService: Service | undefined = services.filter(serv => serv.uuid === SERVICE_UUID)[0];

    if (!wifiService) {
      return
    }

    let charictaristics: Characteristic[] = await wifiService.characteristics();

    const wifiChar = charictaristics.filter(char => char.uuid === WIFI_CONNECTED_UUID)[0];

    if (!wifiChar) {
      return
    }

    let value = await wifiChar.read();
    if (!value.value) {
      return
    };
    let isConnected = Buffer.from(value.value, "base64").toString();
    console.log("CONNECTED: ", isConnected)
    console.log(isConnected);
    setConnectingWifi(false);
    return isConnected === 'true' ? true : false;
  }

  // return bleManager?.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id).then((dev: Device) => {
  //   return bleManager?.servicesForDevice(connectedDevice.id).then(async (services: Service[]) => {
  //     let charictaristics: Characteristic[] = await services[0].characteristics();
  //     console.log(charictaristics)
  //     let connectedStatus = await charictaristics[1].read();
  //     if (!connectedStatus.value) {
  //       console.log("no value two");
  //       setConnectingWifi(false);
  //       return false;
  //     }
  //     let isConnected = Buffer.from(connectedStatus.value, "base64").toString();
  //     console.log("CONNECTED: ", isConnected)
  //     setConnectingWifi(false);
  //     return isConnected === 'true' ? true : false;
  //   })
  // })


  async function restartDevice() {
    if (!connectedDevice) {
      console.log('no device connected');
      return false;
    }
    setConnectingWifi(true);

    return bleManager?.discoverAllServicesAndCharacteristicsForDevice(connectedDevice.id).then((dev: Device) => {
      return bleManager?.servicesForDevice(connectedDevice.id).then(async (services: Service[]) => {
        let charictaristics: Characteristic[] = await services[0].characteristics();
        let char = charictaristics[1]
        if (!char.value) {
          return
        };
        char.writeWithResponse(Buffer.from('1').toString("base64")).then((x) => console.log(x));
      })
    })
  }

  async function sendWifiCredsToDevice(creds: { ssid: string, pwd: string }): Promise<boolean | undefined> {
    if (!connectedDevice) {
      return
    }

    console.log(creds.ssid, creds.pwd)

    const services = await connectedDevice.services();
    const wifiService: Service | undefined = services.filter(serv => serv.uuid === SERVICE_UUID)[0];

    if (!wifiService) {
      return
    }

    let charictaristics: Characteristic[] = await wifiService.characteristics();

    const wifiChar = charictaristics.filter(char => char.uuid === WIFI_UUID)[0];

    if (!wifiChar) {
      return
    }

    let resp = JSON.stringify({ ssid: creds.ssid, pwd: creds.pwd });
    wifiChar.writeWithResponse(Buffer.from(resp).toString("base64")).then((x) => console.log(x));

    let res = await getDeviceConnectionStatus();
    console.log("RES: ", res)
    return res;
  };

  return (
    <BLEContext.Provider value={{ scanning, devices, scan, getNetworksFromDevice, clearDevices, connectToDevice, connectedDevice, sendWifiCredsToDevice, scanningWifi, stopScan, getDeviceConnectionStatus, connectingWifi, restartDevice, bleState, bleError }}>
      {children}
    </BLEContext.Provider>
  );
}