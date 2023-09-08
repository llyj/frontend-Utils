import { EOddsFormat } from './EOddsFormat';
import { FloatHelper } from './FloatHelper';

/** 赔率转换 */
export class OddsToolUtil {
  static USJson: any = {
    0.22: -450,
    0.28: -350,
    0.33: -300,
    0.36: -275,
    0.38: -267,
    0.44: -225,
    0.47: -212.5,
    0.53: -187.5,
    0.57: -175,
    0.62: -162.5,
    0.63: -160,
    0.66: -150,
    0.72: -137.5,
    0.83: -120,
    0.88: -114,
    0.91: -110,
    0.95: -105,
  };
  static FractionJson: any = {
    0.22: '2/9',
    0.28: '2/7',
    0.33: '1/3',
    0.36: '4/11',
    0.38: '3/8',
    0.44: '4/9',
    0.47: '40/85',
    0.53: '8/15',
    0.57: '4/7',
    0.62: '8/13',
    0.63: '5/8',
    0.66: '4/6',
    0.72: '8/11',
    0.83: '5/6',
    0.88: '7/8',
    0.91: '10/11',
    0.95: '20/21',
  };

  /**
   * 转换赔率格式，输入格式需为香港格式
   * @param oFormat 输出赔率格式
   * @param hVal 主赔率/大赔率/主赢赔率
   * @param pVal 让球盘口/大小盘口/和局赔率
   * @param gVal 客赔率/小赔率/客赢赔率
   * @param isEu 是否欧赔
   */
  static getPL(
    oFormat: EOddsFormat,
    hVal: string | number,
    pVal: string | number,
    gVal: string | number,
    isEu?: boolean,
  ) {
    if (isEu && oFormat !== EOddsFormat.American && oFormat !== EOddsFormat.Fraction)
      return [this.toFixZero(hVal), this.toFixZero(pVal), this.toFixZero(gVal)];
    switch (oFormat) {
      case EOddsFormat.HongKong:
        return [hVal, pVal, gVal];
      case EOddsFormat.Indonesian:
        return [this.toIN(hVal), pVal, this.toIN(gVal)];
      case EOddsFormat.American:
        if (isEu) return [this.toUSEu(hVal), this.toUSEu(pVal), this.toUSEu(gVal)];
        return [this.toUS(hVal), pVal, this.toUS(gVal)];
      case EOddsFormat.Decimal:
        return [this.toEU(hVal), pVal, this.toEU(gVal)];
      case EOddsFormat.Malay:
        return [this.toML(hVal), pVal, this.toML(gVal)];
      case EOddsFormat.Fraction:
        if (isEu) return [this.toFractionEu(hVal), this.toFractionEu(pVal), this.toFractionEu(gVal)];
        return [this.toFraction(hVal), pVal, this.toFraction(gVal)];
    }
  }

  /**
   * 转换单个赔率，输入格式需为香港格式
   * @param oFormat 输出赔率格式
   * @param val 赔率，非盘口
   * @param isEu 是否欧赔
   */
  static changePL(oFormat: EOddsFormat, val: string | number, isEu: boolean) {
    if (isEu && oFormat !== EOddsFormat.American && oFormat !== EOddsFormat.Fraction) return this.toFixZero(val);
    switch (oFormat) {
      case EOddsFormat.HongKong:
        return val;
      case EOddsFormat.Indonesian:
        return this.toIN(val);
      case EOddsFormat.American:
        if (isEu) return this.toUSEu(val);
        return this.toUS(val);
      case EOddsFormat.Decimal:
        return this.toEU(val);
      case EOddsFormat.Malay:
        return this.toML(val);
      case EOddsFormat.Fraction:
        if (isEu) return this.toFractionEu(val);
        return this.toFraction(val);
    }
  }

  static toIN(val: string | number) {
    if (!val) return '';
    const fVal = typeof val === 'string' ? parseFloat(val) : val;
    return fVal < 1 ? (0 - 1 / fVal).toFixed(2) : val;
  }

