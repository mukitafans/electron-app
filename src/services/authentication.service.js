import { BehaviorSubject } from "rxjs";
import axios from "axios";
import jwt_decode from "jwt-decode";
import moment from "moment";

import { globals } from "../variables/config.js";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("currentUser")));

export const authenticationService = {
    login,
    logout,
    loginValid,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
};

function login(username, password) {
    //http request
    return axios
        .post(globals.url_api + "authenticate", {
           // username: username,
           // password: password,
           username: "david",
           password: "david",
        })
        .then((res) => {
            if (res.status === 200) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem("currentUser", JSON.stringify(res.data.user));
                currentUserSubject.next(res.data.user);
                return res.data.user;
            }

            if (res.status === 401 || res.status === 403) {
                // remove store user
                localStorage.removeItem("currentUser");
                currentUserSubject.next(null);
                return "User or password incorrrect";
            }
        })
        .catch(() => {
            return { error: "User or password incorrrect!" };
        });
}

function loginValid() {
    //if token is valid now
    if (currentUserSubject && currentUserSubject.value && currentUserSubject.value.token) {
        var decoded = jwt_decode(currentUserSubject.value.token);
        return decoded && decoded.exp > moment().unix() ? true : false;
    } else return false;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    currentUserSubject.next(null);
}
