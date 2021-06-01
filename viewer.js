module.exports = class Viewer {
    constructor(name) {
        this.name = name;
        this.points = 0;
        this.watchtime = 0;
        this.online = false;
    }
    setCommand(command,func){
        this.commands[command] = func;
    }

};