  static toML(val: string | number) {
    if (!val) return '';
    const fVal = typeof val === 'string' ? parseFloat(val) : val;
    return fVal > 1 ? (0 - 1 / fVal).toFixed(2) : val;
  }

  static toEU(val: string | number) {
    if (!val) return '';
    const fVal = typeof val === 'string' ? parseFloat(val) : val;
    return (fVal + 1).toFixed(2);
  }

  static toUS(val: string | number) {
    if (!val) return '';
    const fVal = typeof val === 'string' ? parseFloat(val) : val;
    const oJson = this.USJson;
    if (fVal in oJson) return oJson[fVal];

    if (fVal <= 0) return 0;
    else if (fVal < 1) {
      const roundVal: any = 1 / fVal;
      return Math.round(0 - 100 * roundVal.toFixed(2));
    } else return Math.round(100 * fVal);
  }

  static toUSEu(val: string | number) {
    if (!val) return '';
    let fVal = typeof val === 'string' ? parseFloat(val) : val;
    if (!fVal || isNaN(fVal)) return '';
    fVal = FloatHelper.Operator(fVal, 1, '-');
    const oJson = this.USJson;
    if (fVal in oJson) return oJson[fVal];
    if (fVal === 0) return '0';

    if (fVal < 1) {
      const roundVal: any = 1 / fVal;
      return Math.round(0 - 100 * roundVal.toFixed(2));
    } else return Math.round(100 * fVal);
  }

  static toFraction(val: string | number) {
    // Fractional conversion
    let fVal = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(fVal)) return '';

    const f: boolean = fVal < 0;
    if (f) fVal = Math.abs(fVal);
    const fra = { n: 0, m: 1 }; // n/m
    let num = 0;
    // tslint:disable-next-line: no-bitwise
    if (fVal > 1) fVal = FloatHelper.Operator(fVal, (num = fVal | 0), '-');

