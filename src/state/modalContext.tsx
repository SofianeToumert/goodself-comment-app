import { createContext, useState, useCallback, type ReactNode } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';

type ModalConfig = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
};

type ModalContextValue = {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    config?.onConfirm();
    closeModal();
  }, [config, closeModal]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        title={config?.title ?? ''}
        message={config?.message ?? ''}
        confirmLabel={config?.confirmLabel}
        cancelLabel={config?.cancelLabel}
        variant={config?.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
};
