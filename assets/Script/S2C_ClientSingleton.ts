import { ActionID } from "./C2S_ClientSingleton";
import Main from "./Main";
import { Notify } from "./NotifySingleton";

export default class S2C_ClientSingleton {
    private Instance: S2C_ClientSingleton = null;

    //#region Lifecycle

    public GetInstane() {
        if (S2C_Client.Instance == null) {
            S2C_Client.Instance = new S2C_ClientSingleton();
        }
        return S2C_Client.Instance;
    }

    constructor() {
        Notify.GetInstane().once("on_server_error", this.Server_Error, this);
        Notify.GetInstane().on(ActionID.BroadcastMsg.toString(), this.ReceiveScrollMsg, this);
    }

    //#endregion

    //#region Custom Function

    Server_Error(): void {
        Main.Instance.Server_Error();
    }

    /**
     * 接收滾動信息
     * @param Data Priority 權重(0優先 ~ 2普通)
     * @param Data str 信息內容
     */
    ReceiveScrollMsg(Data: Object) {
        Main.Instance.ReceiveScrollMsg(Data['Priority'], Data['Msg']);
    }

    //#endregion
}

export const S2C_Client = new S2C_ClientSingleton();