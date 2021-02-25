
export namespace config {
    export var config = {
        version: '',
        Language: '',
        LanguageNumber: 0,
        ConnectServer:true,
        //ConnectServer:false,
        TestBossPath:false
    }
    
    /** 
     * 平台
     * @param Platform 0 Solaris
     * @param Platform 1 InCrown
     */
    export let Platform = 0;
    
    /** 平台名稱 */
    export let PlatformName = '';
    //export var Lan: number;

    /** 多語系表 */
    export let LanguagejsonArrayObj = {};
    
    /** 路徑表 */
    export let PathjsonArrayObj = new Array<Array<any>>();
    
    /** 魚資料表 */
    export let FishjsonArrayObj = new Array<Array<any>>();
    
    /** 魚資料表(根據Type分類賠率) */
    export let FishOddsData = new Array<Array<any>>();
    
    /** 砲台表 */
    export let FortjsonArrayObj = new Array<Array<any>>();
    
     /** 砲台表(不是從Excel讀的) */
    export let FortData = new Array<Array<any>>();
    
    /** 網址資料 */
    export let HttpData = new Array<any>();

    /** 魚路徑索引表(單機用) */
    export let PathjsonArrayIndexTemp = new Array<any>();
    /** 魚資料索引表(單機用) */
    export let FishjsonArrayIndexTemp = new Array<any>();

    export let ServerDelayTime:number = 0;

    /** 魚使用Object Pool 回收 */
    export let UseFishObjectPool:boolean = false; 
}

/*
* FID:魚表上的編號
* FishID:每隻魚的獨特編號
* Type:Prefab種類
* BodyType:魚的種類(大,中,小)
*/
export interface IFishData {
	/** 魚的流水號 */
    FishID: number,
	/** 魚表的編號 */
    FID:number,
    //Type: number,
    Dead:boolean
    Gun_Type:number
    BodyType:number,
    Path:number,
    StartTime:number,
    IsLaser:boolean,
    IsPenguinKingEat:boolean
}

export interface IPathData {
    _PathID: number,
    _Amplitude:number,
    _Speed:number,
    _LifeTime:number,
    _Xoffset:number,
    _TimeSpeed:number,
}

export class IBossPathData {
    _PathPos: cc.Vec3 = cc.Vec3.ZERO;
    _Time:number = -1;
    _animstate:string = null;
}

export class IBossPathsData {
    _PathType: number = 0;
    _Time:number = -1;
	_Depth:number = 0;//深度.
}

export interface IFishSwimming {
    Swimming(StartPos: cc.Vec3,_PathData:IPathData,StartTime:number,realpathID:number):void;
    BossSwimming(_PathDatas:IBossPathData[],StartTime:number):void;
    BossSwimmings(_PathDatas:IBossPathsData[],StartTime:number,totalliftime?:number):void;
}

// export interface IBornFishData {
//     setVec3:cc.Vec3, 
//     FishID:number,
//     FID:number,
//     IPathData:IPathData,
//     StartTime:number
// }

/*砲台資料.
* GP:砲台位置.
* PID:玩家ID.
* Name:玩家暱稱.
* Bal:Balance玩家金錢.
* Gun:GunTyp砲台型態.
* Bet:Bullet Cost.
* Status:火神炮:剩下秒數, 雷射: 0 - 未發射，1 - 已發射.
* Time:AcquiredTime.
*/
export interface ICannonData {
    GP: number,
    PID:number,
    Name:string,
    Bal:number,
    Gun:GunType,
    Bet:number,
    Status:number,
    Time:number,
}

/*子彈資料.
* ID:子彈流水號.
* Gun:GunTyp砲台型態.
* Bet:Bullet Cost.
* X:射擊位置X
* Y:射擊位置Y
* FID:鎖定之魚ID
* Time:發射時間
*/
export class IBulletData {
    ID: number;

