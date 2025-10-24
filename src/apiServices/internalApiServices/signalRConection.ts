import { OpenAPI } from '@/ecom-sadec-api-client/core/OpenAPI';
import useCoreAppConfigStore from '@/stores/states/CoreAppConfigStore';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

const isServer = typeof window === 'undefined';
let socketURL = OpenAPI.SOCKET;
if (isServer) {
  socketURL = OpenAPI.BASE;
} else if (useCoreAppConfigStore.getState().config) {
  socketURL = useCoreAppConfigStore.getState().config.urlSocket;
}

let connections = {} as {
  [key: string]: { type: string; connection: HubConnection; started: boolean };
};

function createConnection(typeConection: string) {
  const connectionObj = connections[typeConection];
  if (!connectionObj) {
    console.log('SOCKET: Registering on server events ');
    const connection = new HubConnectionBuilder()
      .withUrl(socketURL, {
        logger: LogLevel.Information,
        withCredentials: false,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connections[typeConection] = {
      type: typeConection,
      connection: connection,
      started: false,
    };
    return connection;
  } else {
    return connections[typeConection].connection;
  }
}

function startConnection(typeConection: string) {
  const connectionObj = connections[typeConection];
  if (!connectionObj.started) {
    connectionObj.connection.start().catch((err) => console.error('SOCKET: ', err.toString()));
    connectionObj.started = true;
  }
}

function stopConnection(typeConection: string) {
  const connectionObj = connections[typeConection];
  if (connectionObj) {
    console.log('SOCKET: Stoping connection ');
    connectionObj.connection.stop();
    connectionObj.started = false;
  }
}

function registerOnServerEvents(typeConection: string, callback: (payload: any) => void) {
  try {
    const connection = createConnection(typeConection);
    connection.off(typeConection);
    connection.on(typeConection, (payload: any) => {
      callback(payload);
    });
    connection.onclose(() => stopConnection(typeConection));
    startConnection(typeConection);
  } catch (error) {
    console.error('SOCKET: ', error);
  }
}

export const socketService = {
  registerOnServerEvents,
  stopConnection,
};
