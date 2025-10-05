"use client";
///////////////////////////////////////////
// import
///////////////////////////////////////////
//main
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header3 from '../../components/Header/Header3';

// Firebase
import { auth} from '../../../firebase/firebase';
import { saveEntryACToFirestore,  getEntryACFromFirestore, getCountEntriesFromFirestore} from "../../../firebase/saveDataFunctions";

//style
import styles from './../../styles/main.module.css';
import create from './mobileprifile.module.css';

// Modal
import NicknameModal from '../../components/Modal/Nickname';

//type
import { Entry,EntryAC, EntrySports } from '../../components/type'; 


//Image
import piyo01 from '../../public/piyo01.png'
import piyo02 from '../../public/piyo02.png'
import piyo03 from '../../public/piyo03.png'
import piyo04 from '../../public/piyo04.png'
import piyo05 from '../../public/piyo05.png'
import piyo06 from '../../public/piyo06.png'

import Pro1 from '../../public/Pro1.png';
import Pro8 from '../../public/Pro8.png';
import Pro9 from '../../public/Pro9.png';

import ProTitle5 from '../../public/proTitle5.png'
import ProCAL from '../../public/proCAl.png'
import save from '../../public/save.png';
import edit from '../../public/edit.png';
///////////////////////////////////////////
// メインコンポーネント
///////////////////////////////////////////
export default function Home() {
  ///////////////////////////////////////////
  // ステート管理
  ///////////////////////////////////////////
  // データ関連
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entryAC, setEntryAC] = useState<EntryAC[]>([]);

  // 認証関連のstate
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [editingField, setEditingField] = useState<keyof EntryAC | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [calculatedFat, setCalculatedFat] = useState<number | null>(null);
  const [calculatedLean, setCalculatedLean] = useState<number | null>(null);

  // Nicknameモーダルの状態
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');

  ///////////////////////////////////////////
  // レンダリング時の処理
  ///////////////////////////////////////////
  // データ取得関数
  const fetchData = async () => {
    if (auth.currentUser) {
      await getEntryACFromFirestore(setEntryAC);
      await getCountEntriesFromFirestore(setEntries);
    }
  };

  //API
  useEffect(() => {
    fetchData();
  }, []);

  // プロフィールデータがない場合、モーダルを表示
  useEffect(() => {
    if (isLoggedIn && entryAC.length === 0) {
      setIsNicknameModalOpen(true);
    }
  }, [isLoggedIn, entryAC]);

    // ログイン状態の監視
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsLoggedIn(!!user);  // ユーザーがログインしていればtrue、ログインしていなければfalse
      });
  
      return () => unsubscribe();  // コンポーネントがアンマウントされた際に監視を解除
    }, []);

  ///////////////////////////////////////////
  // イベントハンドラー
  ///////////////////////////////////////////
const handleSave = async () => {
  if (entryAC.length > 0) {
    await saveEntryACToFirestore(entryAC[0]); // Firestoreにデータを保存
    setEditingField(null); // 保存後、編集モードを終了
  }
};

const handleSetNickname = (newNickname: string) => {
  setNickname(newNickname);
};


const handleChange = (field: keyof EntryAC, value: string) => {
  if (entryAC.length > 0) {
    const updated = { ...entryAC[0], [field]: value };
    setEntryAC([updated]);
  }
};

const handleEdit = (field: keyof EntryAC) => {
  setEditingField(field); // 編集モードに切り替え
};

//ランクに応じて画像変更
  // カウント数に基づいて画像を切り替える関数
  const getImageForCount = (count: number) => {
    if (count >= 25) return piyo06; // 25以上はpiyo06固定
    if (count >= 20) return piyo05;
    if (count >= 15) return piyo04;
    if (count >= 10) return piyo03;
    if (count >= 5) return piyo02;
    return piyo01;
  };

  const currentImage = getImageForCount(entries.length);

