export default class DeviceChecker {

    private readonly maxMobile = 600;
    getOSType = () : OSType => {
        if (window) {
            if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Windows NT 6.3") != -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) return OSType.Windows;
            if (window.navigator.userAgent.indexOf("Mac")            != -1) return OSType.MacOS;
            if (window.navigator.userAgent.indexOf("X11")            != -1) return OSType.Other;
            if (window.navigator.userAgent.indexOf("Linux")          != -1) return OSType.Linux;
        }
        return OSType.Other;
    }

    isMobile = () : boolean => {
        if (!window) {
            return false;
        }
        return window.innerWidth < this.maxMobile;
    }
}


export enum OSType {
    MacOS,
    Windows,
    Linux,
    Other
}