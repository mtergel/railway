interface NoteGridProps {
  folderId: string | null | undefined;
}

export const NoteGrid: React.FC<NoteGridProps> = ({ folderId }) => {
  if (!folderId) {
    return null;
  }

  // const ref = firebaseClient
  // .firestore()
  // .collection("notes")

  // useEffect(() => {
  //     const unsubscribe = ref.onSnapshot((snap) => {
  //         const data = snap.
  //     //   const data = snap.docs.map((doc) => {
  //     //     return {
  //     //       id: doc.id,
  //     //       ...doc.data(),
  //     //     };
  //     //   });
  //     //   setFolders(data);
  //     });

  //     //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
  //     return () => unsubscribe();
  //   }, []);

  return <div className="grid grid-flow-col auto-cols-185"></div>;
};