// 計算処理
const calculateTargets = () => {
  const currentEntry = entryAC[0];
  if (currentEntry?.height && currentEntry?.sex) {
    const heightInMeters = parseFloat(currentEntry.height) / 100; // 身長をメートル単位に変換
    const standardBMI = currentEntry.sex === 'male' ? 22 : 21;
    const idealFatRate = currentEntry.sex === 'male' ? 0.15 : 0.23;
    const idealLeanRate = currentEntry.sex === 'male' ? 0.85 : 0.77;

    // 標準体重 = 身長(m) × 身長(m) × 標準BMI
    const standardWeight = heightInMeters * heightInMeters * standardBMI;

    // 標準体脂肪量 = 標準体重 × 理想体脂肪率
    const standardFat = standardWeight * idealFatRate;

    // 標準除脂肪量 = 標準体重 × 理想除脂肪率
    const standardLean = standardWeight * idealLeanRate;

    setCalculatedWeight(standardWeight);
    setCalculatedFat(standardFat);
    setCalculatedLean(standardLean);
  }
};

  ///////////////////////////////////////////
  // UIレンダリング
  ///////////////////////////////////////////
  return (
    <div className={styles.body}>
    <Header3 />
      <div className={create.fullbackContent}>
      {/* レフトサイドバー */}
      {/* メインコンテンツ */}
      <div className={create.mainbackContent2}>
        <div className={create.mainContent2}>
          {/*title*/}
          <div className={create.title}>
            <Image src={Pro1} alt='TitleImage' width={200}></Image>
          </div>
            {/*profile上*/}
              {entryAC.length > 0 && entryAC[0] ? (
                <>
                  <div className={create.proueback}>
                    <div className={create.piyoback}>
                    <Image src={currentImage} alt="Piyo image" width={250}className={create.piyo03} />
                    </div>
                    <div className={create.protext}>

                      {/* Nickname */}
                      <div className={create.pro_title}>
                          にっくねーむ
                      </div>

                      <div className={create.nicknameback}>
                        {editingField === 'nickname' ? (
                          <>
                            <input type="text" value={entryAC[0].nickname} 
                              onChange={(e) => handleChange('nickname', e.target.value)} 
                              className={create.nicknameInput}
                            />
                            <button onClick={handleSave} className={create.saveButton}>
                              <Image src={save} alt='save' height={20}></Image>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className={create.nicknameText}>{entryAC[0].nickname}</span>
                            <button onClick={() => handleEdit('nickname')} className={create.editButton}>
                              <Image src={edit} alt='save' height={20}></Image>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Goal */}
                      <div className={create.pro_title}>
                         ごーるせってい
                      </div>
                      <div className={create.Goalback}>
                        {/* Goal Weight */}
                        <div className={create.goalWeightback}>  
                          {editingField === 'goalWeight' ? (
                            <>
                              <input 
                                type="number" 
                                value={entryAC[0].goalWeight} 
                                onChange={(e) => handleChange('goalWeight', e.target.value)} 
                                className={create.goalInput}
                              />
                              <button onClick={handleSave} className={create.saveButton}>
                                <Image src={save} alt='save' height={20}></Image>
                              </button>
                            </>
                          ) : (
                            <>
                              <span className={create.goalText}>{entryAC[0].goalWeight} kg</span>
                              <button onClick={() => handleEdit('goalWeight')} className={create.editButton}>
                              <Image src={edit} alt='save' height={20}></Image>
                            </button>
                            </>
                          )}
                        </div>
                      

                      {/* Goal Fat */}
                      <div className={create.goalFatback}> 
                        {editingField === 'goalFat' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC[0].goalFat} 
                              onChange={(e) => handleChange('goalFat', e.target.value)} 
                              className={create.goalInput}
                            />
                            <button onClick={handleSave} className={create.saveButton}>
                                <Image src={save} alt='save' height={20}></Image>
                              </button>
                          </>
                        ) : (
                          <>
                            <span className={create.goalText}>{entryAC[0].goalFat} kg</span>
                            <button onClick={() => handleEdit('goalFat')} className={create.editButton}>
                              <Image src={edit} alt='save' height={20}></Image>
                            </button>
                          </>
                        )}
                      </div>
                      

                      {/* Goal Muscle */}
                      <div className={create.goalMuscleback}> 
                        {editingField === 'goalMuscle' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC[0].goalMuscle} 
                              onChange={(e) => handleChange('goalMuscle', e.target.value)} 
                              className={create.goalInput}
                            />
                            <button onClick={handleSave} className={create.saveButton}>
                                <Image src={save} alt='save' height={20}></Image>
                              </button>
                          </>
                        ) : (
                          <>
                            <span className={create.goalText}>{entryAC[0].goalMuscle} kg</span>
                            <button onClick={() => handleEdit('goalMuscle')} className={create.editButton}>
                              <Image src={edit} alt='save' height={20}></Image>
                            </button>
                          </>
                        )}
                      </div>
                      </div>
                      {/*Height&Sex*/}
                      <div className={create.pro_title}>
                         しんちょう・せいべつ
                      </div>
                      <div className={create.HSback}>
                      {/* Height */}
                      <div className={create.Heightback}>
                        {editingField === 'height' ? (
                          <>
                            <input 
                              type="number" 
                              value={entryAC[0].height} 
                              onChange={(e) => handleChange('height', e.target.value)} 
                              className={create.HSInput}
                            />
                            <button onClick={handleSave} className={create.saveButton}>
                                <Image src={save} alt='save' height={20}></Image>
                              </button>
                          </>
                        ) : (
                          <>
                            <span className={create.HSText}>{entryAC[0].height} cm</span>
                            <button onClick={() => handleEdit('height')} className={create.editButton}>
                              <Image src={edit} alt='save' height={20}></Image>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Sex */}
                      <div className={create.Sexback}>
                        {editingField === 'sex' ? (
                          <>
                            <select 
                              value={entryAC[0].sex} 
                              onChange={(e) => handleChange('sex', e.target.value)}
                              className={create.HSInput} 
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            <button onClick={handleSave} className={create.saveButton}>
                              <Image src={save} alt='save' height={20}></Image>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className={create.HSText}>{entryAC[0].sex}</span>
                            <button onClick={() => handleEdit('sex')} className={create.editButton}>
                              <Image src={edit} alt='save' height={20}></Image>
                            </button>
                          </>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>

                {/*title*/}
              <div className={create.title1}>
                <Image src={Pro8} alt='TitleImage' width={400}></Image>
              </div>
              <div className={create.title2}>
                <Image src={ProTitle5} alt='TitleImage' width={250}></Image>
              </div>
              
              <div className={create.prsitaback}>
                      {/* 目標体重の目安 */}
                        <button
                          onClick={calculateTargets}
                          className={create.CAlbutton}
                          disabled={!entryAC[0]?.height || !entryAC[0]?.sex}
                        >
                          <Image src={ProCAL} alt='calcylate' width={100}></Image>
                        </button>
                        {calculatedWeight && calculatedFat && calculatedLean && (
                          <div className={create.CLback}>
                            <div className={create.CWeightback}>
                              <p className={create.CLText}>{calculatedWeight.toFixed(2)} kg</p></div>
                            <div className={create.CFatback}>
                              <p className={create.CLText}>{calculatedFat.toFixed(2)} kg</p></div>
                            <div className={create.CRemtback}>
                            <p className={create.CLText}>{calculatedLean.toFixed(2)} kg</p></div>
                          </div>
                        )}
                  <div className={create.title3}>
                    <Image src={Pro9} alt='TitleImage' width={250}></Image>
                  </div>
              </div>
                      
                      
                    </>
                  ) : (
                    <p>No profile data available. Please set up your profile.</p>

               )}

        </div>

      </div>

      </div>

      {/* Nicknameモーダル */}
      <NicknameModal
        isNicknameModalOpen={isNicknameModalOpen}
        setIsNicknameModalOpen={setIsNicknameModalOpen}
        entryAC={entryAC}
        setEntryAC={setEntryAC}
        editingId={editingId}
        setEditingId={setEditingId}
        handleSetNickname={handleSetNickname}
      />
    </div>

  );
}
