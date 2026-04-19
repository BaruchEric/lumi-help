/**
 * Example: persist help-center progress to Firestore, with optimistic
 * localStorage caching. Drop this into Lumina (or any Firebase app) and pass
 * it to <LearnModeProvider adapter={firestoreHelpProgressAdapter(db, uid)}>.
 */
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore'
import {
  blankDoc,
  createLocalStorageAdapter,
  type HelpProgressAdapter,
  type HelpProgressDoc,
} from 'lumi-help'

export const HELP_PROGRESS_COLLECTION = 'helpProgress'

export function firestoreHelpProgressAdapter(
  db: Firestore,
  uid: string,
): HelpProgressAdapter {
  const local = createLocalStorageAdapter(`lumi-help.progress:${uid}`)
  const ref = doc(db, HELP_PROGRESS_COLLECTION, uid)

  return {
    async load() {
      // Serve localStorage first so the first paint is instant, then reconcile
      // with Firestore asynchronously (the hook re-renders on the second load).
      const cached = await local.load()
      try {
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const remote = { ...blankDoc(uid), ...(snap.data() as Partial<HelpProgressDoc>), uid }
          await local.save(remote)
          return remote
        }
      } catch {
        /* offline / permission — fall through to cached */
      }
      return cached
    },
    async save(next) {
      await local.save(next)
      try {
        await setDoc(
          ref,
          {
            ...next,
            uid,
            updatedAt: Date.now(),
            _serverUpdatedAt: serverTimestamp(),
          },
          { merge: true },
        )
      } catch {
        /* transient — next interaction retries */
      }
    },
  }
}
