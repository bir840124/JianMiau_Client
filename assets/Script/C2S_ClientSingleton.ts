import { Notify } from "./NotifySingleton";

export default class C2S_ClientSingleton {
    private Instance: C2S_ClientSingleton = null;

    public GetInstane() {
        if (C2S_Client.Instance == null) {
            C2S_Client.Instance = new C2S_ClientSingleton();
            // Notify.GetInstane().on(ActionID.GetTime.toString(),Network.Instance.CalcServer,Network.Instance);
            // console.log("Network.Instance have new one.");
        }
        return C2S_Client.Instance;
    }

    private _socket = null;
    private MsgIndex = 0;
    private _GetServerTime0: number = 0;

    //針對魚被打到傳送訊息問題.
    private _on_FishHitList: any[][] = new Array<Array<any>>();
    private isDoReSend: boolean = true;

    constructor() {

    }

    public connect(url) {
        if (C2S_Client.GetInstane()._socket != null)
            C2S_Client.GetInstane().cleanSocket();
        C2S_Client.GetInstane()._socket = new WebSocket(url);
        C2S_Client.GetInstane()._socket.binaryType = "arraybuffer";// || "blob";
        C2S_Client.GetInstane()._socket.onopen = C2S_Client.GetInstane().on_open.bind(C2S_Client.GetInstane());
        C2S_Client.GetInstane()._socket.onmessage = C2S_Client.GetInstane().on_message.bind(C2S_Client.GetInstane());
        C2S_Client.GetInstane()._socket.onclose = C2S_Client.GetInstane().on_close.bind(C2S_Client.GetInstane());
        C2S_Client.GetInstane()._socket.onerror = C2S_Client.GetInstane().on_error.bind(C2S_Client.GetInstane());
    }

    public on_open() {
        //console.log("client rcv on_open");
        // Network.GetInstane().send_data(JSON.stringify(Data));
        Notify.GetInstane().emit("on_open", "");
    }


    private _sentdatalist = [];
    private _send_datatimeout: NodeJS.Timeout = null;
    public send_data(data) {
        C2S_Client.GetInstane()._sentdatalist.push(data);
        if (C2S_Client.GetInstane()._send_datatimeout === null) {
            // console.log("send_data data0:" + data.data.toString());
            C2S_Client.GetInstane()._send_datatimeout = setTimeout(C2S_Client.GetInstane().send, 100);
        }
    }

    private send() {
        try {
            let Data = [];
            if (!C2S_Client.GetInstane()._socket) {
                // Game.Instance.Server_Error();
                return;
            }
            if (C2S_Client.GetInstane()._sentdatalist.length > 0 && C2S_Client.GetInstane()._socket.bufferedAmount === 0) {
                for (let index = 0; index < C2S_Client.GetInstane()._sentdatalist.length; index++) {
                    let element = C2S_Client.GetInstane()._sentdatalist.shift();
                    Data.push(element);
                    if (CC_DEBUG) {
                        let mID = element["mID"];
                        // console.log("C2S_mID", element["mID"], "Time:", Date.now());
                        let Object: Object = {
                            mID: mID,
                            Time: Date.now()
                        };
                        // Game.Instance.Ping_Group.push(Object);
                    }
                }

                let data = JSON.stringify(Data);
                // console.log("!!!!send data:" + data.toString());
                C2S_Client.GetInstane()._socket.send(data, (error) => {
                    console.error("send error?:" + error);
                });

                // // for ping.
                // Game.Instance.start_timeStamp = Date.now();
            }

            if (C2S_Client.GetInstane()._sentdatalist.length > 0) {
                C2S_Client.GetInstane()._send_datatimeout = setTimeout(C2S_Client.GetInstane().send, 100);
            }
            else {
                C2S_Client.GetInstane()._send_datatimeout = null;
            }
        }
        catch (t) {
            Notify.GetInstane().emit("on_server_error");
        }
    }

    private cleanSocket() {
        try {
            C2S_Client.GetInstane()._socket.close();
        }
        catch (t) {

        }
        //this._connected=!1,
        C2S_Client.GetInstane()._socket.onopen = null,
            C2S_Client.GetInstane()._socket.onmessage = null,
            C2S_Client.GetInstane()._socket.onclose = null,
            C2S_Client.GetInstane()._socket.onerror = null,
            C2S_Client.GetInstane()._socket = null

    }

