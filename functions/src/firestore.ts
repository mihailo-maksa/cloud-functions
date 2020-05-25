import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const gameCount = functions.firestore
  .document("/games/{game.uid}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    const userRef = db.doc(`/users/${data?.uid}`);

    const userSnap = await userRef.get();

    const userData = userSnap.data();

    return userData?.update({
      gameCount: 1 // userRef.gameCount + 1
    });
  });

export const userTrend = functions.firestore
  .document("/games/{game.uid}")
  .onUpdate((snapshot, context) => {
    const after = snapshot.after.data();
    const before = snapshot.before.data();

    let trend;

    if (after?.score >= before?.score) {
      trend = "You are improving";
    } else {
      trend = "You are on the decline";
    }

    const userRef = db.doc(`/users/${after?.uid}`);

    return userRef.update({ trend });
  });
