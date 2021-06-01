module.exports = class User {
    constructor(name, commands=[], viewers={}) {
        this.name = name;
        this.commands = commands;
        this.viewers = viewers;
    }
    setCommand(command,func){
        this.commands[command] = func;
    }
};