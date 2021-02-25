import { config } from "./GlobalDeclare";
import { ActionID, C2S_Client } from "./C2S_ClientSingleton";
import Skill_CD from "./Skill_CD";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    public static Instance: Main = null;

    /** PageView */
    @property({ type: cc.PageView })
    PV_PageView: cc.PageView = null;

    /** PageView_content */
    @property({ type: cc.Node })
    N_PageView_content: cc.Node = null;

    /** 系統 */
    public os: string = cc.sys.os;

    /** 平台 */
    public platform: number = cc.sys.platform;

    /** 返回桌面 按鍵間格時間 */
    private _page2_BackTime: number = 6 * 50;
    // private _page2_BackTime: number = 10;

    /** 目前頁面 */
    private _pageIdx: number = 1;

    /** 總共頁面 */
    private _pagenum: number = 0;

    /** 按返回時間 */
    private _clickBackTime: number = 0;

    /** 返回桌面 按鍵間格時間 */
    private _backTime: number = 1.5;

    /** 初始化完成 */
    private _init_OK: boolean = false;

    /** _toExitGame */
    private _toExitGame: boolean = false;

    //#region Lifecycle

    onLoad(): void {
        // {
        // "编辑器":  CC_EDITOR,
        // "编辑器 或 预览":  CC_DEV,
        // "编辑器 或 预览 或 构建调试":  CC_DEBUG,
        // "网页预览":  CC_PREVIEW && !CC_JSB,
        // "模拟器预览":  CC_PREVIEW && CC_JSB,
        // "构建调试":  CC_BUILD && CC_DEBUG,
        // "构建发行":  CC_BUILD && !CC_DEBUG,
        // }

        console.log("JianMiau");
        Main.Instance = this;
        this.Init();
        this.Connect();
    }

    start(): void {
        this.PV_PageView.setCurrentPageIndex(1);
    }

    update(dt: number): void {
        this.Update_Time(this._pageIdx);
        if (this["Page_" + this._pageIdx]) {
            this["Page_" + this._pageIdx]();
        }
    }

    //#endregion

    //#region Init Function

    Init(): void {
        let search: string = (window.location.search);
        if (search !== "") {
            let _Get_Arr: string[] = search.split("?");
            let Get_Arr: string[] = _Get_Arr[1].split("&");
            for (let i: number = 0; i < Get_Arr.length; i++) {
                let Get: string[] = Get_Arr[i].split("=");
                config.HttpData[Get[0]] = Get[1];
            }
        }
        this._pagenum = this.PV_PageView.node.getChildByName("view").getChildByName("content").childrenCount;

        this.PV_PageView.node.on("scroll-ended", this.scroll_ended, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        for (let i: number = 0; i < this._pagenum; i++) {
            if (this["Page_" + i]) {
                this["Page_" + i]();
            }
        }
        this._init_OK = true;
        if (CC_BUILD) {
            this.PV_PageView.node.getChildByName("view").getComponent(cc.Mask).enabled = true;
        }
    }

    Connect(): void {
        let ServerHost: string = "123.0.40.253:1881/ws/chat";

        ServerHost = config.HttpData["ServerHost"] ? config.HttpData["ServerHost"] : ServerHost;
        C2S_Client.GetInstane().connect("ws://" + ServerHost + "");
    }

    //#endregion

    //#region 每個頁面刷新事件 Function

    Update_Time(index: string | number): void {
        if (+index === 0) {
            return;
        }

        let C: string = "\t";
        if (+index < 2) {
            C = "\n";
        }

        let Txt_Time: cc.Node = this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_" + index).getChildByName("Txt_Time");

        let today: Date = new Date();
        Txt_Time.getComponent(cc.Label).string = today.getFullYear() + "-" + this.padLeft(today.getMonth() + 1, 2) + "-" + this.padLeft(today.getDate(), 2) +
            C + this.padLeft((today.getHours()), 2) + ":" + this.padLeft(today.getMinutes(), 2) + ":" + this.padLeft(today.getSeconds(), 2);
    }

    // 0
    Page_0(): void {
        if (!this._init_OK) {
            this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_0")["Page_Data"] = {};
        }
        let Txt_Time: cc.Node = this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_0").getChildByName("Txt_Time");

        let today: Date = new Date();
        Txt_Time.getComponent(cc.Label).string = today.getFullYear() + "-" + this.padLeft(today.getMonth() + 1, 2) + "-" + this.padLeft(today.getDate(), 2) +
            "\n" + ((today.getHours() % 12) === 0 ? 12 : (today.getHours() % 12)) + ":" + this.padLeft(today.getMinutes(), 2) + ":" + this.padLeft(today.getSeconds(), 2) + " " + ((today.getHours() > 12) ? "PM" : "AM");
    }

    Page_1(): void {
        if (!this._init_OK) {
            this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_1")["Page_Data"] = {};
        }
    }

    Page_2(value: string = ""): void {
        if (!this._init_OK) {
            this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_2")["Page_Data"] = {
                Page2_Time: 0
            };
        }

        let Page_Data: any = this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_2")["Page_Data"];

        let Txt_BackTime: cc.Node = this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_2").getChildByName("Txt_BackTime");
        let NowTime: number = new Date().getTime();
        let Timediff: number = NowTime - Page_Data.Page2_Time;
        if (Page_Data.Page2_Time !== 0) {
            Txt_BackTime.getComponent(cc.Label).string = Math.abs(((this._page2_BackTime * 1000) - Timediff) / 1000).toFixed(0) + "";
            if (Timediff > (this._page2_BackTime * 1000)) {
                if (this._pageIdx === 2) {
                    Page_Data.Page2_Time = 0;
                    this._pageIdx = 1;
                    this.PV_PageView.setCurrentPageIndex(1);
                }
            }
        }

        if (!value) {
            return;
        }
        let Txt_Content: cc.Node = this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_2").getChildByName("Txt_Content");

        Txt_Content.getComponent(cc.Label).string = value;
    }

    //#endregion

    //#region Touch Function

    scroll_ended(pageView: cc.PageView): void {
        this._pageIdx = this.PV_PageView.getCurrentPageIndex();
    }

    // scroll_ended(pageView: cc.PageView) {
    //     let page: cc.Node[] = pageView.getPages();
    //     let oldpageIdx = this.pageIdx;
    //     this.pageIdx = this.PV_PageView.getCurrentPageIndex();
    //     if (this.pageIdx > oldpageIdx) {
    //         let newpage: cc.Node = cc.instantiate(page[oldpageIdx - 1]);
    //         pageView.removePage(page[oldpageIdx - 1]);
    //         // pageView.addPage(newpage);
    //         pageView.insertPage(newpage, oldpageIdx + 1);
    //     } else if (this.pageIdx < oldpageIdx) {
    //         let newpage: cc.Node = cc.instantiate(page[oldpageIdx + 1]);
    //         pageView.removePage(page[oldpageIdx + 1]);
    //         pageView.insertPage(newpage, 0);
    //     }
    //     // this.PV_PageView.setCurrentPageIndex(1);
    //     // this.PV_PageView.scrollToPage(1, 0);
    //     this.pageIdx = 1;
    // }

    onMouseDown(event: cc.Event.EventMouse): void {
        let mouseType: number = event.getButton();
        if (mouseType === cc.Event.EventMouse.BUTTON_MIDDLE) {
            this.PV_PageView.setCurrentPageIndex(1);
        }
    }

    onKeyDown(event: any): void {
        console.log(event.keyCode);
        switch (event.keyCode) {
            // case cc.macro.KEY.f11: {
            //     if (this.os === cc.sys.OS_WINDOWS && this.platform === cc.sys.DESKTOP_BROWSER) {
            //         if (cc.screen["autoFullScreen"]) {
            //             cc.screen["autoFullScreen"]();
            //         }
            //     }
            //     break;
            // }

            case cc.macro.KEY.a: {
                this.ReceiveScrollMsg(0, "666");
                break;
            }

            // 1000 左鍵(Android TV)
            case cc.macro.KEY.dpadLeft: {
                this._pageIdx = this._pageIdx - 1 > 0 ? this._pageIdx - 1 : this._pagenum;
                this.PV_PageView.setCurrentPageIndex(this._pageIdx);
                break;
            }

            // 1001 右鍵(Android TV)
            case cc.macro.KEY.dpadRight: {
                this._pageIdx = this._pageIdx + 1 > this._pagenum ? 0 : this._pageIdx + 1;
                this.PV_PageView.setCurrentPageIndex(this._pageIdx);
                break;
            }

            // 1003上鍵(Android TV)
            case cc.macro.KEY.dpadUp: {
                break;
            }

            // 1004 下鍵(Android TV)
            case cc.macro.KEY.dpadDown: {
                break;
            }

            // 1005 OK鍵(Android TV)
            case cc.macro.KEY.dpadCenter: {
                this.PV_PageView.setCurrentPageIndex(1);
                break;
            }

            // 6 返回鍵(Android TV)
            case cc.macro.KEY.back: {
                // let NowTime: number = new Date().getTime();
                // let Timediff: number = NowTime - this.clickBackTime;
                // this.clickBackTime = NowTime;
                // if (Timediff > (this.backTime * 1000)) {
                //     cc.game.end();
                // }

                if (!this._toExitGame) {
                    // 首次点击，重置该标记
                    this._toExitGame = true;

                    // 发出后退消息，这里监听者来弹出提示：再次点击后退，退出游戏。
                    // 这里要替换成自己的消息处理方法
                    // AppFacade.getInstance().sendNotification(GAMEEVENTS.APP.TRY_EXIT);

                    // 3秒后没有再次按【后退】按钮，则重置该标记
                    this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => {
                        this._toExitGame = false;
                        // this.label.string = '';
                    })));
                } else {
                    // 已经点击过一次，则直接退出
                    cc.game.end();
                    return;
                }
                break;
            }

            default: {
                break;
            }
        }
    }

    //#endregion

    //#region Custom Function

    Server_Error(): void {
        // alert("Server Error");
        this.Page_2("Server 已斷線");
        this.PV_PageView.setCurrentPageIndex(2);
    }

    /**
     * 傳送滾動信息
     * @param Priority 權重(0優先 ~ 2普通)
     * @param str 信息內容
     */
    SendScrollMsg(Priority: number, str: string): void {
        console.log("C2S_ShowScroll: " + Priority + " , Msg:" + str);
        C2S_Client.GetInstane().on_Broadcast(Priority, str);
    }

    /**
     * 接收滾動信息
     * @param Priority 權重(0優先 ~ 2普通)
     * @param str 信息內容
     */
    ReceiveScrollMsg(Priority: number, str: string): void {
        // let self: this = this;
        console.log("S2C_ShowScroll: " + Priority + " , Msg:" + str);
        let Page_Data: any = this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_2")["Page_Data"];
        Page_Data["Page2_Time"] = new Date().getTime();
        this.Page_2(str);
        this._pageIdx = 2;
        this.PV_PageView.setCurrentPageIndex(2);
        this.PV_PageView.node.getChildByName("view").getChildByName("content").getChildByName("page_2").getChildByName("Mask").getChildByName("Skill_CD").getComponent(Skill_CD).RunCD(this._page2_BackTime);
    }

    //#endregion

    //#region Tool Function

    /** 左邊補0 */
    padLeft(str: string | number, len: number): string {
        str = "" + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padLeft("0" + str, len);
        }
    }

    /** 右邊補0 */
    padRight(str: string | number, len: number): string {
        str = "" + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padRight(str + "0", len);
        }
    }

    //#endregion
}