    public on_message(event) {
        try {
            var i = event.data;
            cc.log("S2C: " + i)
            if (i === "-1:TABLE:TEST") {
                return;
            }
            var e = JSON.parse(i);
            var actionID: ActionID = e["aID"];
            var data = e["data"];
            var extra = e["extra"];
            var AddData = e["addData"];
            var Count = e["count"];

            if (e["rCode"] === ReturnCodes.Success) {
                if (extra) {
                    data["extra"] = extra;
                }

                if (AddData) {
                    data["addData"] = AddData;
                }


                Notify.GetInstane().emit(actionID.toString(), data);
            }
            else {
                //console.log("Error Happen data:" + event.data);
                if (e["rCode"] === ReturnCodes.NotEnoughCoins) {
                    Notify.GetInstane().emit(ReturnCodes.NotEnoughCoins.toString(), data);
                }
                else if (e["rCode"] === ReturnCodes.FishNotExist) {
                    //maybe let client fish left.
                }
            }

            // if (Network.GetInstane().isDoReSend) {
            //     if (actionID === ActionID.HitFish) {
            //         //let index = data["BID"].toString()+","+data["FID"].toString();
            //         Network.GetInstane().DelReSendon_FishHitList(Number(e["mID"]));
            //     }
            // }

            // for ping.

            // if(CC_DEBUG) {
            //     for(let i = 0;i < Game.Instance.Ping_Group.length;i++) {
            //         if(Game.Instance.Ping_Group[i] && Game.Instance.Ping_Group[i]["mID"] === Number(e["mID"])) {
            //             Game.Instance.Ping = Math.floor(((Date.now() - Game.Instance.Ping_Group[i]["Time"])));
            //             // console.log("S2C_mID", Number(e["mID"]), "Time:", Date.now());
            //             Game.Instance.Ping_Group.splice(i,1);
            //         }
            //     }
            //     // console.log("Ping", Game.Instance.Ping + "ms");
            //     let Ping: cc.Node = cc.find("Game/ShareUI/Ping");
            //     Ping.active = true;
            //     Ping.getComponent(cc.Label).string = "Ping: " + Game.Instance.Ping + "ms";
            //     if(Game.Instance.Ping >= 350) {
            //         Ping.color = cc.Color.RED;
            //     } else if(Game.Instance.Ping < 350 && Game.Instance.Ping >= 200) {
            //         Ping.color = cc.Color.YELLOW;
            //     } else {
            //         Ping.color = cc.Color.GREEN;
            //     }
            // }
            // for ping end.
        } catch (error) {
            // console.error(error);
        }
    }

    public on_close(IsAlert: boolean = true) {
        C2S_Client.GetInstane().close(IsAlert);
    }

    public on_error(this: WebSocket, ev: Event) {
        // Game.Instance.Alert(config.LanguagejsonArrayObj[4000007]);
        C2S_Client.GetInstane().close();
    }

    private close(IsAlert: boolean = true) {
        if (C2S_Client.GetInstane()._socket) {
            C2S_Client.GetInstane()._socket.close();
            C2S_Client.GetInstane()._socket = null;
        }
        if (IsAlert) {
            Notify.GetInstane().emit("on_server_error");
        }
    }

    //#region Client Request

    // public on_loginByName(Name: string) {
    //     let login = new LoginRequestDTO(Name);
    //     let msg = new ServerMsgDTO();
    //     msg.ServerMsgDTO1(Network.GetInstane().MsgIndex++, ActionID.LoginByAccount, login);
    //     let data = JSON.stringify(msg);
    //     console.log("C2S_" + "LoginByAccount :" + data);
    //     Network.GetInstane().send_data(msg);
    // }

    public on_Broadcast(_Priority: number, _Msg: string): void {
        let bc: BroadcastRequestDTO = new BroadcastRequestDTO(_Priority, _Msg);
        let msg: ServerMsgDTO = new ServerMsgDTO();
        msg.ServerMsgDTO1(C2S_Client.GetInstane().MsgIndex++, ActionID.Broadcast, bc);
        let data: string = JSON.stringify(msg);
        // console.log('C2S_' + 'Broadcast :' + data);
        C2S_Client.GetInstane().send_data(msg);
    }

