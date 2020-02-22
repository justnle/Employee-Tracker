'use strict';

class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;

        this.getName = function() {
            return this.name;
        };
    }
    getID() {
        return this.id;
    }
}

module.exports = Department;