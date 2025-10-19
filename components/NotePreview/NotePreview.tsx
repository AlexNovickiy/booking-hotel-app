import css from './NotePreview.module.css';

export default function NotePreview() {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2 className={css.noteTitle}>Note Title</h2>
          <span className={css.date}>Date</span>
        </div>
        <p className={css.content}>This is a preview of the note content.</p>
        <div className={css.tags}>
          <span className={css.tag}>Tag1</span>
          <span className={css.tag}>Tag2</span>
        </div>
        <button className={css.backBtn}>Back</button>
      </div>
    </div>
  );
}
