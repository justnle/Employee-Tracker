'use strict';

class Employee {
    constructor(id, firstName, lastName, roleID, managerID) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleID = roleID;
        this.managerID = managerID;

        this.getID = function() {
            return this.id;
        };
        this.getFirstName = function() {
            return this.firstName;
        };
        this.getLastName = function() {
            return this.lastName;
        };
        this.getRoleID = function() {
            return this.roleID;
        };
        this.getManagerID = function() {
            return this.managerID;
        };
    }
}

module.exports = Employee;