import { Fragment, forwardRef, useCallback, useEffect } from 'react';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { Focustrap } from 'ui';

import { usePortal, usePrevious, useMount, useTimeoutEffect } from 'hooks';

import ModalClasses from './Modal.module.scss';

export const modalTrappersId = {
  start: 'modal-trapper-start',
  end: 'modal-trapper-end'
};

type ModalComponents = 'root' | 'backdrop' | 'dialog';

export interface ModalProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  onHide?(): void;
  show: boolean;
  className?: Partial<Record<ModalComponents, string>>;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  fullWidth?: boolean;
  disableGutters?: boolean;
  disablePortal?: boolean;
  disableOverlay?: boolean;
}

function ModalWrapper({
  children,
  show,
  showPrev,
  didMount
}: React.PropsWithChildren<{
  showPrev?: boolean | null;
  show?: boolean;
  didMount?: boolean;
}>) {
  const Portal = usePortal({
    root: document.body,
    onEffect() {
      document.body.classList.add(ModalClasses.overflow);

      return () => document.body.classList.remove(ModalClasses.overflow);
    }
  });
  const timeoutEffect = useTimeoutEffect();

  useEffect(() => {
    if (showPrev && !show) {
      if (didMount) timeoutEffect(Portal.unmount, 300);
    } else {
      Portal.mount(!!show);
    }
  }, [Portal, didMount, show, showPrev, timeoutEffect]);

  return <Portal>{children}</Portal>;
}
export default forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    onHide,
    show,
    className,
    centered,
    size,
    fullScreen,
    fullWidth,
    disableGutters,
    disablePortal,
    disableOverlay,
    ...props
  },
  ref
) {
  const { current: didMount } = useMount();
  const { current: showPrev } = usePrevious(show);
  const handleRootKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') onHide?.();
    },
    [onHide]
  );
  const handleBackdropClick = useCallback(() => onHide?.(), [onHide]);
  const ModalWrapperComponent = disablePortal ? Fragment : ModalWrapper;

  return (
    <ModalWrapperComponent
      {...(!disablePortal && { show, showPrev, didMount })}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            className={cn(
              ModalClasses.root,
              {
                [ModalClasses.flex]: centered,
                [ModalClasses.gutters]: !disableGutters
              },
              className?.root
            )}
            onKeyDown={handleRootKeydown}
          >
            <div
              aria-hidden="true"
              className={cn(
                ModalClasses.backdrop,
                {
                  [ModalClasses.overlay]: !disableOverlay
                },
                className?.backdrop
              )}
              onClick={handleBackdropClick}
            />
            <Focustrap<HTMLDivElement> trappersId={modalTrappersId}>
              <motion.div
                ref={ref}
                initial={{ y: 8 }}
                animate={{ y: 0 }}
                exit={{ y: 8 }}
                role="dialog"
                aria-modal="true"
                className={cn(
                  ModalClasses.dialog,
                  {
                    [ModalClasses.center]: centered,
                    [ModalClasses.sm]: size === 'sm',
                    [ModalClasses.md]: size === 'md',
                    [ModalClasses.lg]: size === 'lg',
                    [ModalClasses.fullScreen]: fullScreen,
                    [ModalClasses.fullWidth]: fullWidth
                  },
                  className?.dialog
                )}
                {...props}
              />
            </Focustrap>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalWrapperComponent>
  );
});
