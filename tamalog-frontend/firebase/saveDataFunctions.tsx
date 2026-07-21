import { db, auth } from './firebase'; // Firebaseの設定をインポート
import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Entry, EntryAC, EntrySports } from '../app/components/type';

const getCurrentUser = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('ユーザーがログインしていません');
  }

  return user;
};

const normalizeEntryAC = (data: any): EntryAC[] => {
  if (Array.isArray(data.entryAC)) {
    return data.entryAC;
  }

  if (
    data.nickname ||
    data.icon ||
    data.height ||
    data.sex ||
    data.goalWeight ||
    data.goalFat ||
    data.goalMuscle
  ) {
    return [
      {
        id: data.id || 'profile',
        nickname: data.nickname || '',
        icon: data.icon || '',
        height: data.height || '',
        sex: data.sex || '',
        goalWeight: data.goalWeight || '0',
        goalFat: data.goalFat || '0',
        goalMuscle: data.goalMuscle || '0',
      },
    ];
  }

  return [];
};

///////////////////////////////////////////
//user情報
///////////////////////////////////////////
// Firebaseにユーザー情報を保存する関数
export const saveUserInfoToFirestore = async (userInfo: {
  nickname: string;
  icon: string;
  height: string;
  sex: string;
  goalWeight: string;
  goalFat: string;
  goalMuscle: string;
}) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('ユーザーがログインしていません');
  }

  try {
    const userDocRef = doc(db, 'userProfiles', user.uid);


    await setDoc(userDocRef, userInfo, { merge: true });
    console.log('User information successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving user information to Firestore:', error);
    throw new Error('ユーザー情報の保存中にエラーが発生しました。');
  }
};

