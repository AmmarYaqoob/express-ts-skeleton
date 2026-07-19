declare module 'koa2-useragent' {
  namespace koa2UserAgent {
    interface IGeoIp {
      ip: string;
    }
    interface IUserAgent {
      browser: string;
      version: string;
      engine: string;
      arch: string;
      os: string;
      platform: string;
      geoIp: IGeoIp;
      source: string;
      isMobile: boolean;
      isTablet: boolean;
      isiPad: boolean;
      isiPod: boolean;
      isiPhone: boolean;
      isAndroid: boolean;
      isBlackberry: boolean;
      isOpera: boolean;
      isIE: boolean;
      isEdge: boolean;
      isIECompatibilityMode: boolean;
      isSafari: boolean;
      isFirefox: boolean;
      isWebkit: boolean;
      isChrome: boolean;
      isKonqueror: boolean;
      isOmniWeb: boolean;
      isSeaMonkey: boolean;
      isFlock: boolean;
      isAmaya: boolean;
      isEpiphany: boolean;
      isDesktop: boolean;
      isWindows: boolean;
      isLinux: boolean;
      isLinux64: boolean;
      isMac: boolean;
      isChromeOS: boolean;
      isBada: boolean;
      isSamsung: boolean;
      isRaspberry: boolean;
      isBot: boolean;
      isCurl: boolean;
      isAndroidTablet: boolean;
      isWinJs: boolean;
      isKindleFire: boolean;
      isSilk: boolean;
      isCaptive: boolean;
      isSmartTV: boolean;
      isWechat: boolean;
      silkAccelerated: boolean;
    }
  }

  function koa2UserAgent(): any;
  export = koa2UserAgent;
}
