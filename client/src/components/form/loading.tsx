"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface LoadingProps {
  message?: string;
  messageKey?: string;
}

const themeColorFallback = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--primary)",
];

export default function Loading({ message, messageKey }: LoadingProps) {
  const { t } = useTranslation();
  const text = messageKey
    ? t(messageKey)
    : message
      ? t(message, { defaultValue: message })
      : t("common.status.loading");
  const [colors, setColors] = useState(themeColorFallback);

  useEffect(() => {
    const readColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const primary =
        styles.getPropertyValue("--primary").trim() || themeColorFallback[0];
      const chart2 =
        styles.getPropertyValue("--chart-2").trim() || themeColorFallback[1];
      const chart3 =
        styles.getPropertyValue("--chart-3").trim() || themeColorFallback[2];
      const chart4 =
        styles.getPropertyValue("--chart-4").trim() || themeColorFallback[3];

      setColors([primary, chart2, chart3, chart4, primary]);
    };

    readColors();

    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/60 backdrop-blur-md"
    >
      <div className="flex space-x-2">
        {[0, 0.2, 0.4].map((delay, index) => (
          <motion.span
            key={index}
            className="w-4 h-4 rounded-full"
            animate={{
              y: ["0%", "-60%", "0%"],
              scale: [1, 1.3, 1],
              backgroundColor: colors,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay,
            }}
          />
        ))}
      </div>

      <div className="flex space-x-1 text-2xl font-bold">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            animate={{
              color: colors,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
