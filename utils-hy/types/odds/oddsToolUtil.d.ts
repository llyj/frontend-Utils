import { EOddsFormat } from './EOddsFormat';
/** 赔率转换 */
export declare class OddsToolUtil {
    static USJson: any;
    static FractionJson: any;
    /**
     * 转换赔率格式，输入格式需为香港格式
     * @param oFormat 输出赔率格式
     * @param hVal 主赔率/大赔率/主赢赔率
     * @param pVal 让球盘口/大小盘口/和局赔率
     * @param gVal 客赔率/小赔率/客赢赔率
     * @param isEu 是否欧赔
     */
    static getPL(oFormat: EOddsFormat, hVal: string | number, pVal: string | number, gVal: string | number, isEu?: boolean): any[];
    /**
     * 转换单个赔率，输入格式需为香港格式
     * @param oFormat 输出赔率格式
     * @param val 赔率，非盘口
     * @param isEu 是否欧赔
     */
    static changePL(oFormat: EOddsFormat, val: string | number, isEu: boolean): any;
    static toIN(val: string | number): string | number;
    static toML(val: string | number): string | number;
    static toEU(val: string | number): string;
    static toUS(val: string | number): any;
    static toUSEu(val: string | number): any;
    static toFraction(val: string | number): string;
    static toFractionEu(val: string | number): string;
    static toFixZero(val: string | number, num?: number): string | number;
    static GoalHandicap: any[];
    static GoalOverUnder: any[];
    static _handicapAccept: string;
    static _handicapGive: string;
    static _ouTrimEndZero: boolean;
    /** 让分盘口转换 */
    static GoalToHandicap(goal: number): string;
    /** 大小球盘口转换 */
    static GoalToOverUnder(goal: number): string;
}
