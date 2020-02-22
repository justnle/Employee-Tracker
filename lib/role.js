'use strict';

const Department = require('./department');

class Role extends Department {
    constructor(id, title, salary, departmentID) {
        super(departmentID);
        this.id = id;
        this.title = title,
        this.salary = salary,
        this.departmentID = departmentID;

        this.title = function() {
            return this.title;
        };
        this.salary = function() {
            return this.salary;
        };
        this.departmentID = function() {
            return this.departmentID;
        }
    }
}

module.exports = Role;