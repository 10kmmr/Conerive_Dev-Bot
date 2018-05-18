import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as admin from 'firebase-admin';


//Server configurations
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000, () => {
    console.log("Api up Running on port : "+ 3000);
});

//Firebase configurations
var serviceAccount = require('./Conerive-d52cd6e292fe.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://roadtrip-app-efa3a.firebaseio.com/"
});
let db = admin.firestore();
let Realdb = admin.database();

app.get('/AddBot',async function (req, res) {
    let BotNumber = await BotCount();
    let userPhonearray:Array<number> = [ BotNumber ];
    await AddNewUsers(userPhonearray);
    await UpdateGeneralAllUsers(userPhonearray);
    await Updatecount(BotNumber +userPhonearray.length);
    res.send({
        "Status" :"Success",
        "DONE":"DEAL",
        "New BoT ": BotNumber
    });
});

app.get('/AddBot_Trip',async function (req, res) {
    let BotNumber = await BotCount();
    let userPhonearray:Array<number> = [ BotNumber ];
    await AddNewUsers(userPhonearray);
    await UpdateGeneralAllUsers(userPhonearray);
    await Updatecount(BotNumber +userPhonearray.length);
    for (let num of userPhonearray) {
        await AddTripto(num);
    }
    res.send({
        "writing":"data"
    });
});

app.post("/AddFriendBot",async function(req,res){
    let MainBitch = req.body.bot1;
    let SideBitch = req.body.bot2;
    if(MainBitch==null){
        //code this functions , bot making friends with users
        MainBitch = req.body.Userid;
    }
    await AddFriendShipTo(MainBitch,SideBitch);
    await AddFriendShipTo(SideBitch,MainBitch);
    res.send({
        "Status" :"Success",
        "DONE":"DEAL",
        "NOW" : MainBitch + "AND " + SideBitch + " Are fronds ."
    });
});

app.post("/AddTripBot",async function(req,res) {
   let MainBitch = req.body.trippimp;
   await AddTripto(MainBitch);
   await AddLocation(MainBitch);
   res.send({
       "DONE":"DEAL",
       "ADDED":MainBitch
   })
});


async function AddLocation(bot){
    return new Promise(resolve => {
        Realdb.ref("/USERS/"+bot+"/Location").update({
            "Latitude": 12.73 +Math.random(),
            "Longitude": 77.6198776
        }).then(()=>{
            resolve();
        });
    });
}
async function AddTripto(bot){
    return new Promise(resolve => {
        db.collection("TRIPS").doc("cT3kfPzm2cw7uoDu27Ht").get().then(groupinfo=>{
            console.log(groupinfo.data());
            let tripmemberArray : Array<string> = groupinfo.data().Users;
            tripmemberArray.push(bot);
            db.collection("TRIPS").doc("cT3kfPzm2cw7uoDu27Ht").update({ Users : tripmemberArray }).then(()=>resolve());
        });
    })
}
async function AddFriendShipTo(id1,id2) {
    return new Promise(resolve => {
        db.collection("USERS").doc(id1).get().then(userInfo =>{
            let ArrayOfFriends:Array<string> = userInfo.data().Friends;
            console.log(userInfo.data());
            ArrayOfFriends.push(id2);
           db.collection("USERS").doc(id1).update({ Friends :ArrayOfFriends}).then(()=>resolve());
        });
    });
}
async function AddNewUsers(phones:Array<number>):Promise<boolean>{
    return new Promise<boolean>(resolve => {
        try {
            phones.forEach(PhonNum =>{
                let userObject = {
                    "Name": "YenoBot"+PhonNum,
                    "Phone": PhonNum.toString(),
                    "Token":"NIG NIG",
                    "Friends":[]
                };
                db.collection('USERS').doc(PhonNum.toString()).set(userObject).then(()=>{
                    console.log("Bot Added" + PhonNum);
                });
            })
        }catch (e) {
            console.log("Died at adding new users" + e);
            resolve(false);
        }
        resolve(true);
    })
}
async function BotCount():Promise<number>{
    return  new Promise<number>(resolve => {
        db.collection('BOT').doc('GENERAL').get().then(data =>{
             resolve(data.data().BOTCOUNT);
        });
    })
}
async function Updatecount(Count:number){
    return new Promise(resolve => {
        db.collection('BOT').doc('GENERAL').update({ 'BOTCOUNT' : Count}).then(()=>{
            resolve();
            console.log("New count is "+Count);
        });
    });
}
async function UpdateGeneralAllUsers(phones:Array<number>){
    return new Promise(resolve =>{
        db.collection("GENERAL").doc("ALLUSERS").get().then(data =>{
            let ArrayPhones:Array<number> = data.data().Phone;
            phones.forEach(PhonNum=>{
                ArrayPhones.push(PhonNum);
            });
            db.collection("GENERAL").doc("ALLUSERS").update({Phone : ArrayPhones}).then(()=>resolve());
        })
    });
}