    /** 
     * 炮管種類
     * @param Gun 0 Standard
     * @param Gun 1 FireGod
     * @param Gun 2 Laser
     * @param Gun 3 Bomb
     * @param Gun 4 Nuke
     * @param Gun 5 Hermes
     */
    Gun:GunType;
    Bet:number;
    X:number;
    Y:number;
    FID:number;
    Time:number;
    Pay:number = 0;
    constructor(_ID?: number,_Gun?:GunType,_Bet?:number,_X?:number,_Y?:number, _FID?:number,_Time?:number,_Pay?:number)
    {
        this.ID = _ID;
        this.Gun = _Gun;
        this.Bet = _Bet;
        this.X = _X;
        this.Y = _Y;
        this.FID = _FID;
        this.Time = _Time;
        if(_Pay)
            this.Pay = _Pay;
    }
}


/*子彈注單資料.
* BID:子彈流水號.
* Kind:FID->魚種ID
* Time:捕獲時間
* Bet:押注額
* Reward:獎勵
*/
export class BulletLog {
    BID: number;
    Kind:number;
    Time:number;
    Bet:number;
    Reward:number;
    constructor(_BID?: number,_Kind?:number,_Time?:number,_Bet?:number, _Reward?:number)
    {
        this.BID = _BID;
        this.Kind = _Kind;
        this.Time = _Time;
        this.Bet = _Bet;
        this.Reward = _Reward;
    }
}

/*遊戲紀錄資料.
* ID:流水號.
* Consume:消耗: 押注額
* Reward:獎勵
* Profit:盈利
* StartTime:交易時間: 起始
* EndTime:交易時間: 結束
*/
export class GameResult {
    ID: number;
    Consume:number;
    Reward:number;
    Profit:number;
    StartTime:number;
    EndTime:number;

    constructor(_ID?: number,_Consume?:number,_Reward?:number,_Profit?:number, _StartTime?:number, _EndTime?:number)
    {
        this.ID = _ID;
        this.Consume = _Consume;
        this.Reward = _Reward;
        this.Profit = _Profit;
        this.StartTime = _StartTime;
        this.EndTime = _EndTime;
    }
}


//魚跟子彈顯示的轉換.
export const PosTrans:cc.Vec2[] = [new cc.Vec2(1,1),new cc.Vec2(-1,1),new cc.Vec2(1,-1),new cc.Vec2(-1,-1)];

//砲台的顯示位置轉換.
export const CannonPosTrans:Array<Array<number>> = [[0,1,2,3],[1,0,3,2],[2,3,0,1],[3,2,1,0]];


export enum GunType
{
    Standard = 0,
    FireGod = 1,
    Laser = 2,
    Bomb = 3,
    Nuke = 4,
    Hermes = 5
}

/** 
 * 平台
 * @param Solaris 0
 * @param InCrown 1
 */
export enum PlatformType {
    /** 庫果遊戲平台 */
    Solaris = 0,

    /** 大滿貫平台 數值要除100 */
    InCrown = 1,

    /** 庫果遊戲平台(測試) 數值要除100 */
    Ven01 = 1,
}

/** 
 * 平台貨幣差異
 * @param Solaris 1倍
 * @param InCrown -100倍
 */
export enum Platform_Currency_Difference {
    /** 庫果遊戲平台 */
    Solaris = 1,

    /** 大滿貫平台 數值要除100 */
    InCrown = -100,

    /** 庫果遊戲平台(測試) 數值要除100 */
    Ven01 = -100,
}

// declare namespace GlobalDeclare {
//     //~ We can write 'myLib.timeout = 50;'
//     var Lan: number;

//     //~ We can access 'myLib.version', but not change it
//     const version: string;

//     //~ There's some class we can create via 'let c = new myLib.Cat(42)'
//     //~ Or reference e.g. 'function f(c: myLib.Cat) { ... }
//     class Cat {
//         constructor(n: number);

//         //~ We can read 'c.age' from a 'Cat' instance
//         readonly age: number;

//         //~ We can invoke 'c.purr()' from a 'Cat' instance
//         purr(): void;
//     }

//     //~ We can declare a variable as
//     //~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
//     interface CatSettings {
//         weight: number;
//         name: string;
//         tailLength?: number;
//     }

//     //~ We can write 'const v: myLib.VetID = 42;'
//     //~  or 'const v: myLib.VetID = "bob";'
//     type VetID = string | number;

//     //~ We can invoke 'myLib.checkCat(c)' or 'myLib.checkCat(c, v);'
//     function checkCat(c: Cat, s?: VetID);
// }