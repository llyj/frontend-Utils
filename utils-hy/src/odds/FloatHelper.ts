export class FloatHelper {
  static DecimalLength(num: number) {
    // The length of the decimal
    const eSplit = num.toString().split(/[eE]/);
    const len = (eSplit[0].split('.')[1] || '').length - Number(eSplit[1] || 0);
    return len > 0 ? len : 0;
  }
  static Operator(arg1: number, arg2: number, sign: string | number) {
    // sign:1 is subtraction, 2 is multiplication, 3 is division, others are addition
    const r1 = this.DecimalLength(arg1);
    const r2 = this.DecimalLength(arg2);
    let n = Math.max(r1, r2);
    const m = Math.pow(10, n);
    let rv: number;
    switch (sign) {
      case '*':
      case 2:
        n = r1 + r2;
        rv = (arg1 * Math.pow(10, r1) * (arg2 * Math.pow(10, r2))) / Math.pow(10, n);
        break;
      case '/':
      case 3:
        if (n < 3) n = 3;
        rv = (arg1 * m) / (arg2 * m);
        break;
      case '%':
      case 4:
        rv = ((arg1 * m) % (arg2 * m)) / m;
        break;
      case '-':
      case 1:
        rv = (arg1 * m - arg2 * m) / m;
        break;
      default:
        rv = (arg1 * m + arg2 * m) / m;
        break; // "+"
    }
    return parseFloat(rv.toFixed(n));
  }
}
