"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
//Server configurations
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000, () => {
    console.log("Api up Running on port : " + 3000);
});
//Firebase configurations
var serviceAccount = require('./Conerive-d52cd6e292fe.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();
let Realdb = admin.database();
app.get('/AddBot', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let BotNumber = yield BotCount();
        let userPhonearray = [BotNumber];
        yield AddNewUsers(userPhonearray);
        yield UpdateGeneralAllUsers(userPhonearray);
        yield Updatecount(BotNumber + userPhonearray.length);
    });
});
app.get('/AddBot_Trip', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let BotNumber = yield BotCount();
        let userPhonearray = [BotNumber];
        yield AddNewUsers(userPhonearray);
        yield UpdateGeneralAllUsers(userPhonearray);
        yield Updatecount(BotNumber + userPhonearray.length);
        for (let num of userPhonearray) {
            yield AddTripto(num);
        }
    });
});
app.post("/AddFriendBot", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let MainBitch = req.body.bot1;
        let SideBitch = req.body.bot2;
        if (MainBitch == null) {
            //code this functions , bot making friends with users
            MainBitch = req.body.Userid;
        }
        yield AddFriendShipTo(MainBitch, SideBitch);
        yield AddFriendShipTo(SideBitch, MainBitch);
    });
});
app.post("/AddTripBot", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let MainBitch = req.body.bot;
        yield AddTripto(MainBitch);
    });
});
function AddTripto(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            db.collection("TRIP").doc("Q3KmmOTZiyrFi9Yqf7jf").get().then(groupinfo => {
                let tripmemberArray = groupinfo.data().Users;
                tripmemberArray.push(bot);
                db.collection("TRIP").doc("Q3KmmOTZiyrFi9Yqf7jf").update({ Users: tripmemberArray }).then(() => resolve());
            });
        });
    });
}
function LocationNewBot(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        Realdb.ref("").set();
    });
}
function AddFriendShipTo(id1, id2) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            db.collection("USERS").doc(id1).get().then(userInfo => {
                let ArrayOfFriends = userInfo.data().Friends;
                ArrayOfFriends.push(id2);
                db.collection("USERS").doc(id1).update({ Friends: ArrayOfFriends }).then(() => resolve());
            });
        });
    });
}
function AddNewUsers(phones) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            try {
                phones.forEach(PhonNum => {
                    let userObject = {
                        "Name": "YenoBot" + PhonNum,
                        "Phone": PhonNum
                    };
                    db.collection('USERS').doc(PhonNum).set(userObject).then(() => {
                        console.log("Bot Added" + PhonNum);
                    });
                });
            }
            catch (e) {
                console.log("Died at adding new users" + e);
                resolve(false);
            }
            resolve(true);
        });
    });
}
function BotCount() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            db.collection('BOT').doc('GENERAL').get().then(data => {
                resolve(data.data().BOTCOUNT);
            });
        });
    });
}
function Updatecount(Count) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            db.collection('BOT').doc('GENERAL').update({ 'BOTCOUNT': Count }).then(() => console.log("New count is " + Count));
        });
    });
}
function UpdateGeneralAllUsers(phones) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            db.collection("GENERAL").document("ALLUSERS").get().then(data => {
                phones.forEach(PhonNum => {
                    data.data().Phone.push(PhonNum);
                });
                db.collection("GENERAL").document("ALLUSERS").update({ Phone: phones }).then(() => resolve());
            });
        });
    });
}