// Firestoreからユーザー情報を取得する関数
export const fetchUserInfoFromFirestore = async () => {
  const user = getCurrentUser();

  try {
    const userDocRef = doc(db, 'userProfiles', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data;
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    throw new Error('ユーザー情報の取得中にエラーが発生しました。');
  }
};

///////////////////////////////////////////
//Entry情報
///////////////////////////////////////////
// Firestoreにエントリー情報を保存する関数
export const saveEntryToFirestore = async (entry: Entry) => {
  const user = getCurrentUser();

  try {
    const userDocRef = doc(db, 'userEntries', user.uid);


    await setDoc(
      userDocRef,
      {
        entries: arrayUnion(entry),
      },
      { merge: true }
    );
    console.log('Entry successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving entry to Firestore:', error);
    throw new Error('データの保存中にエラーが発生しました。');
  }
};

export const getEntriesForCurrentUser = async (): Promise<Entry[]> => {
  const user = getCurrentUser();
  const userDocRef = doc(db, 'userEntries', user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    return [];
  }

  const data = docSnap.data();
  return data.entries || [];
};

// Firestoreからユーザーのエントリーを取得する関数
export const getEntriesFromFirestore = async (setEntries: React.Dispatch<React.SetStateAction<Entry[]>>) => {
  try {
    const entries = await getEntriesForCurrentUser();
    setEntries(entries);
    console.log('User entries fetched successfully:', entries);
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    alert('データの取得中にエラーが発生しました。');
  }
};

//count
export const getCountEntriesFromFirestore = async (setEntries: React.Dispatch<React.SetStateAction<Entry[]>>) => {
  try {
    const entries = await getEntriesForCurrentUser();
    setEntries(entries);
    console.log('User entries fetched successfully:', entries);
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    alert('データの取得中にエラーが発生しました。');
  }
};
///////////////////////////////////////////
//EntryAC情報
///////////////////////////////////////////
// EntryACデータをFirestoreに保存する関数
export  const saveEntryACToFirestore = async (entryAC: EntryAC) => {
    try {
      const user = auth.currentUser;
      if (user) {
         const userDocRef = doc(db, 'userProfiles', user.uid);
         await setDoc(userDocRef, { 
            entryAC: arrayUnion(entryAC) 
          }, { merge: true });
        console.log('EntryAC data successfully written to Firestore');
      } else {
        alert('ユーザーがログインしていません。');
      }
    } catch (error) {
      console.error('Error writing EntryAC to Firestore:', error);
      alert('データ保存中にエラーが発生しました。');
    }
  };


export const getEntryACForCurrentUser = async (): Promise<EntryAC[]> => {
  const user = getCurrentUser();
  const userDocRef = doc(db, 'userProfiles', user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    return [];
  }

  return normalizeEntryAC(docSnap.data());
};

// EntryACデータを取得する関数
export const getEntryACFromFirestore = async (setEntryAC: React.Dispatch<React.SetStateAction<EntryAC[]>>) => {
     try {
        const entryAC = await getEntryACForCurrentUser();
        setEntryAC(entryAC);
        console.log('User profile fetched successfully:', entryAC);
      } catch (error) {
          console.error('Error fetching data from Firestore:', error);
          alert('データの取得中にエラーが発生しました。');
        }
      };


  // Firestoreから最新のEntryACを取得する関数
export const getEntryACNFromFirestore = async (
  setEntryAC: React.Dispatch<React.SetStateAction<EntryAC | null>>
) => {
  try {
    const entryAC = await getEntryACForCurrentUser();
    setEntryAC(entryAC[entryAC.length - 1] || null);
    console.log('User profile fetched successfully:', entryAC);
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    alert('データの取得中にエラーが発生しました。');
  }
};


///////////////////////////////////////////
//Entrysports情報
///////////////////////////////////////////

// EntrySportsデータをFirestoreに保存する関数
export const saveEntrySportsToFirestore = async (entrySports: EntrySports) => {
  try {
    const user = auth.currentUser;
    if (user) {
       const userDocRef = doc(db, 'userSports', user.uid);
       await setDoc(userDocRef, { 
          entrySports: arrayUnion(entrySports) 
        }, { merge: true });
      console.log('EntrySports data successfully written to Firestore');
    } else {
      alert('ユーザーがログインしていません。');
    }
  } catch (error) {
    console.error('Error writing EntrySports to Firestore:', error);
    alert('データ保存中にエラーが発生しました。');
  }
};

/*
// EntrySportsデータを取得する関数
export const getEntrySportsFromFirestore = async (setEntrySports: React.Dispatch<React.SetStateAction<EntrySports[]>>) => {
   try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'userSports', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEntrySports(data.entrySports || []);
          console.log('User data fetched successfully:', data);
        } else {
          console.log('No user data found');
        }
      }
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        alert('データの取得中にエラーが発生しました。');
      }
    };

*/
    export const getEntrySportsFromFirestore = async (setEntrySports: React.Dispatch<React.SetStateAction<EntrySports[]>>) => {
      try {
        const entrySports = await getEntrySportsForCurrentUser();
        setEntrySports(entrySports);
        console.log("Firestoreから取得したスポーツデータ: ", entrySports);
      } catch (error) {
        console.error("Firestoreからのデータ取得エラー: ", error);
        alert("データの取得中にエラーが発生しました");
      }
    };

export const getEntrySportsForCurrentUser = async (): Promise<EntrySports[]> => {
  const user = getCurrentUser();
  const userDocRef = doc(db, 'userSports', user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    return [];
  }

  const data = docSnap.data();
  return data.entrySports || [];
};

///////////////////////////////////////////
//Entry削除機能
///////////////////////////////////////////
// FirestoreからEntryを削除する関数
export const deleteEntryFromFirestore = async (entryToDelete: Entry) => {
  const user = getCurrentUser();

  try {
    const userDocRef = doc(db, 'userEntries', user.uid);

    await setDoc(
      userDocRef,
      {
        entries: arrayRemove(entryToDelete),
      },
      { merge: true }
    );
    console.log('Entry successfully deleted from Firestore');
  } catch (error) {
    console.error('Error deleting entry from Firestore:', error);
    throw new Error('データの削除中にエラーが発生しました。');
  }
};

export const replaceEntriesInFirestore = async (entries: Entry[]) => {
  const user = getCurrentUser();
  const userDocRef = doc(db, 'userEntries', user.uid);

  await setDoc(
    userDocRef,
    {
      entries,
    },
    { merge: true }
  );
};

export const deleteEntryByIdFromFirestore = async (id: string) => {
  const entries = await getEntriesForCurrentUser();
  const updatedEntries = entries.filter((entry) => entry.id !== id);

  await replaceEntriesInFirestore(updatedEntries);
  return updatedEntries;
};

// FirestoreのEntryを更新する関数
export const updateEntryInFirestore = async (oldEntry: Entry, updatedEntry: Entry) => {
  const user = getCurrentUser();

  try {
    const userDocRef = doc(db, 'userEntries', user.uid);
    
    // 古いエントリーを削除して新しいエントリーを追加
    await setDoc(
      userDocRef,
      {
        entries: arrayRemove(oldEntry),
      },
      { merge: true }
    );

    await setDoc(
      userDocRef,
      {
        entries: arrayUnion(updatedEntry),
      },
      { merge: true }
    );
    
    console.log('Entry successfully updated in Firestore');
  } catch (error) {
    console.error('Error updating entry in Firestore:', error);
    throw new Error('データの更新中にエラーが発生しました。');
  }
};
    