    public on_logout(): void {
        if (C2S_Client.GetInstane()._socket) {
            let msg: ServerMsgDTO = new ServerMsgDTO();
            // msg.ServerMsgDTO2( ActionID.Logout, "" ,1);
            msg.ServerMsgDTO1(C2S_Client.GetInstane().MsgIndex++, ActionID.Logout, "");
            let Data: any[] = [];
            Data.push(msg);
            let data: string = JSON.stringify(Data);
            console.log("C2S_" + "Logout :" + data);
            C2S_Client.GetInstane()._socket.send(data, (error) => {
                console.error("send error?:" + error);
            });
            C2S_Client.GetInstane().close();
        }
    }

    //#endregion

    //#region Custom Function

    /** 是否連線 */
    public get Isconnect(): boolean {
        if (C2S_Client.GetInstane()._socket) {
            return true;
        }
        return false;
    }

    //#endregion
}

export const C2S_Client: C2S_ClientSingleton = new C2S_ClientSingleton();

class ServerMsgDTO {
    public mType: MessageType;

    public mID: number;

    public aID: number;

    public rCode: ReturnCodes;

    public errMsg: string;

    public data: any;

    public count: number;

    public extra: number;


    public ServerMsgDTO0(): void {
        this.mType = MessageType.NewMessage;
        this.rCode = ReturnCodes.Success;
        this.errMsg = null;
        this.data = null;
        return;
    }

    public ServerMsgDTO1(msgIndex: number, action_id: ActionID, ResultObject: any): void {
        this.mType = MessageType.NewMessage;
        this.mID = msgIndex;
        this.aID = action_id;
        this.rCode = ReturnCodes.Success;
        this.errMsg = null;
        this.data = ResultObject;
        this.count = 1;
    }

    // public ServerMsgDTO2(action_id:ActionID,ResultObject:any,count:number):void
    // {
    //     this.aID = action_id;
    //     this.rCode = ReturnCodes.Success;
    //     this.errMsg = null;
    //     this.data = ResultObject;
    //     this.count = count;
    // }

}

class LoginRequestDTO {
    // account name or token
    public Name: string;

    constructor(name: string) {
        this.Name = name;
    }

    public LoginRequestDTO(name: string) {
        this.Name = name;
    }
}

class BroadcastRequestDTO {
    public Priority: number;//權重
    public Msg: string;//訊息

    constructor(_Priority: number = 0, _Msg: string = '') {
        this.Priority = _Priority;
        this.Msg = _Msg;
    }

    public BroadcastRequestDTO(_Priority: number = 0, _Msg: string = '') {
        this.Priority = _Priority;
        this.Msg = _Msg;
    }
}

class GetBulletLogsRequestDTO {
    public Count: number;//查詢筆數
    public StartTime: number;//查詢資料之開始時間
    public EndTime: number;//查詢資料之結束時間


    constructor(_Count: number = 0, _StartTime: number = 0, _EndTime: number = 0) {
        this.Count = _Count;
        this.StartTime = _StartTime;
        this.EndTime = _EndTime;

    }

    public GetBulletLogsRequestDTO(_Count: number = 0, _StartTime: number = 0, _EndTime: number = 0) {
        this.Count = _Count;
        this.StartTime = _StartTime;
        this.EndTime = _EndTime;

    }
}

export enum ActionID {
    // LoginByAccount = 1,
    Logout = 2,

    // // Client Request
    Broadcast = 101,

    // Server Msg
    BroadcastMsg = 201
}
export enum MessageType {
    Response = 0,
    NewMessage = 1,
    Resend = 2
}

// 1 = success, 10000+ = e
export enum ReturnCodes {
    Success = 1,
    NotEnoughCoins = 100001,//錢幣不足(不能發射子彈)
    FishNotExist = 100002,//魚ID不存在(已死或錯誤ID)
    BulletNotFound = 100003,//子彈不存在
    UpdateRecordFailed = 100004,
    WrongGunType = 100005,
    WrongBetAmount = 100006,
}