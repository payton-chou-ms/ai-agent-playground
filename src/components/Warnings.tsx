"use client";

import React, { useState } from "react";
import styles from "./Warnings.module.css";
import { useContexts } from "../AppProvider";

const Warnings = () => {
  const { assistantIdRef } = useContexts();

  const [loading, setLoading] = useState(false);
  const [newAssistantId, setNewAssistantId] = useState("");

  const fetchAssistantId = async () => {
    setLoading(true);

    const response = await fetch("/api/assistants", { method: "POST" });
    const data = await response.json();
    setNewAssistantId(data.assistantId);

    setLoading(false);
  };

  return (
    <>
      {!assistantIdRef.current && (
        <div className={styles.container}>
          <h1>Start by creating your assistant</h1>
          <div className={styles.message}>
            Create an assistant and set its ID in{" "}
            <span>app/assistant-config.ts</span>
          </div>
          {!newAssistantId ? (
            <button
              onClick={fetchAssistantId}
              disabled={loading}
              className={styles.button}
            >
              {loading ? "Loading..." : "Create Assistant"}
            </button>
          ) : (
            <div className={styles.result}>{newAssistantId}</div>
          )}
        </div>
      )}
    </>
  );
};

export default Warnings;
