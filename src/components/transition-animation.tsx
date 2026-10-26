import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type TransitionType = "mysterybox" | "round" | "babak";

interface TransitionAnimationProps {
  type: TransitionType;
  label: string;
  boxCode?: string;
  onComplete: () => void;
}

export function TransitionAnimation({
  type,
  label,
  boxCode,
  onComplete,
}: TransitionAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300); // tunggu exit animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            {type === "mysterybox" && boxCode && (
              <>
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                  className="mx-auto mb-6 flex size-32 items-center justify-center rounded-2xl border-4 border-primary bg-primary/10"
                >
                  <span className="text-6xl font-bold text-primary">
                    {boxCode}
                  </span>
                </motion.div>
                <h2 className="text-4xl font-bold">Mystery Box {boxCode}</h2>
                <p className="mt-2 text-xl text-muted-foreground">{label}</p>
              </>
            )}

            {type === "round" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-4 text-7xl font-bold text-primary"
                >
                  🎯
                </motion.div>
                <h2 className="text-4xl font-bold">{label}</h2>
                <p className="mt-2 text-xl text-muted-foreground">
                  Siap untuk soal berikutnya
                </p>
              </>
            )}

            {type === "babak" && (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-4 text-7xl font-bold"
                >
                  🏆
                </motion.div>
                <h2 className="text-5xl font-bold text-primary">{label}</h2>
                <p className="mt-3 text-xl text-muted-foreground">
                  Babak baru dimulai
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
