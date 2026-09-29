import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  acceptSubmission,
  getBrokerProfile,
  getBrokerStats,
  getSubmissions,
  rejectSubmission,
  updateBrokerProfile,
} from "../services/brokerStore";

const BrokerDataContext = createContext(null);

function emptyValue(refresh) {
  return {
    ready: false,
    profile: null,
    submissions: [],
    stats: { pending: 0, accepted: 0, rejected: 0, total: 0 },
    refresh,
    saveProfile: () => {},
    accept: () => {},
    reject: () => {},
  };
}

export function BrokerDataProvider({ children }) {
  const { broker } = useAuth();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const snapshot = useMemo(() => {
    if (!broker?.id) return null;
    void version;
    const submissions = getSubmissions();
    return {
      profile: getBrokerProfile(),
      submissions,
      stats: getBrokerStats(submissions),
    };
  }, [broker, version]);

  const value = useMemo(() => {
    if (!snapshot) return emptyValue(refresh);

    return {
      ready: true,
      profile: snapshot.profile,
      submissions: snapshot.submissions,
      stats: snapshot.stats,
      refresh,
      saveProfile: (profile) => {
        updateBrokerProfile(profile);
        refresh();
      },
      accept: (submissionId, note) => {
        acceptSubmission(submissionId, note);
        refresh();
      },
      reject: (submissionId, note) => {
        rejectSubmission(submissionId, note);
        refresh();
      },
    };
  }, [snapshot, refresh]);

  return (
    <BrokerDataContext.Provider value={value}>
      {children}
    </BrokerDataContext.Provider>
  );
}

export function useBrokerData() {
  const ctx = useContext(BrokerDataContext);
  if (!ctx) {
    throw new Error("useBrokerData must be used within BrokerDataProvider");
  }
  return ctx;
}
