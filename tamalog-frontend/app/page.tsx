"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import AuthModal from './components/Modal/AuthModal';

// styleと画像はそのまま
import styles from './styles/start.module.css';
import logo from './public/logo2.png'

const MOBILE_BREAKPOINT = 768;

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // ログインモーダルの状態管理
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * ページ遷移処理
   * @param isNewUser - 新規ユーザーの場合true
   */
  const navigateToApp = (isNewUser: boolean = false) => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;

      // 新規ユーザーの場合はプロフィール画面へ
      if (isNewUser) {
        router.push('/create-post/mobile-prifile');
        return;
      }

      // 既存ユーザーは通常のページへ
      if (screenWidth < MOBILE_BREAKPOINT) {
        router.push('/mobile-page');
      } else {
        router.push('/components/PC');
      }
    }
  };

  /**
   * ログインしてスタートボタンクリック時
   */
  const handleLoginStartClick = () => {
    setIsSignUpModalOpen(true);
    setIsLoginMode(true);
  };

  /**
   * おためしボタンクリック時（テストアカウントで自動ログイン）
   */
  const handleTrialClick = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'aiu5@gmail.com', '123456');
      navigateToApp(false);
    } catch (error: any) {
      alert(`おためしログインエラー: ${error.message}`);
    }
  };

  /**
   * 認証処理（ログイン/サインアップ）
   */
  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let isNewUser = false;

      if (isLoginMode) {
        // ログイン
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // サインアップ
        await createUserWithEmailAndPassword(auth, email, password);
        isNewUser = true; // 新規ユーザーフラグを立てる
      }

      // 認証成功したらモーダルを閉じてページ遷移
      setIsSignUpModalOpen(false);
      navigateToApp(isNewUser);
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    }
  };

  const handleLogout = () => {
    // この画面では不要だが、AuthModalのインターフェースに必要
  };

  return (
    <div className={styles.startback}>
      <div className={styles.title}>
        <div className={styles.title_text}>けんこうCheers!</div>
        <Image src={logo} alt="Piyo image" className={styles.logo} priority></Image>

        <button
          onClick={handleLoginStartClick}
          className={styles.title_text1}
          disabled={!isClient}
        >
          ろぐいん
        </button>

        <button
          onClick={handleTrialClick}
          className={styles.title_text2}
          disabled={!isClient}
        >
          おためし
        </button>

      </div>

      {/* ログインモーダル */}
      <AuthModal
        isSignUpModalOpen={isSignUpModalOpen}
        setIsSignUpModalOpen={setIsSignUpModalOpen}
        isLoginMode={isLoginMode}
        setIsLoginMode={setIsLoginMode}
        handleAuthSubmit={handleAuthSubmit}
        handleLogout={handleLogout}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
}