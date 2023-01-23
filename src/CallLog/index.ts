import dayjs from 'dayjs';
import {NativeModules} from 'react-native';
const {CallLogModule} = NativeModules;

type RawCallLogDetails = {
  phoneNumber: string;
  callerName: String;
  callDate: string;
  callDuration: string;
  callDirection: string;
};

type CallDirection = 'INCOMING' | 'OUTGOING' | 'MISSED' | 'UNRECOGNIZED';

export type CallLogDetails = {
  phoneNumber: string;
  callerName: String;
  callDate: string;
  callDuration: {
    hr: string;
    min: string;
    sec: string;
  };
  callDirection: CallDirection;
};

export interface ICallLogs {
  fetchCallLogs(): Promise<CallLogDetails[]>;
}

const fetchCallLogs = () => {
  return new Promise<CallLogDetails[]>(async (resolve, reject) => {
    try {
      const res: RawCallLogDetails[] = await CallLogModule.fetchCallLogs();

      const logs = res.map(log => {
        const date = new Date(Number.parseInt(log.callDate));
        const totalSeconds = Number.parseInt(log.callDuration);

        let s = totalSeconds % 60;
        let m = Math.floor(totalSeconds / 60);
        let h = Math.floor(m / 60);

        return {
          ...log,
          callDirection: log.callDirection as CallDirection,
          callerName: !!log.callerName ? log.callerName : 'UNKNOWN',
          callDate: dayjs(date).format('YYYY/MM/DD hh:mm A'),
          callDuration: {
            hr: h < 10 ? `0${h}` : h.toString(),
            min: m < 10 ? `0${m}` : m.toString(),
            sec: s < 10 ? `0${s}` : s.toString(),
          },
        } as const satisfies CallLogDetails;
      });

      resolve(logs);
    } catch (error) {
      reject(error);
    }
  });
};

export default {fetchCallLogs} as ICallLogs;
