import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, Incident, CommunityActivity, NewsUpdate, MunicipalHotline, ActivityProof, FooterConfig, SubAdminAccount } from '../types';
import { ClimateTopic } from '../components/ClimateInfoSection';
import { compressImage } from '../utils/imageCompressor';

// ==========================================
// USER ACCOUNTS & PROFILES
// ==========================================
export async function saveUserProfileToFirestore(userId: string, profile: UserProfile): Promise<void> {
  // Per Zero-Trust Firestore Security rules, only authenticated Firebase users can write to users/{userId}
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(
      docRef,
      {
        ...profile,
        uid: userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export function subscribeUserProfiles(onUpdate: (profiles: UserProfile[]) => void) {
  const path = 'users';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as UserProfile);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// INCIDENTS
// ==========================================
export async function saveIncidentToFirestore(incident: Incident): Promise<void> {
  const path = `incidents/${incident.id}`;
  try {
    const payload = { ...incident };
    if (payload.imageUrl && payload.imageUrl.startsWith('data:image')) {
      try {
        payload.imageUrl = await compressImage(payload.imageUrl, 800, 800, 0.75);
      } catch (cErr) {
        console.warn('Incident image compression note:', cErr);
      }
    }
    const docRef = doc(db, 'incidents', incident.id);
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeIncidents(onUpdate: (incidents: Incident[]) => void) {
  const path = 'incidents';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Incident[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as Incident);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// ACTIVITIES
// ==========================================
export async function saveActivityToFirestore(activity: CommunityActivity): Promise<void> {
  const path = `activities/${activity.id}`;
  try {
    await setDoc(doc(db, 'activities', activity.id), activity, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteActivityFromFirestore(id: string): Promise<void> {
  const path = `activities/${id}`;
  try {
    await deleteDoc(doc(db, 'activities', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeActivities(onUpdate: (activities: CommunityActivity[]) => void) {
  const path = 'activities';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: CommunityActivity[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CommunityActivity);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// NEWS & ADVISORIES
// ==========================================
export async function saveNewsToFirestore(news: NewsUpdate): Promise<void> {
  const path = `news/${news.id}`;
  try {
    await setDoc(doc(db, 'news', news.id), news, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteNewsFromFirestore(id: string): Promise<void> {
  const path = `news/${id}`;
  try {
    await deleteDoc(doc(db, 'news', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeNews(onUpdate: (news: NewsUpdate[]) => void) {
  const path = 'news';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: NewsUpdate[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as NewsUpdate);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// HOTLINES
// ==========================================
export async function saveHotlineToFirestore(hotline: MunicipalHotline): Promise<void> {
  const path = `hotlines/${hotline.id}`;
  try {
    await setDoc(doc(db, 'hotlines', hotline.id), hotline, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteHotlineFromFirestore(id: string): Promise<void> {
  const path = `hotlines/${id}`;
  try {
    await deleteDoc(doc(db, 'hotlines', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeHotlines(onUpdate: (hotlines: MunicipalHotline[]) => void) {
  const path = 'hotlines';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: MunicipalHotline[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as MunicipalHotline);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// CLIMATE TOPICS
// ==========================================
export async function saveClimateTopicToFirestore(topic: ClimateTopic): Promise<void> {
  const path = `climateTopics/${topic.id}`;
  try {
    await setDoc(doc(db, 'climateTopics', topic.id), topic, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClimateTopicFromFirestore(id: string): Promise<void> {
  const path = `climateTopics/${id}`;
  try {
    await deleteDoc(doc(db, 'climateTopics', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeClimateTopics(onUpdate: (topics: ClimateTopic[]) => void) {
  const path = 'climateTopics';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ClimateTopic[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as ClimateTopic);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// CITIZEN ACTIVITY PROOFS
// ==========================================
export async function saveProofToFirestore(proof: ActivityProof): Promise<void> {
  const path = `proofs/${proof.id}`;
  try {
    await setDoc(doc(db, 'proofs', proof.id), proof, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProofStatusInFirestore(
  proofId: string,
  status: 'Approved' | 'Rejected',
  adminFeedback?: string
): Promise<void> {
  const path = `proofs/${proofId}`;
  try {
    const docRef = doc(db, 'proofs', proofId);
    const updateData: any = { status };
    if (adminFeedback !== undefined) updateData.adminFeedback = adminFeedback;
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeProofs(onUpdate: (proofs: ActivityProof[]) => void) {
  const path = 'proofs';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ActivityProof[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as ActivityProof);
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

// ==========================================
// PORTAL BRANDING & FOOTER CONFIG (LOGO, PLEDGES, TIPS)
// ==========================================
export async function saveFooterConfigToFirestore(config: FooterConfig): Promise<void> {
  const path = 'settings/portalBranding';
  try {
    const payload = { ...config };
    if (payload.logoUrl && payload.logoUrl.startsWith('data:image')) {
      try {
        payload.logoUrl = await compressImage(payload.logoUrl, 400, 400, 0.82);
      } catch (cErr) {
        console.warn('Image compression fallback:', cErr);
      }
    }

    // Also save to localStorage for instant client rendering
    try {
      localStorage.setItem('portal_branding_footer_config', JSON.stringify(payload));
    } catch (_) {}

    await setDoc(doc(db, 'settings', 'portalBranding'), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getFooterConfigFromFirestore(): Promise<FooterConfig | null> {
  const path = 'settings/portalBranding';
  try {
    const snap = await getDoc(doc(db, 'settings', 'portalBranding'));
    if (snap.exists()) {
      const data = snap.data() as FooterConfig;
      try {
        localStorage.setItem('portal_branding_footer_config', JSON.stringify(data));
      } catch (_) {}
      return data;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export function subscribeFooterConfig(onUpdate: (config: FooterConfig) => void) {
  const path = 'settings/portalBranding';
  try {
    const docRef = doc(db, 'settings', 'portalBranding');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as FooterConfig;
          try {
            localStorage.setItem('portal_branding_footer_config', JSON.stringify(data));
          } catch (_) {}
          onUpdate(data);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

export async function deleteIncidentFromFirestore(id: string): Promise<void> {
  const path = `incidents/${id}`;
  try {
    await deleteDoc(doc(db, 'incidents', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deletePendingIncidentsFromFirestore(): Promise<number> {
  const path = 'incidents';
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    let count = 0;
    for (const d of snapshot.docs) {
      const data = d.data() as Incident;
      if (
        data.status === 'Pending Review' ||
        (data.status as string) === 'Pending' ||
        data.isOfflinePending ||
        (data.ticketNumber && data.ticketNumber.includes('OFFLINE-PENDING'))
      ) {
        await deleteDoc(d.ref);
        count++;
      }
    }
    return count;
  } catch (error) {
    console.warn('Note deleting pending from firestore:', error);
    return 0;
  }
}

// ==========================================
// SUB-ADMINISTRATOR ACCOUNTS
// ==========================================
export async function saveSubAdminToFirestore(subAdmin: SubAdminAccount): Promise<void> {
  const path = `subAdmins/${subAdmin.id}`;
  try {
    await setDoc(doc(db, 'subAdmins', subAdmin.id), subAdmin, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSubAdminFromFirestore(id: string): Promise<void> {
  const path = `subAdmins/${id}`;
  try {
    await deleteDoc(doc(db, 'subAdmins', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeSubAdmins(onUpdate: (subAdmins: SubAdminAccount[]) => void) {
  const path = 'subAdmins';
  try {
    const q = query(collection(db, path));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: SubAdminAccount[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as SubAdminAccount);
        });
        if (list.length > 0) {
          try {
            localStorage.setItem('portal_subadmins_cache', JSON.stringify(list));
          } catch (_) {}
          onUpdate(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}


