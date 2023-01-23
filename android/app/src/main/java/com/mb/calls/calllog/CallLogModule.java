package com.mb.calls.calllog;

import android.content.ContentResolver;
import android.database.Cursor;
import android.provider.CallLog;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

public class CallLogModule extends ReactContextBaseJavaModule {
    CallLogModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "CallLogModule";
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    public void fetchCallLogs(Promise promise) {
        WritableArray callLogs = new WritableNativeArray();
        ContentResolver cr = getReactApplicationContext().getContentResolver();
        Cursor cursor = cr.query(CallLog.Calls.CONTENT_URI, null, null, null, null);

        if (cursor.moveToLast()) {
            do {
                WritableMap callDetailMap = new WritableNativeMap();
                String phoneNumber = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.NUMBER));
                String callerName = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.CACHED_NAME));
                String callDate = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE));
                String callDuration = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DURATION));
                int callType = Integer.parseInt(cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.TYPE)));

                String callDirection = "";
                switch (callType) {
                    case CallLog.Calls.INCOMING_TYPE:
                        callDirection = "INCOMING";
                        break;

                    case CallLog.Calls.OUTGOING_TYPE:
                        callDirection = "OUTGOING";
                        break;

                    case CallLog.Calls.MISSED_TYPE:
                        callDirection = "MISSED";
                        break;

                    default:
                        callDirection = "UNRECOGNIZED";
                        break;
                }

                callDetailMap.putString("phoneNumber", phoneNumber);
                callDetailMap.putString("callerName", callerName);
                callDetailMap.putString("callDate", callDate);
                callDetailMap.putString("callDirection", callDirection);
                callDetailMap.putString("callDuration", callDuration);
                callLogs.pushMap(callDetailMap);
            } while (cursor.moveToPrevious());
        }

        cursor.close();
        promise.resolve(callLogs);
    }
}