    const oJson = this.FractionJson;
    if (fVal in oJson) {
      const arr = oJson[fVal].split('/');
      // tslint:disable-next-line
      fra.n = parseInt(arr[0]);
      // tslint:disable-next-line
      fra.m = parseInt(arr[1]);
    } else if (fVal > 0) {
      const GCD = (a: number, b: number): number => {
        return b === 0 ? a : GCD(b, a % b);
      }; // Greatest Common Divisor
      const m = Math.pow(10, FloatHelper.DecimalLength(fVal));
      const n = fVal * m;
      const d = GCD(m, n);
      fra.n = n / d;
      fra.m = m / d;
    }
    return (f ? '-' : '') + (num * fra.m + fra.n) + '/' + fra.m;
  }

  static toFractionEu(val: string | number) {
    // Fractional conversion
    let fVal = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(fVal)) return '';
    fVal = FloatHelper.Operator(fVal, 1, '-');
    const f = fVal < 0;
    if (f) fVal = Math.abs(fVal);
    const fra = { n: 0, m: 1 }; // n/m
    let num = 0;
    // tslint:disable-next-line: no-bitwise
    if (fVal > 1) fVal = FloatHelper.Operator(fVal, (num = fVal | 0), '-');

    const oJson = this.FractionJson;
    if (fVal in oJson) {
      const arr = oJson[fVal].split('/');
      // tslint:disable-next-line
      fra.n = parseInt(arr[0]);
      // tslint:disable-next-line
      fra.m = parseInt(arr[1]);
    } else if (fVal > 0) {
      const GCD = (a: number, b: number): number => {
        return b === 0 ? a : GCD(b, a % b);
      }; // Greatest Common Divisor
      const m = Math.pow(10, FloatHelper.DecimalLength(fVal));
      const n = fVal * m;
      const d = GCD(m, n);
      fra.n = n / d;
      fra.m = m / d;
    }
    return (f ? '-' : '') + (num * fra.m + fra.n) + '/' + fra.m;
  }

  static toFixZero(val: string | number, num: number = 2) {
    const fVal = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(fVal)) return val;
    return fVal.toFixed(num);
  }

  static GoalHandicap: any[] = [
    '0',
    '0/{0}0.5',
    '{0}0.5',
    '{0}0.5/1',
    '{0}1',
    '{0}1/1.5',
    '{0}1.5',
    '{0}1.5/2',
    '{0}2',
    '{0}2/2.5',
    '{0}2.5',
    '{0}2.5/3',
    '{0}3',
    '{0}3/3.5',
    '{0}3.5',
    '{0}3.5/4',
    '{0}4',
    '{0}4/4.5',
    '{0}4.5',
    '{0}4.5/5',
    '{0}5',
    '{0}5/5.5',
    '{0}5.5',
    '{0}5.5/6',
    '{0}6',
    '{0}6/6.5',
    '{0}6.5',
    '{0}6.5/7',
    '{0}7',
    '{0}7/7.5',
    '{0}7.5',
    '{0}7.5/8',
    '{0}8',
    '{0}8/8.5',
    '{0}8.5',
    '{0}8.5/9',
    '{0}9',
    '{0}9/9.5',
    '{0}9.5',
    '{0}9.5/10',
    '{0}10',
    '{0}10/10.5',
    '{0}10.5',
    '{0}10.5/11',
    '{0}11',
    '{0}11/11.5',
    '{0}11.5',
    '{0}11.5/12',
    '{0}12',
    '{0}12/12.5',
    '{0}12.5',
    '{0}12.5/13',
    '{0}13',
    '{0}13/13.5',
    '{0}13.5',
    '{0}13.5/14',
    '{0}14',
  ];
  static GoalOverUnder: any[] = [
    '0',
    '0/0.5',
    '0.5',
    '0.5/1',
    '1',
    '1/1.5',
    '1.5',
    '1.5/2',
    '2',
    '2/2.5',
    '2.5',
    '2.5/3',
    '3',
    '3/3.5',
    '3.5',
    '3.5/4',
    '4',
    '4/4.5',
    '4.5',
    '4.5/5',
    '5',
    '5/5.5',
    '5.5',
    '5.5/6',
    '6',
    '6/6.5',
    '6.5',
    '6.5/7',
    '7',
    '7/7.5',
    '7.5',
    '7.5/8',
    '8',
    '8/8.5',
    '8.5',
    '8.5/9',
    '9',
    '9/9.5',
    '9.5',
    '9.5/10',
    '10',
    '10/10.5',
    '10.5',
    '10.5/11',
    '11',
    '11/11.5',
    '11.5',
    '11.5/12',
    '12',
    '12/12.5',
    '12.5',
    '12.5/13',
    '13',
    '13/13.5',
    '13.5',
    '13.5/14',
    '14',
  ];

  static _handicapAccept = '-';
  static _handicapGive = '+';
  static _ouTrimEndZero = true;

  /** 让分盘口转换 */
  static GoalToHandicap(goal: number): string {
    // handicap conversion
    if (isNaN(goal)) return '';
    else {
      if (goal > 14) return this._handicapGive + Math.abs(goal);
      if (goal < -14) return this._handicapAccept + Math.abs(goal);
      const i = Math.abs(goal * 4); // TODO:方便假数据测试添加Math.round(),上线前注意去除
      if (goal >= 0) return this.GoalHandicap[i].replace('{0}', this._handicapGive);
      else return this.GoalHandicap[i].replace('{0}', this._handicapAccept);
    }
  }

  /** 大小球盘口转换 */
  static GoalToOverUnder(goal: number): string {
    // ou conversion
    if (isNaN(goal)) return '';
    else {
      if (goal > 14 || goal < -14) return goal.toString();
      const newGoal = this.GoalOverUnder[Math.abs(goal * 4)];
      return newGoal;
    }
  }

  /*static ConvertOddsToString(Odds: number | undefined, OddsType: EOddsType): string {
        if (typeof Odds === "undefined") return "";
        switch (OddsType) {
            case EOddsType.Handicap:
                return this.GoalToHandicap(Odds!);
            case EOddsType.OverUnder:
                return this.GoalToOverUnder(Odds!);
            case EOddsType.Standard:
                return this.changePL(getSettingsManager().OddsFormat, Odds, true).toString();
        }
    }*/
}
