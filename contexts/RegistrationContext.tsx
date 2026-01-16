"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "registration_flow";

/**
 * 会員登録フローの状態管理
 */
type RegistrationContextType = {
  // 初期化完了フラグ
  isInitialized: boolean;

  // 会員規約同意
  termsAgreed: boolean;
  termsAgreedAt: Date | null;
  setTermsAgreed: (agreed: boolean) => void;

  // プラン選択
  selectedPlanId: number | null;
  setSelectedPlanId: (planId: number) => void;

  // ステップ管理（1: 規約同意, 2: プラン選択, 3: アカウント作成, 4: 支払い）
  currentStep: 1 | 2 | 3 | 4;
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;

  // アカウント作成状態
  accountCreated: boolean;
  setAccountCreated: (created: boolean) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;

  // フロー全体のリセット
  resetRegistration: () => void;
};

type StoredRegistrationData = {
  termsAgreed: boolean;
  termsAgreedAt: string | null;
  selectedPlanId: number | null;
  currentStep: 1 | 2 | 3 | 4;
  accountCreated: boolean;
  userId: string | null;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

/**
 * RegistrationProvider コンポーネント
 */
export function RegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [termsAgreed, setTermsAgreedState] = useState(false);
  const [termsAgreedAt, setTermsAgreedAt] = useState<Date | null>(null);
  const [selectedPlanId, setSelectedPlanIdState] = useState<number | null>(
    null
  );
  const [currentStep, setCurrentStepState] = useState<1 | 2 | 3 | 4>(1);
  const [accountCreated, setAccountCreatedState] = useState(false);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時にlocalStorageから状態を復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredRegistrationData = JSON.parse(stored);
        setTermsAgreedState(data.termsAgreed);
        setTermsAgreedAt(data.termsAgreedAt ? new Date(data.termsAgreedAt) : null);
        setSelectedPlanIdState(data.selectedPlanId);
        setCurrentStepState(data.currentStep || 1);
        setAccountCreatedState(data.accountCreated || false);
        setUserIdState(data.userId || null);
      }
    } catch (error) {
      console.error("Failed to restore registration state:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 状態が変更されたらlocalStorageに保存
  useEffect(() => {
    if (!isInitialized) return;

    try {
      const data: StoredRegistrationData = {
        termsAgreed,
        termsAgreedAt: termsAgreedAt?.toISOString() || null,
        selectedPlanId,
        currentStep,
        accountCreated,
        userId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save registration state:", error);
    }
  }, [termsAgreed, termsAgreedAt, selectedPlanId, currentStep, accountCreated, userId, isInitialized]);

  const setTermsAgreed = useCallback((agreed: boolean) => {
    setTermsAgreedState(agreed);
    if (agreed) {
      setTermsAgreedAt(new Date());
    } else {
      setTermsAgreedAt(null);
    }
  }, []);

  const setSelectedPlanId = useCallback((planId: number) => {
    setSelectedPlanIdState(planId);
  }, []);

  const setCurrentStep = useCallback((step: 1 | 2 | 3 | 4) => {
    setCurrentStepState(step);
  }, []);

  const setAccountCreated = useCallback((created: boolean) => {
    setAccountCreatedState(created);
  }, []);

  const setUserId = useCallback((id: string | null) => {
    setUserIdState(id);
  }, []);

  const resetRegistration = useCallback(() => {
    setTermsAgreedState(false);
    setTermsAgreedAt(null);
    setSelectedPlanIdState(null);
    setCurrentStepState(1);
    setAccountCreatedState(false);
    setUserIdState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear registration state:", error);
    }
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        isInitialized,
        termsAgreed,
        termsAgreedAt,
        setTermsAgreed,
        selectedPlanId,
        setSelectedPlanId,
        currentStep,
        setCurrentStep,
        accountCreated,
        setAccountCreated,
        userId,
        setUserId,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

/**
 * useRegistration カスタムフック
 */
export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
}
