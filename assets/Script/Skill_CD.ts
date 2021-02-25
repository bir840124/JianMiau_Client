const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@menu("Plugs/Skill_CD")
@requireComponent(cc.Sprite)
export default class Skill_CD extends cc.Component {

    /** 寬度比例 */
    @property({ displayName: "寬度比例", min: 0, max: 1, tooltip: "寬度比例", type: cc.Float })
    public SizeX: number = 1;

    /** 高度比例 */
    @property({ displayName: "高度比例", min: 0, max: 1, tooltip: "高度比例", type: cc.Float })
    public SizeY: number = 1;

    private _time: number = 0;
    public callback: Function = null;
    private SkillCD: cc.Node = null;

    //#region Lifecycle

    onLoad(): void {
        let Mask: cc.Node = cc.instantiate(new cc.Node);
        this.node.addChild(Mask, 0, "Mask");
        Mask.addComponent(cc.Mask);
        Mask.getComponent(cc.Mask).type = cc.Mask.Type.IMAGE_STENCIL;
        Mask.getComponent(cc.Mask).spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        Mask.width = this.node.width;
        Mask.height = this.node.height;

        this.SkillCD = cc.instantiate(new cc.Node);
        Mask.addChild(this.SkillCD, 0, "Skill_CD");
        this.SkillCD.addComponent(cc.Sprite);
        this.SkillCD.getComponent(cc.Sprite).type = cc.Sprite.Type.FILLED;
        this.SkillCD.getComponent(cc.Sprite).fillType = cc.Sprite.FillType.RADIAL;
        this.SkillCD.getComponent(cc.Sprite).fillCenter = cc.v2(0.5, 0.5);
        this.SkillCD.getComponent(cc.Sprite).fillStart = 0;
        this.SkillCD.getComponent(cc.Sprite).fillRange = 0;
        this.SkillCD.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        this.SkillCD.width = this.node.height;
        this.SkillCD.height = this.node.width;
        this.SkillCD.angle = 90;
        this.SkillCD.color = cc.color(9, 118, 35);
        this.SkillCD.opacity = 146;
        // var self: this = this;
        // tslint:disable-next-line:typedef
        // cc.loader.loadRes("res/default_sprite_splash", cc.SpriteFrame, function (err: Error, spriteFrame: cc.SpriteFrame) {
        //     // 检查资源加载
        //     if (err) {
        //         console.error("载入预制资源失败, 原因:" + err);
        //         return;
        //     }
        //     if (!(spriteFrame instanceof cc.SpriteFrame)) {
        //         console.error("你载入的不是SpriteFrame!");
        //         return;
        //     }
        //     self.SkillCD.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     self.SkillCD.width = self.node.width;
        //     self.SkillCD.height = self.node.height;
        //     self.SkillCD.angle = 90;
        //     self.SkillCD.color = cc.color(0, 0, 0);
        //     self.SkillCD.opacity = 146;
        // });
    }

    // start () {}

    //#endregion

    //#endregion

    //#region Custom Event

    /** 點擊到此物件並移動 */
    RunCD(Time: number = 1, callback?: Function): void {
        this._time = 1;
        this.callback = callback;
        let self: this = this;
        cc.tween(this)
            .to(Time, { time: 0 })
            .call(() => {
                if (self.callback) {
                    self.callback();
                }
            })
            .start();
    }

    //#endregion

    get time(): number {
        return this._time;
    }
    set time(value: number) {
        // console.log("time", value);
        this._time = Math.floor(value);
        if (this.SkillCD) {
            this.SkillCD.getComponent(cc.Sprite).fillRange = value;
        }
    }

    // update (dt) {}
}
