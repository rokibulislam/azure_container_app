'use client';

export default function AttachmentList({ attachments, onOpen }) {
  if (!attachments?.length) {
    return <p className="muted">No attachments.</p>;
  }

  return (
    <div className="card">
      <h3>Attachments</h3>
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="row"
          style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
        >
          <div>
            <strong>{attachment.original_filename}</strong>
            <div className="muted">{attachment.content_type || 'Unknown type'}</div>
          </div>
          <button onClick={() => onOpen(attachment.id)}>Open</button>
        </div>
      ))}
    </div>
  );
}