import * as GUI from '@babylonjs/gui';

export default class UIManager {
    constructor() {
        this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("manager");
        this.gui.isForeground = true;
        this.buttons = {};
    }

    addButton = (btn, group) => {
        this.buttons[btn.name] = {
            'button': btn,
            'group': group
        };
        btn.isPointerBlocker = true;
        this.gui.addControl(this.buttons[btn.name].button);
    }

    getButton = name => {
        return this.buttons[name];
    }

    setButtonText = (name, text) => {
        this.getButton(name).button.textBlock.text = text;
    }
}
